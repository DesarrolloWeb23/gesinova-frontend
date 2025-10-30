import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-transparent items-center justify-center flex border-2 border-secondary  shadow-lg hover:bg-secondary  text-secondary hover:text-white duration-300 cursor-pointer active:scale-[0.98]",
        destructive:
          "bg-transparent items-center justify-center flex border-2 border-destructive  shadow-lg hover:bg-destructive  text-destructive hover:text-white duration-300 cursor-pointer active:scale-[0.98]",
        outline:
          "border bg-transparent text-foreground shadow-md hover:bg-accent hover:text-accent-foreground dark:bg-card dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground flex flex-row justify-center items-center px-[38px] py-[15px] rounded-[16px] border border-transparent tracking-[1px] transition-all duration-150 ease-linear hover:bg-secondary/10 hover:border-secondary hover:text-secondary hover:-translate-y-[5px] hover:scale-105 disabled:bg-white/20 disabled:text-muted-foreground disabled:border-muted",
        tertiary:
          "bg-transparent items-center justify-center flex border-2 border-tertiary shadow-lg hover:bg-tertiary/70 text-tertiary hover:text-white duration-300 cursor-pointer active:scale-[0.98]",
        ghost:
          "border-2 border-accent hover:bg-accent shadow-lg hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
