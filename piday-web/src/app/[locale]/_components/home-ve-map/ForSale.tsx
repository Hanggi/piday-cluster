"use client";

import { cn } from "@/src/utils/cn";

import { Input, Option, Select, Typography } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type ForSaleProps = ComponentProps<"div">;

export function ForSale({ className, ...props }: ForSaleProps) {
  const { t } = useTranslation("home");

  return (
    <div className={cn("py-10", className)} {...props}>
      <Typography level="h4" className="text-center font-semibold">
        {t("onSaleLand")}
      </Typography>
      <br />
      <Input
        placeholder={t("enterLandToQuery")}
        size="lg"
        className="[&_.MuiSelect-root]:!border-0 mx-auto !rounded-full [&_.MuiSelect-root]:hover:!bg-transparent max-w-xl"
        startDecorator={
          <>
            <Select
              indicator={<i className="ri-arrow-down-s-fill" />}
              placeholder={t("allLand")}
            >
              <Option value="one">One</Option>
              <Option value="two">Two</Option>
              <Option value="three">Three</Option>
              <Option value="four">Four</Option>
            </Select>
            <div className="h-4 w-px bg-zinc-300"></div>
          </>
        }
        endDecorator={<i className="ri-search-line"></i>}
      />
    </div>
  );
}
