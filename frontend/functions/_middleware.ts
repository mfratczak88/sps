import { PagesFunction } from '@cloudflare/workers-types';
import proxyflare from '@flaregun-net/proxyflare-for-pages';

const toUrl = 'api.sps.mfr88-apps.com';

const routes = [
  {
    from: { pattern: 'sps.mfr88-apps.com/api/*' },
    to: { url: toUrl },
  },
  {
    from: { pattern: 'chore-cf-setup.sps-c7k.pages.dev/api/*' },
    to: { url: toUrl },
  },
];

export const onRequest: PagesFunction[] = [
  (context) =>
    proxyflare({
      config: {
        global: { debug: true },
        routes,
      },
    })(context),
];
