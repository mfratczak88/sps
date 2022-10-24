export enum QueryParamKeys {
  RETURN_URL = 'returnUrl',
  PREVIOUS_ACTIVATION_GUID = 'previousActivationGuid',
}
export enum ParamKeys {
  ACTIVATION_GUID = 'activationGuid',
}
export enum Fragment {
  EMAIL = 'email',
}
export interface BreadCrumbs {
  root: string;
  current: string;
}
