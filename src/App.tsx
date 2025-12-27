import { Routes, Route, Link } from 'react-router-dom';
import TicketForm from './components/TicketForm/TicketForm';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* Navigation Bar (Optional, but helpful for testing) */}
      <nav className="main-nav">
        <Link to="/" className="nav-link">Student Home</Link>
        <Link to="/login" className="nav-link">Tutor Login</Link>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      </nav>

      {/* The "Screen" that changes based on URL */}
      <Routes>
        <Route path="/" element={<StudentLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

// A small wrapper component to keep the "CS Tutoring Center" header 
// only on the Student page
function StudentLayout() {
  return (
    <div className="student-layout">
      <div className="student-header">
        <h1 className="student-title">CS Tutoring Center</h1>
        <p className="student-subtitle">
          Submit your question below and a tutor will be with you shortly.
        </p>
      </div>
      <TicketForm />
    </div>
  );
}

export default App;