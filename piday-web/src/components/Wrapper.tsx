import { ComponentProps } from "react";

import { cn } from "../utils/cn";

type WrapperProps = ComponentProps<"section"> & {
  modal?: boolean;
};

export function Wrapper({ className, modal, ...props }: WrapperProps) {
  return (
    <section
      className={cn(
        "md:p-7 p-4 bg-white shadow-2xl shadow-gray-200 rounded-lg  md:rounded-xl",
        { "w-full md:w-[450px]": modal },
        className,
      )}
      {...props}
    />
  );
}
