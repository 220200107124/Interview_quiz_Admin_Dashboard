import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import CreateQuizpage from './Pages/CreateQuizpage';
import CandidateQuizpage from './Pages/CandidateQuizpage';
import ThankYouPage from './Pages/ThankYouPage';
import AdminCandidatePage from './Pages/AdminCandidatePage';
import AdminResult from './Pages/AdminResult';
// import TestCandidatePage from './Pages/TestCandidatePage';
// import CandidateDetail from './Pages/CandidateDetail';
// import CandidateQuizpage from './Pages/CandidateQuizpage';




function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginWrapper />} />         
      <Route path="/admin-login" element={<LoginWrapper />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/create-quiz" element={<CreateQuizpage />} />
     <Route path="/quiz/:candidateId" element={<CandidateQuizpage />} />

      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="/admin-candidate" element={<AdminCandidatePage />} />
      <Route  path='/admin-result' element={<AdminResult/>}/>
      {/* <Route path='/test-candidate' element={<TestCandidatePage/>}/> */}

      
    </Routes>
    
  );
}

function LoginWrapper() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/admin');
  };

  return <AdminLogin onLogin={handleLogin} />;


}

export default App;
