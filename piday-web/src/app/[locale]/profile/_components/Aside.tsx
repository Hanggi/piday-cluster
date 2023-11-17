import { cn } from "@/src/utils/cn";

import dynamic from "next/dynamic";

import { ComponentProps } from "react";

const SideNav = dynamic(() =>
  import("./SideNav").then((module) => ({ default: module.SideNav })),
);
const User = dynamic(() =>
  import("./User").then((module) => ({ default: module.User })),
);

type AsideProps = ComponentProps<"aside">;

export function Aside({ className, ...props }: AsideProps) {
  return (
    <aside className={cn("relative", className)} {...props}>
      <User />
      <SideNav />
    </aside>
  );
}
