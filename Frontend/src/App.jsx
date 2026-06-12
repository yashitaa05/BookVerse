import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookDetails from './pages/BookDetails';
import ChapterView from './pages/ChapterView';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/chapter/:chapterId" element={<ChapterView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
