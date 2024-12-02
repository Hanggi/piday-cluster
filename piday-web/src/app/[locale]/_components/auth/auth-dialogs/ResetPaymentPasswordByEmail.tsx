import {
  useGetMyUserQuery,
  useSendPaymentPasswordResetEmailMutation,
} from "@/src/features/auth/api/authAPI";

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

export default function ResetPaymentPasswordByEmailDialog({
  open,
  onClose,
}: Props) {
  const { t } = useTranslation("common");

  const { data: myUser } = useGetMyUserQuery();
  const [email, setEmail] = useState("");

  const [sendResetPaymentPasswordEmail, sendResetPaymentPasswordEmailResult] =
    useSendPaymentPasswordResetEmailMutation();

  const handleSubmit = useCallback(() => {
    if (!email) {
      toast.warn("邮箱不能为空");
      return;
    }
    sendResetPaymentPasswordEmail({ email });
    onClose && onClose();
  }, [email, sendResetPaymentPasswordEmail]);

  useEffect(() => {
    if (myUser?.email) {
      setEmail(myUser.email);
    }
  }, [myUser]);

  useEffect(() => {
    if (sendResetPaymentPasswordEmailResult.isSuccess) {
      toast.success(t("common:auth.signIn.resetPaymentPasswordEmailSent"));
      onClose && onClose();
      sendResetPaymentPasswordEmailResult.reset();
    }
  }, [onClose, sendResetPaymentPasswordEmailResult, t]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>
          {t("common:auth.signIn.resetPaymentPassword")}
        </DialogTitle>
        <ModalClose sx={{ m: 1 }} variant="plain" />
        <DialogContent>
          <div className="my-4">
            <FormControl>
              <FormLabel>{t("common:auth.email")}</FormLabel>
              <Input
                disabled
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
              disabled={sendResetPaymentPasswordEmailResult.isLoading}
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
