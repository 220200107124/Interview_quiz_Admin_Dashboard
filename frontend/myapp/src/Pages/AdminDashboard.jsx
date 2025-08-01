import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSideBar from '../Components/AdminSideBar';
import DashboardStats from '../Components/DashboardStats';
import Footer from '../Components/Footer';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  const handleCreateQuiz = () => navigate('/create-quiz');
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin-login');
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Are you sure to delete this quiz?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/quizzes/${id}`);
      fetchQuizzes();
    } catch (err) {
      console.error('Failed to delete quiz', err);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <AdminSideBar />
      <main className="dashboard-container">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-buttons">
            <button className="creates-btn" onClick={handleCreateQuiz}>+ Create Quiz</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="stats-cards">
          <DashboardStats />
        </div>

        <div className="quiz-list">
          <h2>Your Quizzes</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz._id}>
                    <td>{quiz.title}</td>
                    <td>{quiz.category}</td>
                    <td>{quiz.difficulty}</td>
                    <td>{quiz.questions.length}</td>
                    <td>
                      <button className="manage-btn" onClick={() => navigate('/create-quiz', { state: { quiz } })}>Manage</button>
                      <button className="deletes-btn" onClick={() => handleDeleteQuiz(quiz._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default AdminDashboard;
