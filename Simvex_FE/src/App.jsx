import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home.jsx";
import Studypage from "./pages/Study.jsx"
// import PostList from "./pages/PostList"; 예시


function App() {
  return (
    <Routes>
      {/* <Route path="/lost" element={<LostList />} /> 예시 */}
      <Route path="/" element={< Homepage/>} />
      <Route path="/study" element={< Studypage/>} />
    </Routes>
  );
}

export default App;
