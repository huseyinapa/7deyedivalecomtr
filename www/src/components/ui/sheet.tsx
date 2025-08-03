import * as React from "react";

const Sheet = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  }
>(({ className, asChild, ...props }, ref) => {
  if (asChild) {
    return <div>{props.children}</div>;
  }

  return (
    <button
      ref={ref}
      className={className}
      {...props}
    />
  );
});
SheetTrigger.displayName = "SheetTrigger";

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
  }
>(({ className, side = "right", ...props }, ref) => (
  <div
    ref={ref}
    className={`fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 ${side === "left"
        ? "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm"
        : ""
      } ${className}`}
    {...props}
  />
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent };
