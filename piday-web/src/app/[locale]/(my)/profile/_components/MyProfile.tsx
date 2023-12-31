"use client";

import { useSession } from "next-auth/react";

import Typography from "@mui/joy/Typography";

import { useTranslation } from "react-i18next";

export default function MyProfile() {
  const { t } = useTranslation("profile");

  const { data: session } = useSession();

  console.log(session);
  return (
    <div>
      <div className="mb-4">
        <Typography level="title-lg">
          {t("profile:profile.myProfile")}
        </Typography>
      </div>
      <div className="mb-4">
        <Typography level="title-md">ID</Typography>
        <Typography>{session?.user?.id}</Typography>
      </div>
      <div className="mb-4">
        <Typography level="title-md">{t("profile:profile.email")}</Typography>
        <Typography>{session?.user?.email}</Typography>
      </div>
      <div className="mb-4">
        <Typography level="title-md">
          {t("profile:profile.username")}
        </Typography>
        <Typography>{session?.user?.name}</Typography>
      </div>
    </div>
  );
}
