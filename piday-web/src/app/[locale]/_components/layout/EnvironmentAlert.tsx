"use client";

import Alert from "@mui/joy/Alert";

import { useTranslation } from "react-i18next";

interface Props {
  env: string;
}
export default function EnvironmentAlert({ env }: Props) {
  const { t } = useTranslation("common");

  switch (env) {
    case "local":
      return (
        <div className="container mt-4">
          <Alert color="success">{t("common:env.local")}</Alert>
        </div>
      );
    case "dev":
      return (
        <div className="container mt-4">
          <Alert color="danger">{t("common:env.dev")}</Alert>
        </div>
      );
    case "staging":
      return (
        <div className="container mt-4">
          <Alert color="warning">{t("common:env.staging")}</Alert>
        </div>
      );
  }

  return <div></div>;
}
