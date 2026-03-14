import { useEffect, useState } from "react"

import { useSchedule } from "../hooks/useSchedule"

import WeekScheduler from "../components/WeekScheduler"
import AgendaView from "../components/AgendaView"
import MobileScheduler from "../components/MobileScheduler"
import SchedulerToolbar from "../components/SchedulerToolbar"
import EventInspector from "../components/EventInspector"
import MonthView from "../components/MonthView"


interface Props {
  view: "week" | "agenda" | "month"
}

export default function SchedulePage({ view }: Props) {
  const { events, loading, error } = useSchedule()
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 700
  )
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  if (loading) {
    return <div className="loading">Loading schedule...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (

    <div className="schedulePage">
      <SchedulerToolbar />

      {view === "month" && (
        <MonthView
          events={events}
          year={currentYear}
          month={currentMonth}
        />
      )}


      {view === "week" && !isMobile && (
        <WeekScheduler events={events} />
      )}

      {view === "week" && isMobile && (
        <MobileScheduler events={events} />
      )}

      {view === "agenda" && (
        <AgendaView events={events} />
      )}

      <EventInspector />

    </div>

  )

}