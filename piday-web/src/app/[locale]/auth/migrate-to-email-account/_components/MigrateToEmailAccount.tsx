"use client";

import { useMigrateToEmailAccountMutation } from "@/src/features/auth/api/authAPI";
import { keycloakSessionLogOut } from "@/src/features/auth/keycloak/keycloakSessionLogout";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { signOut } from "next-auth/react";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useSearchParams } from "next/navigation";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";

export default function MigrateToEmailAccount() {
  const { t } = useTranslation(["profile", "common"]);

  const [migrationFinished, setMigrationFinished] = useState(false);

  const [migrateToEmailAccount, migrateToEmailAccountResult] =
    useMigrateToEmailAccountMutation();
  useErrorToast(migrateToEmailAccountResult.error);
  useSuccessToast(
    migrateToEmailAccountResult.isSuccess,
    t("profile:toast.migrateToEmailAccountSuccess"),
    () => {
      setMigrationFinished(true);

      keycloakSessionLogOut().then(() => {
        signOut({ callbackUrl: "/" });
      });
    },
  );
  const searchParams = useSearchParams();

  const code = searchParams.get("code") as string;
  const email = searchParams.get("email") as string;
  const userID = searchParams.get("userID") as string;

  return (
    <div className="container">
      <Card className="my-8" size="md">
        <div className="my-4">
          <div>
            <Typography>
              {t("profile:profile.migrateToEmailAccountAlert")}
            </Typography>
          </div>
          <div className="my-4">
            <Button
              disabled={
                migrateToEmailAccountResult.isLoading || migrationFinished
              }
              fullWidth
              type="submit"
              onClick={() => {
                migrateToEmailAccount({ userID, code, email });
              }}
            >
              {migrateToEmailAccountResult.isLoading ? (
                <BeatLoader />
              ) : (
                t("common:button.confirm")
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
