import React, { useState, useEffect, createRef } from "react";
import { CheckoutProps } from "./types";

// @ts-ignore
import { checkout } from "../../checkout/dist/checkout.mjs";

export const Checkout: React.FC<CheckoutProps> = function (props) {
  const [state, setCheckout] = useState<any>(null);
  const checkoutContainer = createRef<HTMLDivElement>();
  useEffect(() => {
    const app = checkout(checkoutContainer.current, {
      options: props.options,
      params: props.params,
      css_variable: props.css_variable,
    });
    setCheckout(app);
    if (props.onReady) {
      app.$on("ready", props.onReady);
    }
    if (props.onSuccess) {
      app.$on("success", props.onSuccess);
    }
    if (props.onError) {
      app.$on("error", props.onError);
    }
    if (props.onCallback) {
      app.$on("callback", props.onCallback);
    }
    return () => {
      if (app) {
        app.$destroy();
        if (app.$el) app.$el.remove();
      }
    };
  }, [props.options, props.css_variable]);
  useEffect(() => {
    if (state) {
      state.setParams(props.params ?? {});
    }
  }, [state, props.params]);
  return <div ref={checkoutContainer}></div>;
}
