import { useNavigate, useLocation } from "react-router-dom"
import { reloadSchedule } from "../api/scheduleApi"
import { useScheduler } from "../context/SchedulerContext"

export default function SchedulerToolbar() {

  const navigate = useNavigate()
  const location = useLocation()

  const { setSelectedEvent } = useScheduler()

  const isWeek = location.pathname.includes("week")
  const isAgenda = location.pathname.includes("agenda")

  async function handleReload() {

    try {

      await reloadSchedule()

      window.location.reload()

    } catch (err) {

      console.error("Reload failed", err)

    }

  }

  function goWeek() {
    navigate("/schedule/week")
  }

  function goAgenda() {
    navigate("/schedule/agenda")
  }

  function clearSelection() {
    setSelectedEvent(null)
  }

  return (

    <div className="schedulerToolbar">

      <div className="toolbarLeft">

        <button onClick={goWeek} disabled={isWeek}>
          Week
        </button>

        <button onClick={goAgenda} disabled={isAgenda}>
          Agenda
        </button>

      </div>

      <div className="toolbarCenter">

        <span className="toolbarTitle">
          Orchestra Schedule
        </span>

      </div>

      <div className="toolbarRight">

        <button onClick={handleReload}>
          Reload
        </button>

        <button onClick={clearSelection}>
          Clear
        </button>

      </div>

    </div>

  )

}