"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/src/utils/cn";

import { ComponentPropsWithRef, forwardRef } from "react";

import { Wrapper } from "../Wrapper";

type ModalProps = ComponentPropsWithRef<"div"> & {
  Content: React.ReactNode;
  title?: string;
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, Content, title, ...props }, ref) => {
    return (
      <Dialog.Root>
        <Dialog.Trigger>{children}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
          <Dialog.Content
            ref={ref}
            {...props}
            asChild
            className={cn("fixed center z-50", className)}
          >
            <Wrapper modal>
              <header className="flex px-5 py-3 absolute top-0 inset-x-0 items-center justify-between">
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Close>
                  <i className="ri-close-fill text-3xl hover:scale-105 transition-all"></i>
                </Dialog.Close>
              </header>
              {Content}
            </Wrapper>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

Modal.displayName = "Modal";
export { Modal };
