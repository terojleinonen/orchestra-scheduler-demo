import { useCallback, useEffect, useRef, useState } from "react"
import type { ViewMode } from "@orchestra/shared"

export type ScheduleParams = {
  view: ViewMode
  date?: string
  department: string
}

const VIEWS: ViewMode[] = ["month", "week", "day"]

function readUrl(): ScheduleParams {
  const params = new URLSearchParams(window.location.search)
  const view = params.get("view") as ViewMode

  return {
    view: VIEWS.includes(view) ? view : "week",
    date: params.get("date") ?? undefined,
    department: params.get("department") ?? ""
  }
}

function writeUrl(state: ScheduleParams, replace: boolean) {
  const params = new URLSearchParams({ view: state.view })
  if (state.date) params.set("date", state.date)
  if (state.department) params.set("department", state.department)

  const url = `${window.location.pathname}?${params}`
  if (replace) window.history.replaceState(null, "", url)
  else window.history.pushState(null, "", url)
}

// Keeps the schedule selection in the URL so views can be bookmarked and the back button works.
export function useUrlState() {
  const [state, setState] = useState<ScheduleParams>(readUrl)
  const current = useRef(state)
  current.current = state

  useEffect(() => {
    const onPopState = () => setState(readUrl())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const update = useCallback((changes: Partial<ScheduleParams>, options?: { replace?: boolean }) => {
    const next = { ...current.current, ...changes }
    current.current = next
    writeUrl(next, options?.replace ?? false)
    setState(next)
  }, [])

  return [state, update] as const
}
