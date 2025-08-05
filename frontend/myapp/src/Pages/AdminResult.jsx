// import { useEffect, useState } from 'react';
// import './AdminResult.css';
// import AdminSideBar from '../Components/AdminSideBar';
// import Footer from '../Components/Footer';
// import CandidateModal from './CandidateModal';  // import modal
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { useNavigate } from 'react-router-dom';

// function AdminResult() {
//   const [results, setResults] = useState([]);
//   const [candidateSummary, setCandidateSummary] = useState({});
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const navigate = useNavigate();

//   const handleDashBoard = () => navigate('/admin');

//   useEffect(() => {
//     const dummyResults = [
//       { id: 1, candidateName: 'John Doe', quizTitle: 'React Fundamentals', technology: 'React', score: 8, totalQuestions: 10, date: '2025-07-22' },
//       { id: 2, candidateName: 'Jane Smith', quizTitle: 'Node Basics', technology: 'Node', score: 6, totalQuestions: 10, date: '2025-07-21' },
//       { id: 3, candidateName: 'John Doe', quizTitle: 'Node Basics', technology: 'Node', score: 7, totalQuestions: 10, date: '2025-07-23' },
//       { id: 4, candidateName: 'Jane Smith', quizTitle: 'React Fundamentals', technology: 'React', score: 9, totalQuestions: 10, date: '2025-07-24' }
//     ];
//     setResults(dummyResults);

//     // Build candidate summary
//     const summary = {};
//     dummyResults.forEach(r => {
//       if (!summary[r.candidateName]) {
//         summary[r.candidateName] = { attempts: 0, totalScore: 0, attemptsData: [] };
//       }
//       summary[r.candidateName].attempts += 1;
//       summary[r.candidateName].totalScore += r.score;
//       summary[r.candidateName].attemptsData.push(r);
//     });
//     setCandidateSummary(summary);
//   }, []);

//   return (
//     <div>
//       <div className="admin-results-wrapper">
//         <AdminSideBar />
//         <main className="results-container">
//           <h1>Quiz Results</h1>
//           <button className="back-btn" onClick={handleDashBoard}>← Back to Dashboard</button>

//           <div className="chart-section">
//             <h3>Scores by Candidate</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={results}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="candidateName" />
//                 <YAxis domain={[0, 10]} />
//                 <Tooltip />
//                 <Bar dataKey="score" fill="#2563eb" />
//               </BarChart>
//             </ResponsiveContainer>

//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={results}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="candidateName" />
//                 <YAxis domain={[0, 10]} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="score" stroke="#4facfe" strokeWidth={3} activeDot={{ r: 6 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {results.length ===0? (
//             <p>No results available yet.</p>
//           ) : (
//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Candidate</th>
//                     <th>Quiz</th>
//                     <th>Technology</th>
//                     <th>Score</th>
//                     <th>Date</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {results.map((r, idx) => (
//                     <tr key={`${r.id}-${idx}`}>
//                       <td>{r.candidateName}</td>
//                       <td>{r.quizTitle}</td>
//                       <td>{r.technology}</td>
//                       <td>{r.score} / {r.totalQuestions}</td>
//                       <td>{r.date}</td>
//                       <td>
//                         <button className="view-btn" onClick={() => setSelectedCandidate(r.candidateName)}>
//                           View Detail
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//            <Footer/>
//         </main>
//       </div>

//       {/* Modal */}
//       {selectedCandidate && candidateSummary[selectedCandidate] && (
//         <CandidateModal
//           candidateName={selectedCandidate}
//           details={candidateSummary[selectedCandidate]}
//           onClose={() => setSelectedCandidate(null)}
//         />
//       )}
     
//     </div>
//   );
// }

// export default AdminResult;
import { useEffect, useState } from 'react';
import './AdminResult.css';
import AdminSideBar from '../Components/AdminSideBar';
import Footer from '../Components/Footer';
import CandidateModal from './CandidateModal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function AdminResult() {
  const [results, setResults] = useState([]);
  const [candidateSummary, setCandidateSummary] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDashBoard = () => navigate('/admin');
  const API_URL= 'https://interview-quiz-admin-dashboard.onrender.com'; 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/results`);  // adjust your backend endpoint
        const data = await res.json();
        setResults(data);

        // Build summary dynamically
        const summary = {};
        data.forEach(r => {
          if (!summary[r.candidateName]) {
            summary[r.candidateName] = { attempts: 0, totalScore: 0, attemptsData: [] };
          }
          summary[r.candidateName].attempts += 1;
          summary[r.candidateName].totalScore += r.score;
          summary[r.candidateName].attemptsData.push(r);
        });
        setCandidateSummary(summary);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <div className="admin-results-wrapper">
        <AdminSideBar />
        <main className="results-container">
          <h1>Quiz Results</h1>
          <button className="back-btn" onClick={handleDashBoard}>← Back to Dashboard</button>

          {loading ? (
            <p>Loading results...</p>
          ) : results.length === 0 ? (
            <p>No results available yet.</p>
          ) : (
            <>
              <div className="chart-section">
                <h3>Scores by Candidate</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidateName" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidateName" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#4facfe" strokeWidth={3} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Quiz</th>
                      <th>Technology</th>
                      <th>Score</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, idx) => (
                      <tr key={`${r._id || r.id}-${idx}`}>
                        <td>{r.candidateName}</td>
                        <td>{r.quizTitle}</td>
                        <td>{r.technology}</td>
                        <td>{r.score} / {r.totalQuestions}</td>
                        <td>{r.date}</td>
                        <td>
                          <button className="view-btn" onClick={() => setSelectedCandidate(r.candidateName)}>
                            View Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          <Footer />
        </main>
      </div>

      {/* Modal */}
      {selectedCandidate && candidateSummary[selectedCandidate] && (
        <CandidateModal
          candidateName={selectedCandidate}
          details={candidateSummary[selectedCandidate]}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}

export default AdminResult;
