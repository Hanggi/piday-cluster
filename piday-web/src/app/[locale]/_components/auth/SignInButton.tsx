"use client";

import { signIn } from "next-auth/react";

import Button from "@mui/joy/Button";
import CardOverflow from "@mui/joy/CardOverflow";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SignInButton() {
  const { t } = useTranslation("common");

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        {t("common:header.login")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <CardOverflow sx={{ bgcolor: "orange", height: "60px" }}>
            bg
          </CardOverflow>
          <DialogTitle>{t("common:auth.signIn.title")}</DialogTitle>
          <ModalClose sx={{ m: 1 }} variant="plain" />
          <DialogContent>
            <form>
              <FormControl>
                <Input />
              </FormControl>
              <FormControl>
                <Input />
              </FormControl>
              <Button
                onClick={() => {
                  signIn("keycloak");
                }}
              >
                {t("common:header.login")}
              </Button>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
}
