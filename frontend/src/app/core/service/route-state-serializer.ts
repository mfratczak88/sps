import { RouterStateSerializer } from '@ngxs/router-plugin';
import { RouterStateSnapshot } from '@angular/router';
import { RouterStateParams } from '../store/routing/routing.state.model';

export class RouteStateSerializer
  implements RouterStateSerializer<RouterStateParams> {
  serialize(routerState: RouterStateSnapshot): RouterStateParams {
    const {
      url,
      root: { queryParams },
    } = routerState;

    let { root: route } = routerState;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const { params, data, fragment } = route;

    return { url, params, queryParams, fragment, ...data };
  }
}
