"use client";

import { VirtualEstateCard } from "@/src/components/LandCard";
import { useGetLatestVirtualEstatesQuery } from "@/src/features/virtual-estate/api/virtualEstateAPI";
import { cn } from "@/src/utils/cn";

import { Input, Option, Select, Typography } from "@mui/joy";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

type ForSaleProps = ComponentProps<"div">;

export function ForSale({ className, ...props }: ForSaleProps) {
  const { t } = useTranslation("home");

  const { data: latestVirtualEstates } = useGetLatestVirtualEstatesQuery({
    page: 1,
    size: 8,
  });

  return (
    <div className={cn("py-10", className)} {...props}>
      <Typography className="text-center font-semibold" level="h4">
        {t("onSaleLand")}
      </Typography>
      <br />
      <Input
        className="[&_.MuiSelect-root]:!border-0 mx-auto !rounded-full [&_.MuiSelect-root]:hover:!bg-transparent max-w-xl"
        endDecorator={<i className="ri-search-line"></i>}
        placeholder={t("enterLandToQuery")}
        size="lg"
        startDecorator={
          <>
            <Select
              indicator={<i className="ri-arrow-down-s-fill" />}
              placeholder={t("allLand")}
            >
              <Option value="10">10</Option>
              <Option value="20">20</Option>
              <Option value="30">30</Option>
              <Option value="50">50</Option>
            </Select>
            <div className="h-4 w-px bg-zinc-300"></div>
          </>
        }
      />
      <br />
      <section className="grid py-6 container-mini grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(latestVirtualEstates || []).map((ve, index) => (
          <VirtualEstateCard key={index} ve={ve} />
        ))}
      </section>
    </div>
  );
}
