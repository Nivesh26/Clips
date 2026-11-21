import { BrowserRouter, Routes, Route } from "react-router"
import Local from "./Pages/Local"
import AIclips from "./Pages/AIclips"
import Youtube from "./Pages/Youtube"
import History from "./Pages/History"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Local />} />
        <Route path="/local" element={<Local />} />
        <Route path="/aiclips" element={<AIclips />} />
        <Route path="/youtube" element={<Youtube />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
