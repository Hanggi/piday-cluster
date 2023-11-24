import { ComponentProps } from "react";

import { cn } from "../utils/cn";

type WrapperProps = ComponentProps<"section"> & {
  modal?: boolean;
};

export function WrapperCard({ className, modal, ...props }: WrapperProps) {
  return (
    <section
      className={cn(
        "md:p-7 p-4 bg-white  rounded-lg md:rounded-xl",
        { "w-full md:w-[450px]": modal },
        className,
      )}
      style={{ boxShadow: "0px 4px 16px 0px rgba(0, 0, 0, 0.05)" }}
      {...props}
    />
  );
}
