"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] TooltipProvider
 * 
 * Provides global settings and context for all tooltips within its hierarchy.
 * Typically wraps the entire application or a major section to manage 
 * global tooltip behaviors like display delays.
 * 
 * For Java Developers:
 * - Similar to `ToolTipManager` (Swing) or a global `Tooltip.install()` 
 *   policy in JavaFX.
 * - `delay` is like setting the initial/dismiss delay for all tooltips 
 *   in the manager.
 */
function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  )
}

/**
 * [COMPONENT] Tooltip
 * 
 * The root container that coordinates the interaction between a trigger 
 * and its tooltip content.
 * 
 * For Java Developers:
 * - Think of this as the "Model" for a single tooltip instance, 
 *   managing its open/closed state.
 */
function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

/**
 * [COMPONENT] TooltipTrigger
 * 
 * The element that triggers the display of a tooltip when hovered or focused.
 * 
 * For Java Developers:
 * - This is any `JComponent` (Swing) that has `setToolTipText()` called, 
 *   or a `Node` (JavaFX) that has `Tooltip.install()` applied to it.
 */
function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/**
 * [COMPONENT] TooltipContent
 * 
 * The actual visual popup that displays information when the tooltip is active.
 * Handles positioning, animations, and portal rendering.
 * 
 * For Java Developers:
 * - This is the actual `JToolTip` (Swing) or the `Skin` of a `Tooltip` 
 *   (JavaFX) that renders the message on screen.
 * - Positioning props like `side` and `align` are similar to 
 *   `Popup.show()` coordinates or `Side` enum in JavaFX.
 */
function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<
    TooltipPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
