"use client";

import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import SignInDialog from "./auth-dialogs/SignInDialog";
import SignUpDialog from "./auth-dialogs/SignUpDialog";

export enum AuthDialogType {
  EMAIL_SIGN_IN = "EMAIL_SIGN_IN",
  EMAIL_SIGN_UP = "EMAIL_SIGN_UP",
}

export default function SignInButton() {
  const { t } = useTranslation("common");

  const [openSignIn, setOpenSignIn] = useState(false);
  const [dialogType, setDialogType] = useState<AuthDialogType>(
    AuthDialogType.EMAIL_SIGN_IN,
  );

  const handleAuthDialogTypeChange = useCallback(
    (authDialogType: AuthDialogType) => {
      setDialogType(authDialogType);
    },
    [],
  );

  return (
    <div>
      <Button
        color="neutral"
        onClick={() => {
          setOpenSignIn(true);
          setDialogType(AuthDialogType.EMAIL_SIGN_IN);
        }}
      >
        {t("common:header.login")}
      </Button>
      <Modal
        open={openSignIn}
        onClose={(
          _event: React.MouseEvent<HTMLButtonElement>,
          reason: string,
        ) => {
          if (reason !== "backdropClick") {
            setOpenSignIn(false);
          }
        }}
      >
        <div>
          {dialogType === AuthDialogType.EMAIL_SIGN_IN && (
            <SignInDialog
              onAuthDialogTypeChange={handleAuthDialogTypeChange}
              onClose={() => {
                setOpenSignIn(false);
              }}
            />
          )}
          {dialogType === AuthDialogType.EMAIL_SIGN_UP && (
            <SignUpDialog
              onAuthDialogTypeChange={handleAuthDialogTypeChange}
              onClose={() => {
                setOpenSignIn(false);
              }}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
