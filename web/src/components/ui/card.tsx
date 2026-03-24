import * as React from "react"

import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] Card
 * 
 * A fundamental container component for grouping related information.
 * 
 * For Java Developers:
 * - Think of this as a `JPanel` (Swing) or `Pane` (JavaFX). It's a basic
 *   container for organizing your UI components.
 * - `size="sm"` is like a predefined style variant or a theme setting.
 * - The `data-slot` attributes are used for CSS targeting (similar to
 *   using object IDs or CSS classes in JavaFX).
 */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardHeader
 * 
 * The top section of a card, typically used for titles and descriptions.
 * 
 * For Java Developers:
 * - This is like the "Header" area of a Dialog or a titled border.
 * - It uses CSS Grid to automatically arrange children (like `CardTitle` 
 *   and `CardAction`).
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardTitle
 * 
 * The main heading for a card.
 * 
 * For Java Developers:
 * - Equivalent to a `JLabel` with a bold font or a `Text` node with 
 *   heading styles in JavaFX.
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardDescription
 * 
 * Provides additional context or details about the card's content.
 * 
 * For Java Developers:
 * - Like a "subtitle" or secondary label with muted text colors.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardAction
 * 
 * A container for actions (like buttons or menus) placed in the card header.
 * 
 * For Java Developers:
 * - Think of this as the "button bar" or "toolbar" often found in the top-right
 *   corner of a window or panel.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardContent
 * 
 * The main body of the card where the primary information is displayed.
 * 
 * For Java Developers:
 * - This is the "Content Pane" of your component. 
 * - In React, children are passed implicitly (available in `props.children`),
 *   similar to how you add components to a container in Swing.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

/**
 * [COMPONENT] CardFooter
 * 
 * The bottom section of a card, often used for additional actions or status info.
 * 
 * For Java Developers:
 * - Similar to the "Status Bar" or "Button Panel" at the bottom of a Dialog.
 * - It often has a border at the top and a different background color.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
