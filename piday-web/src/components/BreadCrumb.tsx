"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "../utils/cn";

type BreadCrumbProps = ComponentProps<"div"> & { path: string };

export function BreadCrumb({ className, path, ...props }: BreadCrumbProps) {
  const { t } = useTranslation("breadcrumb");
  const pathname = usePathname();
  return (
    <div className={cn(className)} {...props}>
      <Link href={"/"}>{t("breadcrumb:home")}</Link>
      <i className="ri-arrow-right-s-line"></i>
      <span>{path || t(`breadcrumb:${pathname.split("/")[1]}`)}</span>
    </div>
  );
}
