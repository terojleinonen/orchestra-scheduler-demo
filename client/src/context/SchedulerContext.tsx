import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo
} from "react"

import { type ScheduleEvent } from "../api/scheduleApi"

type ViewMode =
  | "week"
  | "agenda"

interface SchedulerContextType {

  events: ScheduleEvent[]
  setEvents: (events: ScheduleEvent[]) => void

  view: ViewMode
  setView: (view: ViewMode) => void

  selectedEvent: ScheduleEvent | null
  setSelectedEvent: (event: ScheduleEvent | null) => void

}

const SchedulerContext =
  createContext<SchedulerContextType | undefined>(undefined)

interface ProviderProps {
  children: ReactNode
}

export function SchedulerProvider({ children }: ProviderProps) {

  const [events, setEvents] =
    useState<ScheduleEvent[]>([])

  const [view, setView] =
    useState<ViewMode>("week")

  const [selectedEvent, setSelectedEvent] =
    useState<ScheduleEvent | null>(null)

  const value = useMemo(
    () => ({
      events,
      setEvents,
      view,
      setView,
      selectedEvent,
      setSelectedEvent
    }),
    [events, view, selectedEvent]
  )

  return (

    <SchedulerContext.Provider value={value}>

      {children}

    </SchedulerContext.Provider>

  )

}

export function useScheduler(): SchedulerContextType {

  const context = useContext(SchedulerContext)

  if (!context) {
    throw new Error(
      "useScheduler must be used inside SchedulerProvider"
    )
  }

  return context

}