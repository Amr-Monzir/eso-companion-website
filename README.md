# ESO Companion on GitHub Pages

This is a static React website. GitHub Pages serves its HTML, CSS, JavaScript and images.
There is no Replit API, PostgreSQL database, App Storage connection or private app repository access at runtime.

## Use the standalone source

The standalone source archive contains only the website, public assets, build settings and GitHub Actions workflow.
It excludes the Replit backend, database packages, research files, secrets and Git history.

1. Create a separate public website repository on GitHub. Keep the companion app repository private.
2. Extract the source archive and upload **all files**, including `.github/workflows/pages.yml`, to the new repository's root.
   Do not put them inside an extra enclosing folder.
3. In repository **Settings > Pages**, choose **GitHub Actions** as the build source.
4. Set **Custom domain** to `eso-companion.com` in Pages settings before pointing DNS at GitHub.
5. Push to `main` or `master`, or run **Publish website to GitHub Pages** from the Actions tab.
6. Once the DNS check passes and GitHub provisions a certificate, enable **Enforce HTTPS**.

The workflow publishes only `dist/public`. It does not deploy a server.
It builds clean directory routes for `/beta/`, `/contact/`, `/support/` and the legacy `/installation/` redirect.
Direct links and refreshes work without server rewrites. A custom `404.html` handles unknown URLs.

## Domain DNS

At your domain registrar, set these apex `A` records for `@`:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Optional `www`: add a `CNAME` for `www` pointing to your account's `<username>.github.io` hostname,
not the repository path and not the Replit preview URL.
Keep unrelated email/MX records. Remove conflicting web-hosting A, AAAA or CNAME records only after checking what they serve.
Verify domain ownership in GitHub before publishing if possible; avoid wildcard DNS records.

Official instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

The build writes a `CNAME` file using the configured domain.
When using a custom GitHub Actions publishing workflow, the domain must also be configured in repository Pages settings.
The file alone does not configure GitHub or your registrar.

## Connect the forms

The owner supplied `https://formspree.io/f/xeaazjyg`. It is configured for both beta signup and contact.
Submissions have separate subjects and `form_type` markers (`private_beta` or `contact`) so beta records can be identified for release cleanup.
The Buy Me a Coffee link is configured as `https://buymeacoffee.com/amrmonzir`.
If either form endpoint is cleared, that form clearly shows it is not connected and its submit button stays disabled.
They do not silently save data locally or send it to the old API.

1. Use the supplied Formspree form, or create separate private beta and contact forms if needed later.
2. Confirm the destination inbox and any provider verification steps.
3. Put each public endpoint in `website.config.json`:

```json
{
  "name": "ESO Companion",
  "videoId": "Xs_WnjQr05M",
  "betaOpen": true,
  "betaFormEndpoint": "https://formspree.io/f/xeaazjyg",
  "contactFormEndpoint": "https://formspree.io/f/xeaazjyg",
  "buyMeACoffeeUrl": "https://buymeacoffee.com/amrmonzir",
  "customDomain": "eso-companion.com"
}
```

Replace the examples with the actual public form URLs from Formspree. Never put API keys or inbox passwords in this file.
Public form IDs are intended for browser use. Configure provider spam protection and allowed domains as available.
Check the provider's current plan limits and submission-retention settings before opening signup.

The beta form asks for email only and requires consent before submitting.
Formspree processes submissions and sends them to the configured inbox; it may retain copies and technical metadata under its own privacy policy.
The contact form sends name, reply email, category and message.
Success means the provider accepted the submission, not that inbox delivery or a reply is guaranteed.
There is no local signup database and no automatic deduplication guarantee.

The website never collects payment details. Add the actual Buy Me a Coffee profile URL when ready.

## Beta email deletion at public release

Closing a static page cannot delete records in a third-party service or mailbox.
The former server-side database purge is **not part of this static architecture**.

At release:

1. Set `betaOpen` to `false`, remove `betaFormEndpoint`, rebuild and publish.
2. Disable the beta form in Formspree too. Old browser tabs may still know its endpoint. The supplied endpoint is shared:
   disabling it will also close contact delivery. Move contact to a separate endpoint first if it should remain open.
3. Delete all `form_type: private_beta` submissions in Formspree and any exports, without deleting unrelated contact messages.
4. Delete beta signup emails from the destination inbox, sent mail, archives and trash.
5. Follow the provider's retention/deletion process for any remaining records or backups.

Use beta addresses only for private beta contact, never newsletters or unrelated marketing.
The developer must carry out this release checklist to meet the policy displayed on the site.

The existing Replit database, if it has old signups or contact messages, has not been deleted or migrated by this conversion.
Do not turn off old production storage without checking for records you need to handle. Old beta addresses remain subject to the same use/deletion policy.

## Local development

With Node 24 and pnpm 10.26.1:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm typecheck
pnpm build
pnpm preview
```

The portable build does not need `PORT`, `BASE_PATH`, `DATABASE_URL` or Replit credentials.
Default output: `dist/public`.
For a GitHub project URL without a custom domain, clear `customDomain` and build with the repository prefix:

```sh
pnpm build:pages --base /YOUR_REPOSITORY_NAME/
```

The provided GitHub Actions workflow obtains the correct base path from GitHub Pages automatically.

## Export from the original workspace

```sh
node scripts/export-github-pages.mjs
pnpm --dir generated-artifacts/github-pages-source install --ignore-workspace --lockfile-only
```

The export destination is `generated-artifacts/github-pages-source`.
Create a fresh archive from that directory, including hidden files.
Only publish the exported website, not the original workspace or its Git history.
