
import "./AdminResult.css";
import "./CandidateModal.css";
import { useEffect, useState } from "react";

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
  const attemptsData = details?.attemptsData || [];

  useEffect(() => {
   async function fetchCandidateDetails() {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/result/:resultId
      `
    );
    console.log("res" +res);
    if (!res.ok) throw new Error("Failed to fetch candidate details");
    const data = await res.json();
    setDetails(data);
  } catch (err) {
    console.error("Error fetching candidate data", err);
    setDetails({
      error: "unable to load data",
      attempts: 0,
      totalScore: 0,
      attemptsData: [],
    });
  }
}

    if (candidateId) {
      fetchCandidateDetails();
    }
  }, [candidateId]);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Details for {candidateName}</h2>

        <p>
          <strong>Total Attempts:</strong> {details?.attempts ?? 0}
        </p>
        <p>
          <strong>Total Score:</strong> {details?.totalScore ?? 0}
        </p>
        <p>
          <strong>Average Score:</strong>{" "}
          {details?.attempts > 0
            ? (details.totalScore / details.attempts).toFixed(1)
            : "0"}
        </p>

        <h4>All Attempts:</h4>
        {attemptsData.length > 0 ? (
          <ul>
            {attemptsData.map((attempt, idx) => (
              <li key={idx}>
                Quiz: <strong>{attempt.quizTitle}</strong> | Score:{" "}
                {attempt.score}/{attempt.totalQuestions} | Date:{" "}
                {new Date(attempt.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts found.</p>
        )}

        {attemptsData.length > -1 && (
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


