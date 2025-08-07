
// import { useEffect, useState } from 'react';
// import './AdminResult.css';
// import './CandidateModal.css'
// import AdminSideBar from '../Components/AdminSideBar';
// import Footer from '../Components/Footer';
// import CandidateModal from './CandidateModal';
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
// import { useNavigate } from 'react-router-dom';

// function AdminResult() {
//   const [results, setResults] = useState([]);
//   const [candidateSummary, setCandidateSummary] = useState({});
//   const [selectedCandidate, setSelectedCandidate] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const handleDashBoard = () => navigate('/admin');

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);
//         const data = await res.json();
//         setResults(data);

//         // Build summary grouped by candidate
//         const summary = {};
//         data.forEach(r => {
//           if (!summary[r.candidateName]) {
//             summary[r.candidateName] = { attempts: 0, totalScore: 0, attemptsData: [] };
//           }
//           summary[r.candidateName].attempts += 1;
//           summary[r.candidateName].totalScore += r.score;
//           summary[r.candidateName].attemptsData.push(r);
//         });

//         // Sort attempts by date descending
//         Object.keys(summary).forEach(name => {
//           summary[name].attemptsData.sort((a, b) => new Date(b.date) - new Date(a.date));
//         });

//         setCandidateSummary(summary);
//       } catch (error) {
//         console.error('Error fetching results:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, []);

//   // Prepare chart data: average score per candidate
//   const chartData = Object.keys(candidateSummary).map(name => ({
//     candidateName: name,
//     averageScore: candidateSummary[name].totalScore / candidateSummary[name].attempts
//   }));

//   // Latest attempt per candidate for table
//   const latestResults = Object.keys(candidateSummary).map(name => candidateSummary[name].attemptsData[0]);

//   return (
//     <div className="admin-results-wrapper">
//       <AdminSideBar />
//       <main className="results-container">
//         <h1>Quiz Results</h1>
//         <button className="back-btn" onClick={handleDashBoard}>← Back to Dashboard</button>

//         {loading ? (
//           <p>Loading results...</p>
//         ) : results.length === 0 ? (
//           <p>No results available yet.</p>
//         ) : (
//           <>
//             {/* Charts */}
//             <div className="chart-section">
//               <h3>Average Scores by Candidate</h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="candidateName" />
//                   <YAxis domain={[0, 10]} />
//                   <Tooltip />
//                   <Bar dataKey="averageScore" fill="#2563eb" />
//                 </BarChart>
//               </ResponsiveContainer>

//               <ResponsiveContainer width="100%" height={300}>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="candidateName" />
//                   <YAxis domain={[0, 10]} />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="averageScore" stroke="#4facfe" strokeWidth={3} activeDot={{ r: 6 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Table */}
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
//                   {latestResults.map((r, idx) => (
//                     <tr key={`${r._id}-${idx}`}>
//                       <td>{r.candidateName}</td>
//                       <td>{r.quizTitle}</td>
//                       <td>{r.technology}</td>
//                       <td>{r.score} / {r.totalQuestions}</td>
//                       <td>{new Date(r.date).toLocaleString()}</td>
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
//           </>
//         )}

//         <Footer />
//       </main>

//       {/* Candidate Modal */}
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
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

function AdminResult() {
  const [results, setResults] = useState([]);
  const [candidateSummary, setCandidateSummary] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleDashBoard = () => navigate('/admin');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);
        const data = await res.json();
        setResults(data);

        const summary = {};
        data.forEach(r => {
          if (!summary[r.candidateName]) {
            summary[r.candidateName] = { attempts: 0, totalScore: 0, attemptsData: [] };
          }
          summary[r.candidateName].attempts += 1;
          summary[r.candidateName].totalScore += r.score;
          summary[r.candidateName].attemptsData.push(r);
        });

        Object.keys(summary).forEach(name => {
          summary[name].attemptsData.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const chartData = Object.keys(candidateSummary).map(name => ({
    candidateName: name,
    averageScore: candidateSummary[name].totalScore / candidateSummary[name].attempts,
    fill: candidateSummary[name].totalScore > 50 ? '#82ca9d' : '#8884d8',
  }));

  const latestResults = Object.keys(candidateSummary).map(name => candidateSummary[name].attemptsData[0]);

  return (
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
              <h3>Average Scores by Candidate</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="candidateName" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="averageScore">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="candidateName" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="averageScore" stroke="#4facfe" strokeWidth={3} activeDot={{ r: 6 }} />
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
                  {latestResults.map((r, idx) => (
                    <tr key={`${r._id}-${idx}`}>
                      <td>{r.candidateName}</td>
                      <td>{r.quizTitle}</td>
                      <td>{r.technology}</td>
                      <td>{r.score} / {r.totalQuestions}</td>
                      <td>{new Date(r.date).toLocaleString()}</td>
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

