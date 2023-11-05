"use client";

import { StatusCodes } from "http-status-codes";
import { signIn } from "next-auth/react";

import Button from "@mui/joy/Button";
import CardOverflow from "@mui/joy/CardOverflow";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";

interface SignInFormProps {
  username: string;
  password: string;
}

export default function SignInButton() {
  const { t } = useTranslation("common");

  const [open, setOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // 登录状态标志

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormProps>();

  const onSubmit = useCallback(
    (data: any) => {
      setIsLoggingIn(true);
      signIn("credentials", {
        redirect: false, // 不重定向，我们在这里处理结果
        username: data.username,
        password: data.password,
      })
        .then((res) => {
          if (res?.status == StatusCodes.UNAUTHORIZED) {
            toast.error(t("common:auth.validation.emailOrPasswordIncorrect"));
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(error);
        })
        .finally(() => {
          setIsLoggingIn(false);
        });
    },
    [t],
  );

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl className="mb-4" error={!!errors.username}>
                <FormLabel>{t("common:auth.email")}</FormLabel>
                <Input
                  {...register("username", {
                    required: "required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: t("common:auth.validation.email"),
                    },
                  })}
                  placeholder={t("common:auth.emailPlaceholder")}
                />
                {errors.username && (
                  <FormHelperText>{errors.username.message}</FormHelperText>
                )}
              </FormControl>
              <FormControl className="mb-4" error={!!errors.password}>
                <FormLabel>{t("common:auth.password")}</FormLabel>
                <Input
                  {...register("password", {
                    required: "required",
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
              <Button
                className="mt-8"
                disabled={isLoggingIn}
                fullWidth
                type="submit"
              >
                {isLoggingIn ? <BeatLoader /> : t("common:header.login")}
              </Button>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </div>
  );
}
