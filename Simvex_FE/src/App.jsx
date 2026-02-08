import { Routes, Route } from "react-router-dom";
import CAD from "./pages/cad/App";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CAD />} />
      <Route path="/cad" element={<CAD />} />
    </Routes>
  );
}

export default App;
