interface Config {
  css_variable?: {
    [key: string]: any;
  };
  params?: {
    [key: string]: any;
  };
  options?: {
    [key: string]: any;
  };
}
export interface CheckoutProps extends Config {
  onReady?: (model?: any) => void;
  onError?: (model?: any) => void;
  onSuccess?: (model?: any) => void;
  onCallback?: (model?: any) => void;
}
