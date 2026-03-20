import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles.css"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * [ENTRY POINT] main.tsx
 * 
 * This is the "Main" class of your frontend application, equivalent to the 
 * `public static void main(String[] args)` method in a Java application.
 * 
 * For Java Developers:
 * - `document.getElementById("root")` is equivalent to finding a DOM element by its ID.
 *   In your `index.html`, there is a `<div id="root"></div>` where the entire 
 *   React application will be "injected".
 * 
 * - `createRoot(...).render(...)`: This is the bootstrapping process. It initializes 
 *   the React engine and starts the rendering process for the `App` component.
 * 
 * - `<React.StrictMode>`: This is a developer-only wrapper. It doesn't render any 
 *   UI, but it activates additional checks and warnings for its descendants.
 *   Think of it like running your Java app with `-Xlint` or in a "Debug" mode 
 *   that catches common mistakes early.
 * 
 * TypeScript Syntax Detail:
 * - The `!` in `getElementById("root")!` is the "Non-null assertion operator".
 *   It tells the TypeScript compiler: "I am 100% sure this element exists in the HTML, 
 *   so don't worry about it being null." It's like a forced cast in Java.
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      {/* The root component of our application */}
      <App />
    </TooltipProvider>
  </React.StrictMode>
)
