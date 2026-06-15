import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookDetails from './pages/BookDetails';
import ChapterView from './pages/ChapterView';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('voicedoc_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/chapter/:chapterId" element={<ChapterView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
