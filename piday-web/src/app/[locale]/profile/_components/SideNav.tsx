import { cn } from "@/src/utils/cn";

import { ComponentProps } from "react";

type SideNavProps = ComponentProps<"div">;

export function SideNav({ className, ...props }: SideNavProps) {
  return <div className={cn(className)} {...props}></div>;
}
