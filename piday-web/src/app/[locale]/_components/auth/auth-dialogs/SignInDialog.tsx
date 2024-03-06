"use client";

import { usePiSignInMutation } from "@/src/features/auth/api/authAPI";
import { AuthResult } from "@/src/types/pi/AuthResult";
import { clsx } from "clsx";
import { StatusCodes } from "http-status-codes";
import { signIn } from "next-auth/react";

import { CircularProgress } from "@mui/joy";
import Button from "@mui/joy/Button";
import CardOverflow from "@mui/joy/CardOverflow";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import BeatLoader from "react-spinners/BeatLoader";
import { toast } from "react-toastify";

import { AuthDialogType } from "../SignInButton";

interface SignInFormProps {
  username: string;
  password: string;
}

interface Props {
  onAuthDialogTypeChange: (type: AuthDialogType) => void;
  onClose?: () => void;
}

export default function SignInDialog({
  onAuthDialogTypeChange: onAuthTypeChange,
  onClose,
}: Props) {
  const { t } = useTranslation("common");

  const [isLoading, setIsLoading] = useState(false); // 登录状态标志
  const [piSignIn, piSignInResult] = usePiSignInMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormProps>();

  const onSubmit = useCallback(
    (data: any) => {
      setIsLoading(true);
      signIn("credentials", {
        redirect: false, // 不重定向，我们在这里处理结果
        username: data.username,
        password: data.password,
      })
        .then((res) => {
          if (res?.status == StatusCodes.UNAUTHORIZED) {
            toast.error(t("common:auth.validation.emailOrPasswordIncorrect"));
            return;
          }
          toast.success(t("common:auth.signIn.success"));
          onClose && onClose();
        })
        .catch((error) => {
          console.error(error);
          toast.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [onClose, t],
  );

  const handlePiSignIn = useCallback(async () => {
    alert("hi");
    if (!window.Pi) {
      toast.error("Pi Environment not found");
      return;
    }

    setIsLoading(true);
    try {
      const scopes = ["username", "payments", "wallet_address"];
      const authResponse = await window.Pi.authenticate(
        scopes,
        (payment: any) => {
          console.log("onIncompletePaymentFound", payment);
          // return axiosClient.post("/incomplete", { payment }, config);
        },
      );
      alert(authResponse);

      if (authResponse) {
        // piSignIn({
        //   accessToken: authResponse.accessToken,
        // });

        signIn("credentials", {
          accessToken: authResponse.accessToken,
          inviteCode: "",
          redirect: false,
        })
          .then((res) => {
            if (res?.status == StatusCodes.UNAUTHORIZED) {
              toast.error(t("common:auth.validation.emailOrPasswordIncorrect"));
              return;
            }
            toast.success(t("common:auth.signIn.success"));
            onClose && onClose();
          })
          .catch((error) => {
            console.error(error);
            toast.error(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }

      setIsLoading(false);
    } catch (err) {
      alert(err);
      setIsLoading(false);
    }
  }, [onClose, t]);

  return (
    <ModalDialog>
      <CardOverflow sx={{ bgcolor: "orange", height: "60px" }}></CardOverflow>
      <DialogTitle>{t("common:auth.signIn.title")}</DialogTitle>
      <ModalClose sx={{ m: 1 }} variant="plain" />
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl className="mb-4" error={!!errors.username}>
            <FormLabel>{t("common:auth.email")}</FormLabel>
            <Input
              {...register("username", {
                required: t("common:auth.validation.required"),
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
                onAuthTypeChange(AuthDialogType.EMAIL_SIGN_UP);
              }}
            >
              {t("common:auth.signUp.title")}
            </Typography>
          </div>
          <Button disabled={isLoading} fullWidth type="submit">
            {isLoading ? <BeatLoader /> : t("common:auth.signIn.title")}
          </Button>

          <div className="mt-4 w-full flex">
            <Button
              color="neutral"
              disabled={isLoading}
              fullWidth
              startDecorator={isLoading && <CircularProgress />}
              variant="outlined"
              onClick={handlePiSignIn}
            >
              {t("common:auth.signIn.piSignIn")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </ModalDialog>
  );
}
