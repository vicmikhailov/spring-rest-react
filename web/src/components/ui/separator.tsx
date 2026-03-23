import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] Separator
 *
 * A simple visual element used to divide content, supporting both horizontal
 * and vertical orientations.
 *
 * For Java Developers:
 * - This is like a `JSeparator` in a Swing UI.
 * - It uses "Props" to configure its orientation and custom styling (className).
 * - `SeparatorPrimitive.Props` is like an interface defining allowed parameters
 *   for the component.
 */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
