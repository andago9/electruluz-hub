# Diseño: Edición del blog online con backend PHP

**Fecha:** 2026-07-01
**Proyecto:** electruluz-hub (Ferretería Electroluz)
**Estado:** Diseño aprobado — pendiente de plan de implementación

## Objetivo

Permitir crear, editar y borrar artículos del blog **online** desde el sitio
publicado, sabiendo que el hosting es **estático + PHP** (Apache, sin Node). Se
reemplaza Keystatic (que solo funcionaba en local) por un backend PHP propio y un
editor a medida dentro del SPA. El blog público se sirve con SEO server-side.

## Contexto técnico actual

- SPA con **TanStack Start (modo SPA)** + React 19, compilado con Vite a `dist/`.
- Desplegado como archivos estáticos a Apache; `.htaccess` hace fallback SPA a
  `index.html`. `VITE_BASE_PATH=/` en producción.
- El blog hoy hornea los `.mdoc` en build (`src/lib/blog.ts` con `import.meta.glob`).
- El cuerpo del post se renderiza en cliente con **Markdoc** (`MarkdocContent.tsx`).
- Hosting de producción **sí tiene PHP** (confirmado por el usuario).

## Decisiones aprobadas

1. **Editor propio con barra de formato**: editor Markdown con toolbar (negrita,
   cursiva, H2/H3, lista, cita, enlace, insertar imagen) + **vista previa en vivo**
   reutilizando `MarkdocContent`. El cuerpo se guarda como Markdown.
2. **Imágenes subidas al servidor** vía PHP: portada + imágenes internas del cuerpo.
3. **SEO importante → render server-side en PHP** (Enfoque híbrido 1): `blog.php`
   inyecta `<head>` (title, meta, og, canonical, JSON-LD) y el HTML del artículo;
   el SPA toma el control después.
4. **Reemplazar Keystatic por completo** (una sola fuente de posts).
5. **Siempre publicado** (sin estado borrador).

## Arquitectura y estructura de archivos

Todo en la misma raíz web. Se distingue **código** (se reemplaza en cada deploy) de
**datos** (persisten entre deploys):

```
raíz web (public_html)
├── index.html, assets/…        ← SPA compilado (dist), se reemplaza en cada deploy
├── blog.php                    ← render SEO de /blog y /blog/:slug
├── api/                        ← backend PHP (CÓDIGO)
│   ├── config.php              ← rutas, hash de contraseña admin, sesión
│   ├── auth.php                ← login / logout / estado
│   ├── posts.php               ← CRUD de posts
│   ├── upload.php              ← subida de imágenes
│   └── lib/                    ← auth, storage, Parsedown, helpers de respuesta
├── content/          🔒 DATOS  ← posts .md + index.json (no público)
│   └── posts/*.md
├── uploads/blog/     🔒 DATOS  ← imágenes subidas (público)
└── .htaccess                   ← enrutado
```

- **Código PHP en el repo:** vive en `public/` (Vite copia `public/` tal cual a
  `dist/`), así el build incluye `api/`, `blog.php`, etc.
- **Datos (`content/`, `uploads/`):** se crean una vez en el servidor y **NO se
  pisan** en redeploys. Cambia la instrucción actual de "borrar todo y subir dist".

### Enrutado `.htaccess`

- `/api/*` y `/uploads/*` → archivos directos.
- `/blog` y `/blog/<slug>` → `blog.php`.
- Resto → `index.html` (SPA).
- `uploads/` con regla que impide ejecutar PHP; `content/` sin acceso web directo.

## Modelo de datos

Un archivo Markdown por post, con frontmatter YAML:

```markdown
---
title: Cómo elegir paneles solares
slug: como-elegir-paneles-solares
publishedAt: 2026-07-01
excerpt: Guía rápida para escoger el panel adecuado.
coverImage: /uploads/blog/paneles-abc123.jpg
updatedAt: 2026-07-01T14:30:00
---
Cuerpo en **Markdown**…
```

- `content/posts/<slug>.md` — el `slug` (minúsculas, sin acentos, guiones) es
  nombre de archivo y URL.
- `content/index.json` — índice generado al guardar/borrar (title, slug,
  publishedAt, excerpt, coverImage). Listado y panel lo leen de un tiro.
- Imágenes: `uploads/blog/<nombre>-<aleatorio>.<ext>`.
- Escritura **atómica** (temp + `rename`) con bloqueo para no corromper datos.
- Sin migración: el blog está vacío; se crea `index.json` vacío.

## API PHP

Respuestas JSON con códigos HTTP correctos.

| Método + ruta | Qué hace | ¿Sesión? |
|---|---|---|
| `POST /api/auth.php?action=login` | Verifica contraseña, abre sesión | No |
| `POST /api/auth.php?action=logout` | Cierra sesión | Sí |
| `GET /api/auth.php?action=status` | ¿Sesión activa? | — |
| `GET /api/posts.php` | Lista posts (index.json) | No (público) |
| `GET /api/posts.php?slug=x` | Un post completo | No (público) |
| `POST /api/posts.php` | Crear/editar post | Sí |
| `DELETE /api/posts.php?slug=x` | Borrar post | Sí |
| `POST /api/upload.php` | Subir imagen | Sí |

## Autenticación y seguridad

- Contraseña única de admin; en `config.php` solo el **hash** (`password_hash`/bcrypt).
- Sesión PHP con cookie **httpOnly + SameSite=Strict**.
- Escrituras exigen sesión (`401` si no) + cabecera `X-Requested-With` (refuerzo CSRF).
- Anti-fuerza bruta: retardo + bloqueo temporal tras varios fallos.
- Contraseña se fija con `api/set-password.php` (o `password_hash` manual) → hash a
  `config.php`. Se documenta.
- Subidas: solo imágenes (extensión + MIME real + tamaño máx. ~5 MB), nombre
  aleatorio; `.htaccess` en `uploads/` impide ejecutar PHP.
- `content/` bloqueado al acceso web directo.

Esto reemplaza el login "de mentira" del cliente: la contraseña ya no viaja en el JS.

## Blog público con SEO (server-side)

Petición a `/blog/<slug>`:

1. `.htaccess` → `blog.php`.
2. `blog.php`: carga el `.md`, convierte Markdown→HTML con **Parsedown** (1 archivo
   PHP), toma `index.html` como plantilla, inyecta en `<head>` (title, meta
   description, og:*, canonical, JSON-LD de artículo) y el HTML del artículo en un
   contenedor **separado de `<div id="root">`**. Si no existe el slug → `404` + 404 del SPA.
3. En el navegador el SPA arranca y toma el control.

- **FOUC:** el contenedor SEO va fuera de `#root`; React no lo pisa y se oculta al
  montar el SPA.
- `/blog` (índice): inyecta title/meta del listado + enlaces a posts para el crawler.
- Sin reconstrucción: `blog.php` lee plantilla + datos en cada petición.

## Panel y editor (React, en el SPA)

Ruta **`/admin`** (reemplaza `/keystatic`):

- **Login**: reutiliza la pantalla de login ya diseñada, pero envía a `api/auth.php`.
- **Lista de posts**: título, fecha, *Editar* / *Borrar* (con confirmación), "Nuevo".
- **Editor**: Título, Fecha, Resumen, Imagen de portada (subir), Cuerpo (textarea +
  toolbar + insertar imagen), **vista previa en vivo** con `MarkdocContent`. Guardar
  (POST) / Cancelar. Toasts con `sonner`.
- Datos con `@tanstack/react-query`.

Componentes (pequeños y enfocados):
`admin.tsx` (ruta, orquesta login vs panel), `AdminLogin`, `PostList`,
`PostEditor`, `MarkdownToolbar`, `ImageUploadButton`, `src/lib/admin-api.ts`.

## Cambios en el cliente

- **Retirar Keystatic**: borrar `src/keystatic.config.tsx`, rutas
  `keystatic.index/$`, `api.keystatic.$`, componentes `keystatic-admin/login`;
  quitar dependencia `@keystatic/core`. `@markdoc/markdoc` se queda (lo usa el blog).
  Quitar del `postbuild`/`.env` el Basic Auth y `VITE_KEYSTATIC_PASSWORD`.
- **Blog en runtime** (`src/lib/blog.ts`): de `import.meta.glob` a **fetch a
  `api/posts.php`** con react-query. `blog.index.tsx` y `blog.$slug.tsx` cargan en
  runtime; conservan estado vacío y "no encontrado". `withBase` se mantiene.

## Manejo de errores

- API: JSON + código HTTP (`400` datos, `401` sin sesión, `404` no existe, `413`
  imagen grande, `500` servidor).
- Cliente: toasts claros; estados de carga/error en lista, editor y blog.
- Escritura atómica con bloqueo; si falla, no corrompe `index.json`.

## Pruebas (pragmáticas)

- **PHP**: script de humo con `curl` contra XAMPP local: login OK/fallido;
  crear→listar→leer→editar→borrar; subida válida/inválida; escrituras sin sesión → `401`.
- **Cliente**: verificación manual guiada (login, crear post con imagen, ver en
  `/blog`, revisar meta SEO en "ver código fuente").
- No se añaden frameworks de test pesados (el proyecto no tiene suite hoy).

## Despliegue

- **Primer setup**: crear `content/` y `uploads/blog/` con permisos de escritura;
  fijar la contraseña admin.
- **Redeploy**: subir `dist/` **sin borrar** `content/` ni `uploads/`.

## Fuera de alcance (YAGNI)

- Múltiples usuarios/roles. Un solo admin.
- Estado borrador. Todo se publica.
- Comentarios, categorías, tags (se pueden añadir después).
- Regeneración de archivos estáticos por post (se usa render dinámico PHP).
