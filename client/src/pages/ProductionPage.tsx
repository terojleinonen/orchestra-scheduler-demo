import { useParams } from "react-router-dom"
import { useSchedule } from "../hooks/useSchedule"
import ProductionTimeline from "../components/ProductionTimeline"

export default function ProductionPage() {

  const { name } = useParams()
  const { events } = useSchedule()
  if (!name) return null

  return (
    <ProductionTimeline
      events={events}
      production={name}
    />
  )
}