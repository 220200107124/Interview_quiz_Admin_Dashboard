// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './CandidateQuizpage.css';


// function CandidateQuizpage() {
//   const navigate = useNavigate();

//   const quiz = {
//     _id: "64",  // use actual ID if from backend
//     title: "React Fundamentals Quiz",
//     technology: "React",
//     description: "This quiz covers the basics of React components, props, and state.",
//     instructions: "Answer all questions carefully. Each question has one correct answer.",
//     questions: [
//       {
//         text: "What is JSX?",
//         options: [
//           "A JavaScript library",
//           "A syntax extension for JavaScript",
//           "A CSS framework",
//           "A database"
//         ],
//         correct: "A syntax extension for JavaScript"
//       },
//       {
//         text: "Which hook is used to manage state in functional components?",
//         options: [
//           "useEffect",
//           "useState",
//           "useContext",
//           "useReducer"
//         ],
//         correct: "useState"
//       }
//     ]
//   };

//   const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(''));

//   const handleSelect = (qIdx, option) => {
//     const updated = [...answers];
//     updated[qIdx] = option;
//     setAnswers(updated);
//   };

//   const handleSubmit = async () => {
//     let score = 0;
//     quiz.questions.forEach((q, idx) => {
//       if (answers[idx] === q.correct) score++;
//     });

//     // save score to backend
//     try {
//       await fetch('/api/results', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           quizId: quiz._id,
//           candidateName: "John Doe", // replace with real user if you have auth
//           score
//         })
//       });
//       navigate('/thank-you');
//     } catch (error) {
//       console.error(error);
//       alert('Failed to submit score');
//     }
//   };

//   return (
    
//     <div className="dashboard-container">
//          <button 
//                 onClick={() => navigate('/admin')} 
//                 className="back-btn"
//               >
//                 ← Back to Dashboard
//               </button>
      
//     <div className="candidate-quiz-container">
//       <h1>{quiz.title}</h1>
//       <p><strong>Technology:</strong> {quiz.technology}</p>
//       <p>{quiz.description}</p>
//       <h3>Instructions</h3>
//       <p>{quiz.instructions}</p>
//       <h3>Questions</h3>
//       {quiz.questions.map((q, idx) => (
//         <div key={idx} className="question-block">
//           <p>{idx+1}. {q.text}</p>
//           <ul>
//             {q.options.map((opt, oIdx) => (
//               <li key={oIdx}>
//                 <label>
//                   <input required
//                     type="radio"
//                     name={`question-${idx}`}
//                     value={opt}
//                     checked={answers[idx] === opt}
//                     onChange={() => handleSelect(idx, opt)}
//                   />
//                   {opt}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//       <button className="submit-btn" onClick={handleSubmit}>Submit</button>
//     </div>
//     </div>
    
//   );
// }

// export default CandidateQuizpage;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CandidateQuizpage.css';

function CandidateQuizpage() {
  const { candidateId } = useParams();              // Get candidateId from URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);           // quiz data
  const [answers, setAnswers] = useState([]);       // user's answers
  const [loading, setLoading] = useState(true);     // loading flag
  const [error, setError] = useState(null);         // error message

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch candidate first to get quizId
        const candidateRes = await fetch(`http://localhost:8080/api/candidates/${candidateId}`);
        const candidateData = await candidateRes.json();

        if (!candidateData.quizId) {
          setError('No quiz assigned to you.');
          setLoading(false);
          return;
        }

        // fetch quiz by quizId
        const quizRes = await fetch(`http://localhost:8080/api/quizzes/${candidateData.quizId}`);
        const quizData = await quizRes.json();

        setQuiz(quizData);
        setAnswers(Array(quizData.questions.length).fill(''));  // init empty answers
        setLoading(false);
      } catch (err) {
        console.error(' Fetch error:', err);
        setError('Error loading quiz.');
        setLoading(false);
      }
    };
    fetchData();
  }, [candidateId]);

  const handleSelect = (qIdx, option) => {
    const updated = [...answers];
    updated[qIdx] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) score++;
    });

    try {
      await fetch('http://localhost:8080/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz._id,
          candidateId,
          score
        })
      });
      navigate('/thank-you');
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit score.');
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!quiz) return <p>No quiz data found.</p>;

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate('/')} className="back-btn">← Back</button>
      <div className="candidate-quiz-container">
        <h1>{quiz.title}</h1>
        <p><strong>Technology:</strong> {quiz.category || quiz.technology}</p>
        <p>{quiz.description}</p>
        <h3>Instructions</h3>
        <p>{quiz.instructions || 'Answer all questions carefully. Each question has one correct answer.'}</p>
        <h3>Questions</h3>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="question-block">
            <p>{idx + 1}. {q.question || q.text}</p>
            <ul>
              {q.options.map((opt, oIdx) => (
                <li key={oIdx}>
                  <label>
                    <input
                      type="radio"
                      name={`question-${idx}`}
                      value={opt}
                      checked={answers[idx] === opt}
                      onChange={() => handleSelect(idx, opt)}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default CandidateQuizpage;

