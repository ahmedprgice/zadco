import { createContext, useContext } from "react"

export const RouteLocation = createContext(new URL("https://www.zadco.ae/"))
export function useRouteLocation() {
  return useContext(RouteLocation)
}
