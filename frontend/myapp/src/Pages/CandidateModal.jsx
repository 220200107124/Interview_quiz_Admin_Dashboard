// import './AdminResult.css'; // or separate css if you prefer
// import './CandidateDetail.css';

// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// function CandidateModal({ candidateName, details, onClose }) {
//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h2>Details for {candidateName}</h2>
//         <p><strong>Total Attempts:</strong> {details.attempts}</p>
//         <p><strong>Total Score:</strong> {details.totalScore}</p>
//         <p><strong>Average Score:</strong> {(details.totalScore / details.attempts).toFixed(2)}</p>

//         <h4>All Attempts:</h4>
//         <ul>
//           {details?.attemptsData?.length > 0 ? details.attemptsData.map((attempt, idx) => (
//             <li key={idx}>
//               Quiz: <strong>{attempt.quizTitle}</strong> | Score: {attempt.score}/{attempt.totalQuestions} | Date: {attempt.date}
//             </li>
//           )) : <li>No attempts found</li>}
//         </ul>

//         {details?.attemptsData?.length > 0 && (
//           <div className="chart-wrapper">
//             <h4>Attempt Scores Chart</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={details.attemptsData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis domain={[
//                   0,
//                   Math.max(10, ...details.attemptsData.map(a => a.totalQuestions))
//                 ]} />
//                 <Tooltip />
//                 <Bar dataKey="score" fill=" #43e97b" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         <div className="modal-buttons">
//           <button className="back-btn" onClick={onClose}>← Back</button>
//           <button className="close-btn" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CandidateModal;
// import "./AdminResult.css";
// import "./CandidateModal.css";

// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
// } from "recharts";

// function CandidateModal({ candidateName, details, onClose }) {
//   const attemptsData = details?.attemptsData || [];

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h2>Details for {candidateName}</h2>

//         <p>
//           <strong>Total Attempts:</strong> {details.attempts}
//         </p>
//         <p>
//           <strong>Total Score:</strong> {details.totalScore}
//         </p>
//         <p>
//           <strong>Average Score:</strong>{" "}
//           {details.attempts > 0
//             ? (details.totalScore / details.attempts).toFixed(1)
//             : "0"}
//         </p>

//         <h4>All Attempts:</h4>
//         {attemptsData.length > 0 ? (
//           <ul>
//             {attemptsData.map((attempt, idx) => (
//               <li key={idx}>
//                 Quiz: <strong>{attempt.quizTitle}</strong> | Score:{" "}
//                 {attempt.score}/{attempt.totalQuestions} | Date: {attempt.date}
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No attempts found.</p>
//         )}

//         {attemptsData.length > 0 && (
//           <div className="chart-wrapper">
//             <h4>Attempt Scores Chart</h4>
//             <ResponsiveContainer width="100%" height={250}>
//               <BarChart data={attemptsData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis
//                   domain={[
//                     0,
//                     Math.max(10, ...attemptsData.map((a) => a.totalQuestions)),
//                   ]}
//                 />
//                 <Tooltip />
//                 <Bar dataKey="score" fill="#28ee6aff" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}

//         <div className="modal-buttons">
//           <button className="back-btn" onClick={onClose}>
//             ← Back
//           </button>
//           <button className="close-btn" onClick={onClose}>
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CandidateModal;
import { useEffect, useState } from "react";
import "./AdminResult.css";
import "./CandidateModal.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function CandidateModal({ candidateId, candidateName, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidateDetails() {
      try {
        setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/result`);// your API endpoint
        if (!res.ok) throw new Error("Failed to fetch candidate details");
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setDetails({ error: "Unable to load data" });
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchCandidateDetails();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>Loading candidate details...</p>
        </div>
      </div>
    );
  }

  if (!details || details.error) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <p>{details?.error || "No details found for this candidate."}</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const attemptsData = details.attemptsData || [];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Details for {candidateName}</h2>

        <p>
          <strong>Total Attempts:</strong> {details.attempts}
        </p>
        <p>
          <strong>Total Score:</strong> {details.totalScore}
        </p>
        <p>
          <strong>Average Score:</strong>{" "}
          {details.attempts > 0
            ? (details.totalScore / details.attempts).toFixed(1)
            : "0"}
        </p>

        <h4>All Attempts:</h4>
        {attemptsData.length > 0 ? (
          <ul>
            {attemptsData.map((attempt, idx) => (
              <li key={idx}>
                Quiz: <strong>{attempt.quizTitle}</strong> | Score:{" "}
                {attempt.score}/{attempt.totalQuestions} | Date: {attempt.date}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts found.</p>
        )}

        {attemptsData.length > 0 && (
          <div className="chart-wrapper">
            <h4>Attempt Scores Chart</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attemptsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  domain={[
                    0,
                    Math.max(10, ...attemptsData.map((a) => a.totalQuestions)),
                  ]}
                />
                <Tooltip />
                <Bar dataKey="score" fill="#28ee6aff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="modal-buttons">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateModal;
