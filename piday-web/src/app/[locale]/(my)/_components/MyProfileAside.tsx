import { cn } from "@/src/utils/cn";

import dynamic from "next/dynamic";

import { ComponentProps } from "react";

const SideNav = dynamic(() =>
  import("./MySideNav").then((module) => ({
    default: module.MySideNav,
  })),
);
const User = dynamic(() =>
  import("./User").then((module) => ({
    default: module.User,
  })),
);

type MyProfileAsideProps = ComponentProps<"aside">;

export function MyProfileAside({ className, ...props }: MyProfileAsideProps) {
  return (
    <aside className={cn("relative", className)} {...props}>
      <User />
      <SideNav />
    </aside>
  );
}
