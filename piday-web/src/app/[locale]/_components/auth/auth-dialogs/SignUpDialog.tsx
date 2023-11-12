"use client";

import { clsx } from "clsx";

import Button from "@mui/joy/Button";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";

import { AuthDialogType } from "../SignInButton";

interface SignUpFormProps {
  email: string;
  username: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  onAuthDialogTypeChange: (type: AuthDialogType) => void;
}

export default function SignUpDialog({
  onAuthDialogTypeChange: onAuthTypeChange,
}: Props) {
  const { t } = useTranslation("common");

  const [isLoding, setIsLoding] = useState(false); // 登录状态标志

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormProps>();

  const password = watch("password");

  const onSubmit = useCallback((data: SignUpFormProps) => {
    // setIsLoding(true);
    console.log(data);

    (async () => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          // username: data.username,
          password: data.password,
          email: data.email,
        }),
      });
      console.log(res);
      console.log(await res.json());
    })();
  }, []);

  return (
    <ModalDialog>
      <DialogTitle>
        <div
          className="cursor-pointer mr-2"
          onClick={() => {
            onAuthTypeChange(AuthDialogType.EMAIL_SIGN_IN);
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
                onAuthTypeChange(AuthDialogType.EMAIL_SIGN_IN);
              }}
            >
              {t("common:auth.signIn.title")}
            </Typography>
          </div>

          <Button disabled={isLoding} fullWidth type="submit">
            {isLoding ? <BeatLoader /> : t("common:auth.signUp.title")}
          </Button>
        </form>
      </DialogContent>
    </ModalDialog>
  );
}
