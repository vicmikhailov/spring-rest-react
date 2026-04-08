import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

/**
 * [ASSET IMPORTS]
 * 
 * Vite allows you to import CSS directly into your JS files. 
 * During the build process, Vite extracts these and bundles them into 
 * your production assets.
 * 
 * For Java Developers:
 * - This is like adding a stylesheet to your HTML's <head> automatically.
 */
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
 * - `<TooltipProvider>`: This is a "Context Provider". In Java terms, imagine this 
 *   as a global singleton or an Injector (like in Guice or Spring) that makes 
 *   certain functionality (tooltips) available to any sub-component without 
 *   passing it manually through Every. Single. Level.
 * 
 * TypeScript Syntax Detail:
 * - The `!` in `getElementById("root")!` is the "Non-null assertion operator".
 *   It tells the TypeScript compiler: "I am 100% sure this element exists in the HTML, 
 *   so don't worry about it being null." It's like a forced cast in Java.
 * 
 * 🚫 Antipattern: Heavy Logic in main.tsx
 *    Do not put business logic or fetch calls here. Just like your Java `main` 
 *    method should only bootstrap the `SpringApplication.run`, this file 
 *    should only bootstrap the React root.
 */
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      {/* The root component of our application */}
      <App />
    </TooltipProvider>
  </React.StrictMode>
)
