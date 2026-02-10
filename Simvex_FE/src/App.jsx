import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // 내가 만든 Home (폴더)
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ObjectSelect from './pages/ObjectSelect';
import Studypage from "./pages/Study.jsx"; // 친구가 만든 Study
import StudyBP from "./pages/Study-bp.jsx";
import ProjectSelect from './pages/ProjectSelect';
import CAD from './pages/cad/App';
import './styles/global.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      {/* Study: 오브젝트 선택 */}
      <Route path="/study/select" element={<ObjectSelect />} />

      <Route path="/study/" element={<Studypage />} />
      <Route path="/study/bp" element={<StudyBP />} /> 
      
      {/* CAD */}
      <Route path="/cad/select" element={<ProjectSelect />} />
      <Route path="/cad" element={<CAD />} />
    </Routes>
  );
}

export default App;
