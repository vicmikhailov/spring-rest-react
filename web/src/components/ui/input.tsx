import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] Input
 *
 * A standard text input component built on top of Base UI's InputPrimitive.
 *
 * For Java Developers:
 * - This is like a `JTextField` in Swing or a `TextField` in JavaFX.
 * - It uses "Props" (similar to constructor arguments or setter methods) to
 *   configure its type, placeholder, and other standard HTML input attributes.
 * - The `className` prop allows for custom styling using Tailwind CSS utility
 *   classes, similar to setting a CSS class or style on a JavaFX node.
 *
 * Tailwind CSS breakdown:
 * - Layout/Sizing: `h-8` (32px height), `w-full` (100% width), `min-w-0` (prevent overflow)
 * - Spacing: `px-2.5 py-1` (horizontal/vertical padding)
 * - Shape/Border: `rounded-lg` (rounded corners), `border border-input` (themed border)
 * - Background/Text: `bg-transparent` (no background), `text-base` (default font size)
 * - Interaction/Focus: `transition-colors` (smooth state changes), `outline-none`, `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50` (custom focus ring)
 * - File Inputs: `file:*` (styles for type="file" browser button)
 * - Placeholders: `placeholder:text-muted-foreground` (themed secondary color)
 * - Disabled: `disabled:*` (styling for non-interactive state)
 * - Accessibility: `aria-invalid:*` (error state styling when validation fails)
 * - Responsive: `md:text-sm` (smaller text on tablet/desktop)
 * - Dark Mode: `dark:*` (variants for dark theme support)
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
