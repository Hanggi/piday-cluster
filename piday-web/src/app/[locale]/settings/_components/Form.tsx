"use client";

import {
  Autocomplete,
  Button,
  Dropdown,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
} from "@mui/joy";

import { ElementRef, useRef } from "react";
import { useTranslation } from "react-i18next";

export const Form = () => {
  const { t } = useTranslation("settings");
  const countryFormRef = useRef<ElementRef<typeof FormControl>>(null);
  return (
    <div className="md:px-7 px-4 pb-7 max-w-4xl grid grid-cols-1 md:grid-cols-2 md:gap-x-14 mx-auto gap-y-10">
      {inputFields.map((field) => (
        <FormControl key={field.labelTranslationKey}>
          <FormLabel>{t(field.labelTranslationKey)}</FormLabel>
          <Input
            endDecorator={
              field.endDecorator && <Button>{field.endDecorator}</Button>
            }
            placeholder={t(field.placeholderTranslationKey)}
          />
        </FormControl>
      ))}
      <FormControl ref={countryFormRef}>
        <FormLabel>{t("enter")}</FormLabel>
        <Dropdown>
          <MenuButton className="!flex !justify-between !text-black/40">
            {t("country")} <i className="ri-arrow-down-s-line"></i>
          </MenuButton>
          <Menu
            style={{
              width: countryFormRef.current?.offsetWidth,
            }}
          >
            <Autocomplete
              className="!rounded-full !border-[#EEE] !bg-[#F7F7F7] [&_[type='button']]:hidden mx-4 my-2"
              endDecorator={<i className="ri-search-line"></i>}
              options={Array.from(Array(5).keys()).map((i) => i)}
              placeholder="Type anything"
            />
          </Menu>
        </Dropdown>
      </FormControl>

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
    labelTranslationKey: "bindPIDWalletAddress",
    placeholderTranslationKey: "enter",
    endDecorator: "bind",
  },
];
