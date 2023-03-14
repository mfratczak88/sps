import { Route } from '@flaregun-net/proxyflare-for-pages/build/types';
import proxyflare from '@flaregun-net/proxyflare-for-pages';
import { PagesFunction } from '@cloudflare/workers-types';
const apiRoute: Route = {
  from: { pattern: 'sps.mfr88-apps.com/api/*' },
  to: { url: 'api.sps.mfr88-apps.com' },
};

const routes = [apiRoute];

export const onRequest: PagesFunction[] = [
  (context) =>
    proxyflare({
      config: {
        global: { debug: true },
        routes,
      },
    })(context),
];
