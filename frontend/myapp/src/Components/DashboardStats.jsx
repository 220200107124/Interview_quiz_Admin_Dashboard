import React, { useState, useEffect } from "react";
import './DashboardStats.css';


const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalCandidates: 0,
    activeQuizzes: 0,
  });

  // Simulate fetching data from API
  useEffect(() => {
    // Replace this with actual API call
    const fetchStats = async () => {
      const data = {
        totalQuizzes: 12,
        totalCandidates: 50,
        activeQuizzes: 3,
      };
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="stat-box">
          <h3>Total Quizzes</h3>
          <p>{stats.totalQuizzes}</p>
        </div>
        <div className="stat-box">
          <h3>Total Candidates</h3>
          <p>{stats.totalCandidates}</p>
        </div>
        <div className="stat-box">
          <h3>Active Quizzes</h3>
          <p>{stats.activeQuizzes}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
