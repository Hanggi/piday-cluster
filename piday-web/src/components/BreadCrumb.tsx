"use client";

import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../utils/cn";

type BreadCrumbProps = ComponentProps<"div"> & { path?: string };

export function BreadCrumb({ className, path, ...props }: BreadCrumbProps) {
  const { t } = useTranslation("breadcrumb");
  const pathname = usePathname();
  return (
    <Breadcrumbs
      aria-label="breadcrumbs"
      className={cn(className)}
      separator={<i className="ri-arrow-right-s-line"></i>}
    >
      <Link href={"/"}>{t("breadcrumb:home")}</Link>

      <Typography>
        {path || t(`breadcrumb:${pathname.split("/")[1]}`)}
      </Typography>
    </Breadcrumbs>
  );
}
