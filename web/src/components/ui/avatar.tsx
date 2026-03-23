import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] Avatar
 *
 * The root container for an avatar, providing layout and sizing context
 * for its children (Image, Fallback, Badge).
 *
 * For Java Developers:
 * - This is your main "Parent Container" or "Bounding Box".
 * - It uses a "Compound Component" pattern: the state (like whether the image
 *   loaded successfully) is managed here and shared with children automatically.
 */
function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] AvatarImage
 *
 * The actual image element for the avatar.
 *
 * For Java Developers:
 * - This is like a specialized `ImageView`.
 * - It automatically handles the loading state. If it fails, the `AvatarFallback`
 *   sibling will be displayed instead.
 */
function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] AvatarFallback
 *
 * Content to display when the avatar image is loading or fails to load.
 *
 * For Java Developers:
 * - This is the "Null Object Pattern" or "Fallback" for the UI.
 * - Commonly used to show initials (e.g., "JD" for John Doe).
 */
function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] AvatarBadge
 *
 * A small status indicator (like an "Online" dot) that sits on the corner of the avatar.
 *
 * For Java Developers:
 * - This is a "Decorator" that visually augments the base Avatar component.
 * - It uses absolute positioning relative to the Avatar root.
 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] AvatarGroup
 *
 * A layout container for stacking multiple avatars together.
 *
 * For Java Developers:
 * - This is like a `HBox` or `FlowLayout` with negative spacing to create
 *   the overlapping effect.
 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

/**
 * [COMPONENT] AvatarGroupCount
 *
 * Displays the number of hidden avatars when using an AvatarGroup.
 *
 * For Java Developers:
 * - Used for "And X more" labels in a list.
 * - It's a "Summary View" for a collection of data.
 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
