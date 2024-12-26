import {
  useSendMigrateToEmailAccountEmailMutation,
  useSendPasswordResetEmailMutation,
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
  userID?: string;
  onClose?: () => void;
}

export default function MigrateToEmailAccountDialog({
  userID,
  open,
  onClose,
}: Props) {
  const { t } = useTranslation(["common", "profile"]);

  const [email, setEmail] = useState("");

  const [sendMigrateToEmailAccountEmail, sendMigrateToEmailAccountEmailResult] =
    useSendMigrateToEmailAccountEmailMutation();

  const handleSubmit = useCallback(() => {
    if (userID) {
      sendMigrateToEmailAccountEmail({ userID: userID, email: email });
    } else {
      toast.error(t("common:auth.signIn.invalidUserID"));
    }
  }, [email, sendMigrateToEmailAccountEmail]);

  useEffect(() => {
    if (sendMigrateToEmailAccountEmailResult.isSuccess) {
      toast.success(t("profile:toast.migrateToEmailAccountEmailSent"));
      onClose && onClose();
      sendMigrateToEmailAccountEmailResult.reset();
    }
  }, [onClose, sendMigrateToEmailAccountEmailResult, t]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <DialogTitle>{t("profile:button.migrateToEmailAccount")}</DialogTitle>
        <ModalClose sx={{ m: 1 }} variant="plain" />
        <DialogContent>
          <div>
            <p>{t("profile:profile.migrateToEmailAccountAlert")}</p>
          </div>
          <div className="my-4">
            <FormControl>
              <FormLabel>{t("common:auth.email")}</FormLabel>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </FormControl>
          </div>
          <div className="mt-4">
            <Button
              disabled={sendMigrateToEmailAccountEmailResult.isLoading}
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
