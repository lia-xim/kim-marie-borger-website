# Security Policy

## Supported Use

This repository powers a single public website. Security updates are expected
on the `main` branch.

## Reporting a Vulnerability

Please report suspected vulnerabilities privately by email to
kim-marie.borger@t-online.de. Include the affected route or file, reproduction
steps, and any relevant logs or proof of concept.

Please do not open public issues for active vulnerabilities.

## Dependency Audits

Run the production dependency audit before publishing changes:

```sh
npm run audit:prod
```

The full development-tooling audit may include advisories inside local CMS or
language-server packages that are not shipped to production. Production
dependencies should remain clean.
