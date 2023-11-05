"use client";

import { store } from "@/src/store";

import React from "react";
import { Provider } from "react-redux";

export default function ReduxProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
