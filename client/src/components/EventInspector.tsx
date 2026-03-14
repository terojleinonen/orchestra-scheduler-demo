import { useScheduler } from "../context/SchedulerContext"

export default function EventInspector(){

  const { selectedEvent, setSelectedEvent } = useScheduler()

  if(!selectedEvent) return null

  return (

    <div className="eventInspector">

      <div className="inspectorHeader">

        <h3>{selectedEvent.title}</h3>

        <button
          onClick={() => setSelectedEvent(null)}
        >
          Close
        </button>

      </div>

      <pre>
        {JSON.stringify(selectedEvent, null, 2)}
      </pre>

    </div>

  )

}