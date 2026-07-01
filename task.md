# task.md — Blog online con backend PHP (tracker temporal)

> **Cómo usar este archivo:** es el punto de continuación entre sesiones. Al
> retomar, léelo PRIMERO (evita releer todo el chat). Al terminar cada sesión,
> actualiza **Estado actual**, **Siguiente paso** y los checkboxes. Mantenlo
> conciso. Diseño completo: `docs/superpowers/specs/2026-07-01-blog-php-backend-design.md`.

**Última actualización:** 2026-07-01 — **TODO implementado (F0–F9)**. Backend PHP + frontend + build + integración verificados. Falta solo: verificación manual del editor en navegador y primer deploy real.

### Revisión del backend (2026-07-01) — 4 correcciones aplicadas y verificadas
1. `blog.php`: slug con formato inválido ahora da **404 HTML** (antes error JSON). ✅
2. `storage.php` `atomic_write`: fallback para **Windows** (rename falla si el destino existe) → editar el mismo slug ahora sobrescribe bien. ✅ (probado: 1 solo `.md`, excerpt actualizado)
3. `storage.php` `read_post`: `coverImage` con null-coalescing (sin avisos si falta). ✅
4. `auth.php` `write_throttle`: poda entradas expiradas (el archivo no crece sin límite). ✅
Nota de pruebas: en Git Bash, **no** usar `export MSYS2_ARG_CONV_EXCL='*'` junto con `curl -b /tmp/cookies` (rompe la lectura del cookie jar y da 401 falso). Para args `/blog/...` sí hace falta; separarlo de las llamadas con cookies.

## Objetivo
Editar el blog online en hosting estático + PHP. Reemplazar Keystatic por backend
PHP propio + editor a medida en el SPA. Blog público con SEO server-side.

## Decisiones bloqueadas
- Editor propio con barra de formato Markdown + vista previa (Markdoc).
- Imágenes subidas vía PHP (portada + cuerpo).
- SEO: `blog.php` renderiza HTML server-side (Parsedown). Enfoque híbrido.
- Reemplazar Keystatic por completo.
- Siempre publicado (sin borrador). Un solo admin.

## Mapa (código vs datos)
- Código PHP en `public/` → Vite lo copia a `dist/`. `public/api/*.php`, `public/blog.php`.
- Datos en servidor (NO pisar en redeploy): `content/posts/*.md`, `content/index.json`, `uploads/blog/`.
- Rutas .htaccess: `/api/*` y `/uploads/*` directos; `/blog` y `/blog/:slug` → `blog.php`; resto → `index.html`.

## Fases de implementación
Leyenda: [ ] pendiente · [~] en progreso · [x] hecho

- [x] **F0 Scaffolding**: `public/api/lib`, `.htaccess` de `content/` y `uploads/blog/`; `config.php` (hash bcrypt de `Admin123`, sesión). *(Falta el `.htaccess` raíz con rutas → va en F8/postbuild.)*
- [x] **F1 Auth PHP**: `lib/response.php`, `lib/auth.php` (sesión httpOnly+SameSite=Strict, throttle por IP), `auth.php` (login/logout/status), `set-password.php` (CLI). PROBADO.
- [x] **F2 Posts PHP**: `lib/storage.php` (frontmatter JSON-por-campo, index.json, escritura atómica, slugify con mapa de acentos), `posts.php` (GET público; POST/DELETE con sesión + X-Requested-With). PROBADO.
- [x] **F3 Upload PHP**: `upload.php` (valida ext+MIME real+tamaño, nombre aleatorio); `lib/Parsedown.php` (v1.7.4). PROBADO (rechaza PHP disfrazado y sin sesión).
- [x] **F4 blog.php SEO**: Parsedown→HTML, inyecta head (title/meta/og/canonical/JSON-LD) + `#seo-content` oculto; 404 correcto. PROBADO.
- [x] **F5 Cliente API + quitar Keystatic**: `src/lib/admin-api.ts` (contrato completo); borrados keystatic.config, rutas y componentes; dep `@keystatic/core` fuera; proxy dev en `vite.config.ts` (`/api`,`/uploads`→127.0.0.1:8787); env limpiado.
- [x] **F6 Panel /admin**: `routes/admin.tsx` (gate auth con react-query), `components/admin/`: `AdminLogin`, `AdminPanel`, `PostList`, `PostEditor`, `MarkdownToolbar` (con subida de imagen). Toaster montado. Vista previa con MarkdocContent.
- [x] **F7 Blog runtime**: `blog.ts` → fetch a la API; `blog.index.tsx` y `blog.$slug.tsx` con react-query (loading/vacío/no encontrado); head genérico (el SEO real lo da blog.php). Rutas `ssr:false`.
- [x] **F8 Build/deploy**: postbuild reescrito (`.htaccess` con `/blog`→blog.php, protección .ht, exclusión api/uploads/assets); `.gitignore` versiona `public/api|blog.php|.htaccess`, ignora datos runtime (verificado con git check-ignore).
- [x] **F9 Pruebas**: build OK sin errores TS; integración end-to-end con `php -S`+dist verificada (login→crear→blog.php SEO único→API lista). **Pendiente: verificación manual del editor en navegador + primer deploy.**

## Cómo desarrollar en local (2 procesos)
1. Backend: `C:\xampp\php\php.exe -S 127.0.0.1:8787 -t public`
2. Frontend: `npm run dev` (Vite proxya /api y /uploads al 8787).
3. Abrir http://localhost:3000/admin (contraseña `Admin123`). Cambiarla: `php public/api/set-password.php "Nueva"` → pegar hash en `public/api/config.php`.

## Cómo desplegar
`npm run build` → subir el CONTENIDO de `dist/` al hosting. En el servidor:
crear `content/posts/` y `uploads/blog/` con permisos de escritura (755/775). **En
redeploys NO borrar `content/` ni `uploads/`**. Requiere PHP + mod_rewrite.

## Contrato de la API (para el frontend F5–F7)
Base: mismas rutas del sitio. Escrituras: cookie de sesión (`credentials:'include'` / same-origin) **y** cabecera `X-Requested-With: XMLHttpRequest`.
- `GET  /api/auth.php?action=status` → `{authenticated:bool}`
- `POST /api/auth.php?action=login` body `{password}` → 200 `{ok:true}` | 401 | 429
- `POST /api/auth.php?action=logout` → `{ok:true}`
- `GET  /api/posts.php` → `[{title,slug,publishedAt,excerpt,coverImage}]`
- `GET  /api/posts.php?slug=x` → `{...,body}` | 404
- `POST /api/posts.php` body `{title,publishedAt?,excerpt?,coverImage?,body,slug?}` → post guardado (crear: sin slug; editar: con slug)
- `DELETE /api/posts.php?slug=x` → `{ok:true}` | 404
- `POST /api/upload.php` multipart `file` → `{url}` | 401/413/415
Errores: `{error:mensaje}` + código HTTP.

## Cómo probar el backend (recordatorio)
`/c/xampp/php/php.exe -S 127.0.0.1:8099 -t public` (API). Para blog.php hace falta un
`index.html` en public/ (usar el `dist/` construido, o uno temporal que se borra antes de `npm run build`, porque Vite falla si existe `public/index.html`). En Git Bash usar `export MSYS2_ARG_CONV_EXCL='*'` al pasar rutas `/blog/...` como argumento.

## Estado actual
Funcionalidad completa (F0–F9): backend PHP + editor React en /admin + blog runtime
+ SEO server-side. Build limpio. Integración verificada con php -S.

## Siguiente paso
1. Verificación manual del editor en navegador (2 procesos, ver arriba): login,
   crear post con imagen de portada e imagen en el cuerpo, ver en /blog, revisar
   meta SEO con "ver código fuente" de /blog/:slug.
2. Primer deploy real (crear content/ y uploads/ con permisos; subir dist/).
3. (Opcional) commitear el trabajo.

## Notas / trampas a recordar
- Producción es estático + PHP; NO hay Node. XAMPP local también tiene PHP (el
  editor funciona local y online).
- `content/` y `uploads/` deben persistir entre deploys (no borrarlos).
- Cliente usa Markdoc para preview/blog; PHP usa Parsedown para SEO (dos renderers,
  cada uno en su dominio; es esperado).
- El blog está vacío ahora (posts borrados en sesión previa).
