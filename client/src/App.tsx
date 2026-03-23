import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

import SchedulePage from "./pages/SchedulePage"
import "./styles/global.css"

export default function App() {
  return (
    <BrowserRouter>
        <main className="appContent">
          <Routes>
            <Route
              path="/"
              element={<SchedulePage />}
            />
          </Routes>
        </main>
    </BrowserRouter>
  )
}