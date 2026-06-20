// components/ui/modal.tsx
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";

export interface ModalProps {
  /** Content of the modal */
  children: React.ReactNode;
  /** Title displayed at the top */
  title?: string;
  /** Whether the modal is open initially */
  defaultOpen?: boolean;
  /** Callback when modal is closed */
  onClose?: () => void;
}

/**
 * Reusable modal component using Headless UI Dialog.
 * Use the `open` state returned from the component to control visibility.
 */
export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  defaultOpen = false,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={twMerge(
                  "w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all",
                  "border border-gray-200"
                )}
              >
                {title && (
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground mb-4">
                    {title}
                  </Dialog.Title>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
