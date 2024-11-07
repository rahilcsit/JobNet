
import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './Pages/Home';
// import JobCard from './components/JobCard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FullDetailPage from "./Pages/FullDetailPage";
const App = () => {
  return (
    <div>
      <Navbar />
      <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobdetails" element={<FullDetailPage />} />
      </Routes>
    </Router>
    </div>
    
  );
};

export default App;
