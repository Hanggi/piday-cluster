import { useSetPaymentPasswordMutation } from "@/src/features/auth/api/authAPI";
import { set } from "lodash";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface PaymentPasswordForm {
  password: string;
  confirmPassword: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
export default function SetPaymentPasswordModel({
  open,
  onClose,
  onSuccess,
}: Props) {
  const { t, i18n } = useTranslation("common");

  const [setPaymentPassword, setPaymentPasswordResult] =
    useSetPaymentPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentPasswordForm>();
  const password = watch("password");

  const onSubmit = useCallback(
    (data: PaymentPasswordForm) => {
      setPaymentPassword(data);
    },
    [setPaymentPassword],
  );

  useEffect(() => {
    if (setPaymentPasswordResult.isSuccess) {
      toast.success("设置支付密码成功");
      setPaymentPasswordResult.reset();
      onClose();
      onSuccess?.();
    }
  }, [
    onClose,
    onSuccess,
    setPaymentPasswordResult,
    setPaymentPasswordResult.isSuccess,
  ]);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog>
        <ModalClose />

        <DialogTitle>设置支付密码</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <FormControl className="mb-4" error={!!errors.password}>
              <FormLabel>支付密码</FormLabel>
              <Input
                type="password"
                {...register("password", {
                  required: t("common:auth.validation.required"),
                  minLength: {
                    value: 6,
                    message: t("common:auth.validation.passwordLength"),
                  },
                })}
                placeholder={t("common:auth.passwordPlaceholder")}
              />

              {errors.password && (
                <FormHelperText>{errors.password.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl className="mb-4" error={!!errors.confirmPassword}>
              <FormLabel>确认支付密码</FormLabel>
              <Input
                placeholder={t("common:auth.confirmPasswordPlaceholder")}
                type="password"
                {...register("confirmPassword", {
                  required: t("common:auth.validation.required"),
                  minLength: {
                    value: 6,
                    message: t("common:auth.validation.passwordLength"),
                  },
                  validate: (value) => {
                    return (
                      value === password ||
                      t("common:auth.validation.passwordNotMatch")
                    );
                  },
                })}
              />
              {errors.confirmPassword && (
                <FormHelperText>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>

            <div className="mt-4">
              <Button
                disabled={setPaymentPasswordResult.isLoading}
                fullWidth
                loading={setPaymentPasswordResult.isLoading}
                type="submit"
              >
                {t("profile:button.save")}
              </Button>
            </div>
          </DialogContent>
        </form>
      </ModalDialog>
    </Modal>
  );
}
