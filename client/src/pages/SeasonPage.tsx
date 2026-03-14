import { useSchedule } from "../hooks/useSchedule"
import SeasonHeatmap from "../components/SeasonHeatmap"

export default function SeasonPage() {

  const { events } = useSchedule()

  return (
    <SeasonHeatmap events={events} />
  )
}