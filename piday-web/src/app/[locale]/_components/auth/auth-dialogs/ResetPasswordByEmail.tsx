import { useSendPasswordResetEmailMutation } from "@/src/features/auth/api/authAPI";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose?: () => void;
}

export default function ResetPasswordByEmailDialog({ open, onClose }: Props) {
  const { t } = useTranslation("common");

  const [email, setEmail] = useState("");

  const [sendResetPasswordEmail, sendResetPasswordEmailResult] =
    useSendPasswordResetEmailMutation();

  const handleSubmit = useCallback(() => {
    sendResetPasswordEmail({ email });
  }, [email, sendResetPasswordEmail]);

  useEffect(() => {
    if (sendResetPasswordEmailResult.isSuccess) {
      toast.success(t("common:auth.signIn.resetPasswordEmailSent"));
      onClose && onClose();
      sendResetPasswordEmailResult.reset();
    }
  }, [onClose, sendResetPasswordEmailResult, t]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>{t("common:auth.signIn.resetPassword")}</DialogTitle>
        <ModalClose sx={{ m: 1 }} variant="plain" />
        <DialogContent>
          <div className="my-4">
            <FormControl>
              <FormLabel>{t("common:auth.email")}</FormLabel>
              <Input
                placeholder="Email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className="mt-4">
            <Button
              disabled={sendResetPasswordEmailResult.isLoading}
              onClick={handleSubmit}
            >
              {t("common:button.send")}
            </Button>
          </div>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
