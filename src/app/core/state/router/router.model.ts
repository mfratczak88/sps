export enum QueryParamKeys {
  MODE = 'mode',
  ACTION_CODE = 'oobCode',
  RETURN_URL = 'returnUrl',
}
export enum Fragment {
  EMAIL = 'email',
}
export interface BreadCrumbs {
  root: string;
  current: string;
}
