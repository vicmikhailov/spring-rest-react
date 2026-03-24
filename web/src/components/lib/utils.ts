import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * [UTILITY] cn - Class Name Merger
 * 
 * Q: Why not just use string concatenation?
 * A: Strings like `"base " + (active ? "blue" : "")` lead to messy results 
 *    like `"base  "` (extra space) or conflicting Tailwind classes (e.g., 
 *    `p-2 p-4`). `cn` solves these issues automatically.
 */
export function cn(...inputs: ClassValue[]) {
  /**
   * Q: What is '...inputs'?
   * A: It's the "Spread Operator" (like 'varargs' in Java). It allows you to 
   *    pass any number of arguments, which are then collected into an array.
   */
  return twMerge(clsx(inputs))
}
