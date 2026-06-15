import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('public/admin', { recursive: true });
writeFileSync(
	'public/admin/index.html',
	`<!doctype html>
<html lang="de">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="robots" content="noindex,nofollow">
		<title>TinaCMS wird gerade synchronisiert</title>
		<style>
			:root { color-scheme: light; font-family: Manrope, system-ui, sans-serif; background: #f3ecdf; color: #231815; }
			body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 32px; }
			main { max-width: 680px; border: 1px solid rgba(35, 24, 21, .16); background: rgba(255, 252, 246, .78); padding: 34px; }
			h1 { margin: 0 0 14px; font: 600 34px/1.12 Georgia, serif; }
			p { margin: 0 0 12px; line-height: 1.65; }
			code { background: rgba(35, 24, 21, .08); padding: 2px 6px; }
		</style>
	</head>
	<body>
		<main>
			<h1>TinaCMS synchronisiert gerade.</h1>
			<p>Die Website ist online, aber der TinaCloud-Index fuer <code>main</code> ist noch nicht bereit. Bitte in TinaCloud den Branch neu indexieren und anschliessend erneut deployen.</p>
			<p>So vermeiden wir, dass ein kaputtes Admin mit GraphQL-Schema-Mismatch live geht.</p>
		</main>
	</body>
</html>
`,
	'utf8',
);
