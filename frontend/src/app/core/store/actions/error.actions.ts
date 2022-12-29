import { Navigate } from '@ngxs/router-plugin';
import { ErrorPaths, TopLevelPaths } from '../../../routes';

export namespace ErrorActions {
  export class NavigateToInternalServerErrorPage extends Navigate {
    constructor() {
      super([`${TopLevelPaths}/${ErrorPaths.INTERNAL_SERVER_ERROR}`]);
    }
  }
}
