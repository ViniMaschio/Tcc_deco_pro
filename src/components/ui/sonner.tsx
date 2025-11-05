"use client";

import { Toaster as Sonner, useSonner } from "sonner";
import { cn } from "@/lib/utils";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { toasts } = useSonner();

  return (
    <Sonner
      className={cn("toaster group z-999999", !toasts.length && "max-h-0 max-w-0")}
      position="top-center"
      toastOptions={{
        classNames: {
          toast:
            "dark:group-[.toaster]:bg-[#202020] group toast group-[.toaster]:bg-background group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg z-[999999]",
          description: "group-[.toast]:text-muted-foreground z-[999999]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground z-[999999]",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground z-[999999]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
