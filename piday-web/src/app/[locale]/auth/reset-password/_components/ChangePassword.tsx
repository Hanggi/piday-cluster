"use client";

import { useResetAccountPasswordMutation } from "@/src/features/auth/api/authAPI";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";

import { useSearchParams } from "next/navigation";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";

interface ChangePasswordFormProps {
  newPassword: string;
  confirmPassword: string;
}
export default function ChangePassword() {
  const { t } = useTranslation("change-password");
  // Payment password
  const [resetAccountPassword, resetAccountPasswordResult] =
    useResetAccountPasswordMutation();
  useErrorToast(resetAccountPasswordResult.error);
  useSuccessToast(
    resetAccountPasswordResult.isSuccess,
    t("changePassword.success"),
    () => {},
  );
  const searchParams = useSearchParams();

  const code = searchParams.get("code") as string;
  const email = searchParams.get("email") as string;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormProps>();
  const onSubmit = useCallback(
    (data: ChangePasswordFormProps) => {
      resetAccountPassword({
        code: code,
        email: email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
    },
    [code, email, resetAccountPassword],
  );
  const newPassword = watch("newPassword");
  return (
    <div className="container">
      <Card className="my-8" size="md">
        <div className="my-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl className="mb-4" error={!!errors.newPassword}>
              <FormLabel>{t("changePassword.newPassword.label")}</FormLabel>
              <Input
                {...register("newPassword", {
                  required: t("changePassword.newPassword.required"),
                  minLength: {
                    value: 6,
                    message: t("changePassword.newPassword.validation"),
                  },
                })}
                placeholder={t("changePassword.newPassword.placeholder")}
                type="password"
              />
              {errors.newPassword && (
                <FormHelperText>{errors.newPassword.message}</FormHelperText>
              )}
            </FormControl>
            <FormControl className="mb-4" error={!!errors.confirmPassword}>
              <FormLabel>{t("changePassword.confirmPassword.label")}</FormLabel>
              <Input
                {...register("confirmPassword", {
                  required: t("changePassword.confirmPassword.required"),
                  minLength: {
                    value: 6,
                    message: t("changePassword.confirmPassword.validation"),
                  },
                  validate: (value) => {
                    return (
                      value === newPassword ||
                      t("common:auth.validation.passwordNotMatch")
                    );
                  },
                })}
                placeholder={t("changePassword.confirmPassword.placeholder")}
                type="password"
              />
              {errors.confirmPassword && (
                <FormHelperText>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </FormControl>

            <div className="my-4">
              <Button
                disabled={resetAccountPasswordResult.isLoading}
                fullWidth
                type="submit"
              >
                {resetAccountPasswordResult.isLoading ? (
                  <BeatLoader />
                ) : (
                  t("changePassword.submitButton")
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
