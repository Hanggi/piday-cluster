"use client";

import { cn } from "@/src/utils/cn";

import {
  ModalClose,
  ModalDialog,
  Modal as ModalRoot,
  Typography,
} from "@mui/joy";

import { ComponentPropsWithRef, forwardRef, useState } from "react";

import { WrapperCard } from "../WrapperCard";

type ModalProps = ComponentPropsWithRef<"div"> & {
  Content: React.ReactNode;
  title?: string;
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, Content, title, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <div onClick={() => setOpen(true)}>{children}</div>
        <ModalRoot open={open} onClose={() => setOpen(false)}>
          <ModalDialog className="!p-0">
            <WrapperCard modal {...props} className={cn(className)}>
              <header className="flex px-5 py-3 absolute top-0 inset-x-0 items-center justify-between">
                <Typography>{title}</Typography>
                <ModalClose />
              </header>
              {Content}
            </WrapperCard>
          </ModalDialog>
        </ModalRoot>
      </>
    );
  },
);

Modal.displayName = "Modal";
export { Modal };
