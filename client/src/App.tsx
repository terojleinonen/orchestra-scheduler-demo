import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { SchedulerProvider } from "./context/SchedulerContext"
import SchedulePage from "./pages/SchedulePage"
import SeasonPage from "./pages/SeasonPage"
import ProductionPage from "./pages/ProductionPage"
import "./styles/schedule.css"
export default function App() {

  return (

    <BrowserRouter>
      <SchedulerProvider>
        <Routes>
          <Route
            path="/schedule/production/:name"
            element={<ProductionPage />}
          />
          <Route
            path="/schedule/season"
            element={<SeasonPage />}
          />
          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/schedule/week" />}
          />
          {/* Week scheduler */}
          <Route
            path="/schedule/week"
            element={<SchedulePage view="week" />}
          />
          {/* Month scheduler */}
          <Route
            path="/schedule/month"
            element={<SchedulePage view="month" />}
          />
          {/* Agenda view */}
          <Route
            path="/schedule/agenda"
            element={<SchedulePage view="agenda" />}
          />
          {/* Fallback */}
          <Route
            path="*"
            element={<Navigate to="/schedule/week" />}
          />
        </Routes>
      </SchedulerProvider>
    </BrowserRouter>
  )

}