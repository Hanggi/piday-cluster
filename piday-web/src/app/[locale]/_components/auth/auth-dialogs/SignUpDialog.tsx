"use client";

import {
  useEmailSignUpMutation,
  useSendEmailVerificationMutation,
} from "@/src/features/auth/api/authAPI";
import {
  useErrorToast,
  useSuccessToast,
} from "@/src/features/rtk-utils/use-error-toast.hook";
import { clsx } from "clsx";
import validator from "validator";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";

import { AuthDialogType } from "../SignInButton";

interface SignUpFormProps {
  email: string;
  username: string;
  verificationCode: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onAuthDialogTypeChange: (type: AuthDialogType) => void;
  onClose?: () => void;
}

export default function SignUpDialog({
  onAuthDialogTypeChange,
  onClose,
}: Props) {
  const { t, i18n } = useTranslation("common");

  const [emailSignUp, emailSignUpResult] = useEmailSignUpMutation();
  useErrorToast(emailSignUpResult.error);
  useSuccessToast(
    emailSignUpResult.isSuccess,
    t("common:auth.signUp.success"),
    () => {
      onAuthDialogTypeChange(AuthDialogType.EMAIL_SIGN_IN);
    },
  );

  const [sendEmailVerification, sendEmailVerificationResult] =
    useSendEmailVerificationMutation();
  useErrorToast(sendEmailVerificationResult.error);
  useSuccessToast(
    sendEmailVerificationResult.isSuccess,
    t("common:auth.toast.emailVerificationSent"),
    () => {
      setDisabledSendButton(true);
    },
  );
  // test5@dvqdev.com

  const [isLoding, setIsLoding] = useState(false); // 登录状态标志

  // Timer for 60 seconds verification code
  const [seconds, setSeconds] = useState(0);
  const [disabledSendButton, setDisabledSendButton] = useState(false);
  useEffect(() => {
    let interval: any = null;

    if (disabledSendButton && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds === 0) {
      setDisabledSendButton(false);
      setSeconds(60);
    }

    return () => clearInterval(interval);
  }, [disabledSendButton, seconds]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormProps>();

  const email = watch("email");
  const password = watch("password");

  const onSubmit = useCallback(
    (data: SignUpFormProps) => {
      emailSignUp({
        password: data.password,
        email: data.email,
        code: data.verificationCode,
      });
    },
    [emailSignUp],
  );

  const handleSendVerificationCode = useCallback(() => {
    if (!email) {
      toast.warn(t("common:auth.validation.email"));
      return;
    }
    if (!validator.isEmail(email)) {
      toast.warn(t("common:auth.errors.invalidEmail"));
      return;
    }

    sendEmailVerification({
      email,
      locale: i18n.language,
    });
  }, [email, i18n.language, sendEmailVerification, t]);

  return (
    <ModalDialog>
      <DialogTitle>
        <div
          className="cursor-pointer mr-2"
          onClick={() => {
            onAuthDialogTypeChange(AuthDialogType.EMAIL_SIGN_IN);
          }}
        >
          <i className="ri-arrow-left-line"></i>
        </div>
        {t("common:auth.signUp.title")}
      </DialogTitle>

      <ModalClose sx={{ m: 1 }} variant="plain" />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl className="mb-4" error={!!errors.email}>
            <FormLabel>{t("common:auth.email")}</FormLabel>
            <Input
              {...register("email", {
                required: t("common:auth.validation.required"),
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: t("common:auth.validation.email"),
                },
              })}
              placeholder={t("common:auth.emailPlaceholder")}
            />
            {errors.email && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl className="mb-4">
            <FormLabel>{t("common:auth.verificationCode")}</FormLabel>
            <div className="flex gap-4">
              <Input
                {...register("verificationCode", {
                  required: t("common:auth.validation.required"),
                })}
                placeholder={t("common:auth.verificationCodePlaceholder")}
              />
              <Button
                className="w-[100px]"
                disabled={
                  disabledSendButton || sendEmailVerificationResult.isLoading
                }
                onClick={() => {
                  handleSendVerificationCode();
                }}
              >
                {t("common:button.send")}{" "}
                <span>{disabledSendButton ? `(${seconds}s)` : ""}</span>
              </Button>
            </div>
          </FormControl>
          <FormControl className="mb-4" error={!!errors.password}>
            <FormLabel>{t("common:auth.password")}</FormLabel>
            <Input
              {...register("password", {
                required: t("common:auth.validation.required"),
                minLength: {
                  value: 6,
                  message: t("common:auth.validation.passwordLength"),
                },
              })}
              placeholder={t("common:auth.passwordPlaceholder")}
              type="password"
            />
            {errors.password && (
              <FormHelperText>{errors.password.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl className="mb-4" error={!!errors.confirmPassword}>
            <FormLabel>{t("common:auth.confirmPassword")}</FormLabel>
            <Input
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
              placeholder={t("common:auth.confirmPasswordPlaceholder")}
              type="password"
            />
            {errors.confirmPassword && (
              <FormHelperText>{errors.confirmPassword.message}</FormHelperText>
            )}
          </FormControl>

          <div className="mb-8 text-right flex justify-end items-center">
            <Typography level="body-sm">
              {t("common:auth.signIn.signUpHint")}
            </Typography>
            <Typography
              className={clsx(
                "!text-blue-500",
                "hover:!text-blue-300",
                "cursor-pointer",
                "!ml-2",
              )}
              level="body-sm"
              onClick={() => {
                onAuthDialogTypeChange(AuthDialogType.EMAIL_SIGN_IN);
              }}
            >
              {t("common:auth.signIn.title")}
            </Typography>
          </div>

          <Button
            disabled={emailSignUpResult.isLoading}
            fullWidth
            type="submit"
          >
            {emailSignUpResult.isLoading ? (
              <BeatLoader />
            ) : (
              t("common:auth.signUp.title")
            )}
          </Button>
        </form>
      </DialogContent>
    </ModalDialog>
  );
}
