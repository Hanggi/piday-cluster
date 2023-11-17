"use client";

import { Typography } from "@mui/joy";

import { useTranslation } from "react-i18next";

export const Table = () => {
  const { t } = useTranslation("profile");
  return (
    <div>
      <Typography level="h4">
        {t("profile:leaderboard.overviewStatistics")}
      </Typography>
    </div>
  );
};
