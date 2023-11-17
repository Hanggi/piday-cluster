"use client";

import { Button, FormControl, FormLabel, Input } from "@mui/joy";

import { useTranslation } from "react-i18next";

export const Form = () => {
  const { t } = useTranslation("settings");
  return (
    <div className="md:px-7 px-4 pb-7 max-w-4xl grid grid-cols-1 md:grid-cols-2 md:gap-x-14 mx-auto gap-y-10">
      {inputFields.map((field) => (
        <FormControl key={field.labelTranslationKey}>
          <FormLabel>{t(field.labelTranslationKey)}</FormLabel>
          <Input placeholder={t(field.placeholderTranslationKey)} />
        </FormControl>
      ))}

      <Button className="col-span-full max-w-[260px] center">
        {t("saveAndModify")}
      </Button>
    </div>
  );
};

const inputFields = [
  {
    labelTranslationKey: "nickname",
    placeholderTranslationKey: "liubei",
  },
  {
    labelTranslationKey: "pidayID",
    placeholderTranslationKey: "pid",
  },
  {
    labelTranslationKey: "setPassword",
    placeholderTranslationKey: "enter",
  },
  {
    labelTranslationKey: "confirmPassword",
    placeholderTranslationKey: "enter",
  },
  {
    labelTranslationKey: "bindEmail",
    placeholderTranslationKey: "enter",
  },
  {
    labelTranslationKey: "enter",
    placeholderTranslationKey: "bindPIDWalletAddress",
  },
  {
    labelTranslationKey: "enter",
    placeholderTranslationKey: "country",
  },
];
