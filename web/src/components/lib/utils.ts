import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * [UTILITY] cn - Class Name Merger
 * 
 * This is a standard utility function in modern React + Tailwind projects.
 * Think of it as a "String Builder" specifically for CSS class names.
 * 
 * Q: Why not just use string concatenation?
 * A: Strings like `"base " + (active ? "blue" : "")` lead to messy results 
 *    like `"base  "` (extra space) or conflicting Tailwind classes (e.g., 
 *    `p-2 p-4`). `cn` solves these issues automatically.
 * 
 * For Java Developers:
 * - `clsx`: Like a smarter `StringBuilder`. It takes strings, objects, 
 *   and arrays, and joins only the "truthy" parts.
 *   `clsx("a", true && "b", false && "c")` -> `"a b"`
 * 
 * - `twMerge`: Solves "Tailwind CSS specificity" issues. If you have `p-2` 
 *   and `p-4` together, it ensures the *last* one wins, so you don't end 
 *   up with weird layout bugs.
 * 
 * Pro-tip: Use this whenever you need "Conditional Classes" in your UI.
 */
export function cn(...inputs: ClassValue[]) {
  /**
   * Q: What is '...inputs'?
   * A: It's the "Spread Operator" (like 'varargs' in Java). It allows you to 
   *    pass any number of arguments, which are then collected into an array.
   */
  return twMerge(clsx(inputs))
}
