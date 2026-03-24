import { cn } from "@/components/lib/utils"

/**
 * [COMPONENT] Skeleton
 * 
 * A placeholder component used to represent content that is currently loading.
 * It provides a pulsing animation to indicate background activity and reduce 
 * perceived latency.
 * 
 * For Java Developers:
 * - Similar to a specialized `ProgressIndicator` or `ProgressBar` in 
 *   Swing/JavaFX, but instead of a generic bar, it mimics the 
 *   layout of the content to come.
 * - Used during asynchronous data fetching (e.g., when waiting for a 
 *   `CompletableFuture` or `Task` to complete).
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
