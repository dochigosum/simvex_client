import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ObjectSelect from './pages/ObjectSelect';
import Study from './pages/study';
import ProjectSelect from './pages/ProjectSelect';
import CAD from './pages/cad/App';
import './styles/global.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/study/select" element={<ObjectSelect />} />
      <Route path="/study" element={<Study />} />
      
      <Route path="/cad/select" element={<ProjectSelect />} />
      <Route path="/cad" element={<CAD />} />
    </Routes>
  );
}

export default App;
