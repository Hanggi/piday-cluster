"use client";

import { store } from "@/src/store";

import React, { useEffect } from "react";
import { Provider } from "react-redux";

import { getKeycloakInstance } from "../keycloak/keycloakInstance";

export default function ReduxProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    getKeycloakInstance();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
