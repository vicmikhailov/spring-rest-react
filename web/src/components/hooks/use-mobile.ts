import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * [CUSTOM HOOK] useIsMobile
 *
 * For Java Developers:
 * - A "hook" is a function prefixed with `use` that encapsulates reusable stateful logic; think of it as a helper that wires listeners and hands back a simple value.
 * - `useState` is like keeping a field inside a Spring bean; calling its setter triggers React to re-render subscribers.
 * - `useEffect` is similar to a lifecycle callback (e.g., `@PostConstruct`/`@PreDestroy`): it runs after the component first renders and returns a cleanup to undo listeners when the component unmounts.
 *
 * Behavior:
 * - Subscribes to `matchMedia` for the mobile breakpoint and updates state on resize.
 * - Returns `true` when the viewport width is below the breakpoint so components can branch on layout.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
