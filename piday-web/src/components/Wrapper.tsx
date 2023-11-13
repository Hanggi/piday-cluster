import { ComponentProps } from "react";

import { cn } from "../utils/cn";

type WrapperProps = ComponentProps<"section">;

export function Wrapper({ className, ...props }: WrapperProps) {
  return (
    <section
      className={cn(
        "md:p-7 p-4 bg-white shadow rounded-lg  md:rounded-xl",
        className,
      )}
      {...props}
    />
  );
}
