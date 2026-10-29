import config from '../../website.config.json';

// These are public settings bundled into the site, never credentials.
function formEndpoint(value: string): string | null {
  try {
    const url = new URL(value);
    return url.origin === 'https://formspree.io' && /^\/f\/[a-zA-Z0-9]+$/.test(url.pathname)
      && !url.search && !url.hash && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

function coffeeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['buymeacoffee.com', 'www.buymeacoffee.com'].includes(url.hostname)
      && /^\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export const siteConfig = {
  name: config.name,
  videoId: /^[a-zA-Z0-9_-]{11}$/.test(config.videoId) ? config.videoId : 'Xs_WnjQr05M',
  betaOpen: config.betaOpen,
  betaEndpoint: formEndpoint(config.betaFormEndpoint),
  contactEndpoint: formEndpoint(config.contactFormEndpoint),
  supportUrl: coffeeUrl(config.buyMeACoffeeUrl),
};
