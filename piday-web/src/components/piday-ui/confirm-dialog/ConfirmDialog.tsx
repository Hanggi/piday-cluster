import Button from "@mui/joy/Button";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  title: string;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

export default function ConfirmDialog({
  open,
  children,
  title,
  onCancel,
  onConfirm,
}: Props) {
  const { t } = useTranslation(["common"]);

  const [confirmClicked, setConfirmClicked] = useState(false);

  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog>
        <DialogTitle>{title || "Confirm?"}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button color="neutral" variant="plain" onClick={onCancel}>
            {t("common:button.cancel")}
          </Button>
          <Button
            disabled={confirmClicked}
            onClick={() => {
              // setConfirmClicked(true);
              onConfirm && onConfirm();
            }}
          >
            {t("common:button.confirm")}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
