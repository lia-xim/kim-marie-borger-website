<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
	exclude-result-prefixes="sm"
>
	<xsl:output method="html" encoding="UTF-8" indent="yes" />

	<xsl:template match="/">
		<html lang="de">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Sitemap | Kim Marie Borger</title>
				<style>
					:root {
						color-scheme: light;
						--ink: #211915;
						--muted: #78695d;
						--line: #dfd1be;
						--paper: #fbf7ee;
						--panel: #fffdf8;
						--accent: #8f2f4c;
						--accent-soft: #f4dde4;
						--gold: #b48b50;
					}

					* {
						box-sizing: border-box;
					}

					body {
						margin: 0;
						background:
							linear-gradient(135deg, rgba(143, 47, 76, 0.08), transparent 34rem),
							linear-gradient(180deg, #fbf7ee 0%, #f4ecde 100%);
						color: var(--ink);
						font-family: Manrope, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
						line-height: 1.55;
					}

					main {
						width: min(1180px, calc(100% - 40px));
						margin: 0 auto;
						padding: 48px 0 64px;
					}

					.hero {
						display: grid;
						gap: 24px;
						grid-template-columns: minmax(0, 1fr) auto;
						align-items: end;
						margin-bottom: 28px;
					}

					.kicker {
						margin: 0 0 10px;
						color: var(--accent);
						font-size: 0.78rem;
						font-weight: 800;
						letter-spacing: 0.14em;
						text-transform: uppercase;
					}

					h1 {
						margin: 0;
						font-family: Georgia, "Times New Roman", serif;
						font-size: clamp(2.4rem, 5vw, 5.6rem);
						font-weight: 500;
						line-height: 0.96;
						letter-spacing: 0;
					}

					.lede {
						max-width: 760px;
						margin: 18px 0 0;
						color: var(--muted);
						font-size: 1rem;
					}

					.stats {
						display: grid;
						grid-template-columns: repeat(2, minmax(120px, 1fr));
						gap: 10px;
						min-width: 260px;
					}

					.stat {
						border: 1px solid var(--line);
						border-radius: 8px;
						background: rgba(255, 253, 248, 0.78);
						padding: 14px 16px;
					}

					.stat strong {
						display: block;
						font-family: Georgia, "Times New Roman", serif;
						font-size: 1.9rem;
						font-weight: 500;
						line-height: 1;
					}

					.stat span {
						display: block;
						margin-top: 5px;
						color: var(--muted);
						font-size: 0.78rem;
						font-weight: 800;
						letter-spacing: 0.09em;
						text-transform: uppercase;
					}

					.category-grid {
						display: grid;
						grid-template-columns: repeat(7, minmax(0, 1fr));
						gap: 8px;
						margin: 26px 0 22px;
					}

					.category-card {
						border: 1px solid var(--line);
						border-radius: 8px;
						background: rgba(255, 253, 248, 0.72);
						padding: 12px;
					}

					.category-card strong {
						display: block;
						font-size: 1.35rem;
						line-height: 1;
					}

					.category-card span {
						display: block;
						margin-top: 6px;
						color: var(--muted);
						font-size: 0.76rem;
						font-weight: 800;
						letter-spacing: 0.07em;
						text-transform: uppercase;
					}

					.table-wrap {
						overflow: hidden;
						border: 1px solid var(--line);
						border-radius: 8px;
						background: var(--panel);
						box-shadow: 0 20px 70px rgba(49, 37, 27, 0.08);
					}

					table {
						width: 100%;
						border-collapse: collapse;
					}

					th,
					td {
						padding: 15px 18px;
						border-bottom: 1px solid #eadfce;
						text-align: left;
						vertical-align: top;
					}

					th {
						position: sticky;
						top: 0;
						z-index: 1;
						background: #f6efe3;
						color: #5f5145;
						font-size: 0.72rem;
						font-weight: 900;
						letter-spacing: 0.12em;
						text-transform: uppercase;
					}

					tr:last-child td {
						border-bottom: 0;
					}

					tr:hover td {
						background: #fff8ed;
					}

					a {
						color: var(--accent);
						text-decoration: none;
					}

					a:hover {
						text-decoration: underline;
					}

					.url {
						display: inline-block;
						max-width: 720px;
						overflow-wrap: anywhere;
						font-weight: 800;
					}

					.badge {
						display: inline-flex;
						align-items: center;
						min-height: 26px;
						border-radius: 999px;
						background: var(--accent-soft);
						color: var(--accent);
						padding: 4px 10px;
						font-size: 0.76rem;
						font-weight: 900;
						letter-spacing: 0.04em;
						text-transform: uppercase;
						white-space: nowrap;
					}

					.small {
						color: var(--muted);
						font-size: 0.9rem;
					}

					.footer-note {
						margin: 18px 0 0;
						color: var(--muted);
						font-size: 0.92rem;
					}

					@media (max-width: 920px) {
						.hero {
							grid-template-columns: 1fr;
						}

						.stats {
							min-width: 0;
						}

						.category-grid {
							grid-template-columns: repeat(2, minmax(0, 1fr));
						}
					}

					@media (max-width: 640px) {
						main {
							width: min(100% - 24px, 1180px);
							padding-top: 32px;
						}

						.category-grid,
						.stats {
							grid-template-columns: 1fr;
						}

						th:nth-child(3),
						td:nth-child(3),
						th:nth-child(4),
						td:nth-child(4) {
							display: none;
						}

						th,
						td {
							padding: 13px 12px;
						}
					}
				</style>
			</head>
			<body>
				<main>
					<section class="hero" aria-labelledby="sitemap-title">
						<div>
							<p class="kicker">Kim Marie Borger</p>
							<h1 id="sitemap-title">Sitemap</h1>
							<p class="lede">
								Diese Datei bleibt maschinenlesbares XML fuer Google und andere Crawler.
								Die Gestaltung macht sie nur im Browser besser lesbar.
							</p>
						</div>
						<div class="stats" aria-label="Sitemap Kennzahlen">
							<div class="stat">
								<strong>
									<xsl:value-of select="count(/sm:urlset/sm:url) + count(/sm:sitemapindex/sm:sitemap)" />
								</strong>
								<span>Eintraege</span>
							</div>
							<div class="stat">
								<strong>
									<xsl:choose>
										<xsl:when test="count(/sm:sitemapindex/sm:sitemap) &gt; 0">Index</xsl:when>
										<xsl:otherwise>URLs</xsl:otherwise>
									</xsl:choose>
								</strong>
								<span>Dateityp</span>
							</div>
						</div>
					</section>

					<xsl:if test="count(/sm:urlset/sm:url) &gt; 0">
						<section class="category-grid" aria-label="URL-Gruppen">
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Hochzeiten'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/hochzeiten/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Beerdigungen'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/beerdigungen/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Firmenfeiern'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/firmenfeiern/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Geburtstage'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/geburtstage/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Taufen'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/taufen/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Konzerte'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/konzerte/')])" />
							</xsl:call-template>
							<xsl:call-template name="categoryCard">
								<xsl:with-param name="label" select="'Unterricht'" />
								<xsl:with-param name="count" select="count(/sm:urlset/sm:url[contains(sm:loc, '/unterricht/')])" />
							</xsl:call-template>
						</section>
					</xsl:if>

					<xsl:choose>
						<xsl:when test="count(/sm:sitemapindex/sm:sitemap) &gt; 0">
							<section class="table-wrap" aria-label="Sitemap Index">
								<table>
									<thead>
										<tr>
											<th>Sitemap</th>
											<th>Typ</th>
											<th>Letzte Aenderung</th>
										</tr>
									</thead>
									<tbody>
										<xsl:for-each select="/sm:sitemapindex/sm:sitemap">
											<tr>
												<td>
													<a class="url" href="{sm:loc}">
														<xsl:value-of select="sm:loc" />
													</a>
												</td>
												<td><span class="badge">XML-Datei</span></td>
												<td class="small">
													<xsl:call-template name="dateValue">
														<xsl:with-param name="value" select="sm:lastmod" />
													</xsl:call-template>
												</td>
											</tr>
										</xsl:for-each>
									</tbody>
								</table>
							</section>
						</xsl:when>
						<xsl:otherwise>
							<section class="table-wrap" aria-label="Sitemap URLs">
								<table>
									<thead>
										<tr>
											<th>URL</th>
											<th>Kategorie</th>
											<th>Letzte Aenderung</th>
											<th>Prioritaet</th>
										</tr>
									</thead>
									<tbody>
										<xsl:for-each select="/sm:urlset/sm:url">
											<xsl:sort select="sm:loc" />
											<tr>
												<td>
													<a class="url" href="{sm:loc}">
														<xsl:value-of select="sm:loc" />
													</a>
												</td>
												<td>
													<span class="badge">
														<xsl:call-template name="categoryName">
															<xsl:with-param name="url" select="sm:loc" />
														</xsl:call-template>
													</span>
												</td>
												<td class="small">
													<xsl:call-template name="dateValue">
														<xsl:with-param name="value" select="sm:lastmod" />
													</xsl:call-template>
												</td>
												<td class="small">
													<xsl:choose>
														<xsl:when test="sm:priority"><xsl:value-of select="sm:priority" /></xsl:when>
														<xsl:otherwise>Standard</xsl:otherwise>
													</xsl:choose>
												</td>
											</tr>
										</xsl:for-each>
									</tbody>
								</table>
							</section>
						</xsl:otherwise>
					</xsl:choose>

					<p class="footer-note">
						Hinweis: Die visuelle Darstellung kommt aus <code>/sitemap.xsl</code>.
						Crawler erhalten weiterhin die vollstaendige XML-Sitemap.
					</p>
				</main>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="categoryCard">
		<xsl:param name="label" />
		<xsl:param name="count" />
		<div class="category-card">
			<strong><xsl:value-of select="$count" /></strong>
			<span><xsl:value-of select="$label" /></span>
		</div>
	</xsl:template>

	<xsl:template name="categoryName">
		<xsl:param name="url" />
		<xsl:choose>
			<xsl:when test="contains($url, '/hochzeiten/')">Hochzeiten</xsl:when>
			<xsl:when test="contains($url, '/beerdigungen/')">Beerdigungen</xsl:when>
			<xsl:when test="contains($url, '/firmenfeiern/')">Firmenfeiern</xsl:when>
			<xsl:when test="contains($url, '/geburtstage/')">Geburtstage</xsl:when>
			<xsl:when test="contains($url, '/taufen/')">Taufen</xsl:when>
			<xsl:when test="contains($url, '/konzerte/')">Konzerte</xsl:when>
			<xsl:when test="contains($url, '/unterricht/')">Unterricht</xsl:when>
			<xsl:otherwise>Seite</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template name="dateValue">
		<xsl:param name="value" />
		<xsl:choose>
			<xsl:when test="string-length($value) &gt; 0"><xsl:value-of select="$value" /></xsl:when>
			<xsl:otherwise>Nicht gesetzt</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
