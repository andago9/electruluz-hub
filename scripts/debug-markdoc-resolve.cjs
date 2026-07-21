const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");

const root = path.join(__dirname, "..");
const logPath = path.join(root, "debug-bfe323.log");
const sessionId = "bfe323";

function log(hypothesisId, location, message, data) {
	const entry = {
		sessionId,
		hypothesisId,
		location,
		message,
		data,
		timestamp: Date.now(),
		runId: process.env.DEBUG_RUN_ID || "diag-pre",
	};
	fs.appendFileSync(logPath, JSON.stringify(entry) + "\n");
	console.log(`[${hypothesisId}] ${message}`, JSON.stringify(data));
}

const pkgJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const inDeps = !!(pkgJson.dependencies && pkgJson.dependencies["@markdoc/markdoc"]);
log("A", "debug-markdoc-resolve.cjs:deps", "Listed in package.json dependencies?", {
	inDeps,
	version: pkgJson.dependencies?.["@markdoc/markdoc"] ?? null,
});

const nmPath = path.join(root, "node_modules", "@markdoc", "markdoc");
const nmExists = fs.existsSync(nmPath);
log("A", "debug-markdoc-resolve.cjs:nm", "Top-level node_modules/@markdoc/markdoc exists?", {
	nmExists,
	nmPath,
});

if (nmExists) {
	try {
		const pkgMeta = JSON.parse(fs.readFileSync(path.join(nmPath, "package.json"), "utf8"));
		log("B", "debug-markdoc-resolve.cjs:meta", "Package metadata", {
			name: pkgMeta.name,
			version: pkgMeta.version,
			main: pkgMeta.main ?? null,
			module: pkgMeta.module ?? null,
			exports: pkgMeta.exports ?? null,
			type: pkgMeta.type ?? null,
		});
	} catch (e) {
		log("B", "debug-markdoc-resolve.cjs:meta", "Failed reading package.json", {
			error: String(e),
		});
	}
} else {
	log("B", "debug-markdoc-resolve.cjs:meta", "Skipped - package folder missing", {});
}

const nestedPath = path.join(
	root,
	"node_modules",
	"@keystatic",
	"core",
	"node_modules",
	"@markdoc",
	"markdoc",
);
log("D", "debug-markdoc-resolve.cjs:nested", "Nested keystatic markdoc exists?", {
	nestedExists: fs.existsSync(nestedPath),
	keystaticCoreExists: fs.existsSync(path.join(root, "node_modules", "@keystatic", "core")),
});

const req = createRequire(path.join(root, "src", "components", "MarkdocContent.tsx"));
try {
	const resolved = req.resolve("@markdoc/markdoc");
	log("C", "debug-markdoc-resolve.cjs:resolve", "createRequire.resolve succeeded", {
		resolved,
	});
} catch (e) {
	log("C", "debug-markdoc-resolve.cjs:resolve", "createRequire.resolve FAILED", {
		error: String(e),
		code: e.code ?? null,
	});
}

import("@markdoc/markdoc")
	.then((imported) => {
		log("E", "debug-markdoc-resolve.cjs:esm", "Dynamic import succeeded", {
			keys: Object.keys(imported).slice(0, 10),
			hasDefault: !!imported.default,
		});
	})
	.catch((e) => {
		log("E", "debug-markdoc-resolve.cjs:esm", "Dynamic import FAILED", {
			error: String(e),
		});
	});
