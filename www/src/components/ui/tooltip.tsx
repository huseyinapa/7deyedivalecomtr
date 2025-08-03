import * as React from "react";

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const TooltipTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  }
>(({ asChild, ...props }, ref) => {
  if (asChild) {
    return <div>{props.children}</div>;
  }
  return <button ref={ref} {...props} />;
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ className, side = "top", ...props }, ref) => (
  <div
    ref={ref}
    className={`z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md ${className}`}
    {...props}
  />
));
TooltipContent.displayName = "TooltipContent";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
};
