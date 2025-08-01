import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminSideBar.css';

function AdminSideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false); // auto close sidebar on mobile
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">QuizMaster</h2>
          <button className="close-btn" onClick={toggleSidebar}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleNavigate('/admin')}>Dashboard</button>
          <button onClick={() => handleNavigate('/create-quiz')}>Create Quiz</button>
          <button onClick={() => handleNavigate('/admin-candidate')}>Candidates</button>
          <button onClick={() => handleNavigate('/admin-result')}>Results</button>
          <button onClick={()=>handleNavigate('/quiz/:candidateId')}> CandidateQuizPage</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </aside>


      {/* Main content (placeholder) */}
      <div className="dashboard-content">
        <button className="toggle-btn" onClick={toggleSidebar}>☰</button>
        
      </div>
    </div>
  );
}

export default AdminSideBar;
