
// import { useParams,useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CandidateQuizpage.css';

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();
//   const navigate=useNavigate();

//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [assignmentId, setAssignmentId] = useState();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
//         );

//         const candidateData = data?.data?.candidateData;
//         const quizData = data?.data?.quizData?.questions || [];

//         setAssignmentId(data?.data?._id);

//         if (!candidateData) {
//           throw new Error('Candidate data not found');
//         }

//         setCandidate(candidateData);
//         setQuizzes(quizData);
//       } catch (err) {
//         console.error('Error fetching candidate or quizzes:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId]);

//   const handleAnswerChange = (quizIndex, optionIndex) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [quizIndex]: optionIndex,
//     }));
//   };

//   const handleSubmitAll = async () => {
//     if (Object.keys(selectedAnswers).length !== quizzes.length) {
//       alert('Please answer all questions before submitting!');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
//         {
//           assignmentId,
//           candidateId: candidate?._id,
//           candidateName: candidate.name || '',
//           candidateEmail: candidate.email || '',
//           answers: quizzes.map((_, index) => selectedAnswers[index]), // all answers
//         }
//       );

//       alert(res.data.message || 'Quiz submitted successfully!');
//       setSubmitted(true);
//       navigate('/thank-you');
      
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('Error submitting quiz, please try again.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!candidate) return <div>Candidate not found</div>;

//   return (
//     <div className="dashboard-wrapper">
//       <div className="candidate-quiz-container">
//         <h1>Candidate Quiz Dashboard</h1>

//         <p><strong>Name:</strong> {candidate.name} {candidate.lname || ''}</p>
//         <p><strong>Email:</strong> {candidate.email}</p>
//         <p><strong>Tech:</strong> {candidate.tech}</p>
//         <p><strong>Difficulty:</strong> {candidate.difficulty}</p>

//         {quizzes.length > 0 ? (
//           quizzes.map((quizItem, quizIndex) => (
//             <div key={quizIndex} className="question-block">
//               <h3>Q{quizIndex + 1}: {quizItem.question}</h3>
//               <ul>
//                 {quizItem.options?.map((opt, optIdx) => (
//                   <li key={optIdx}>
//                     <label>
//                       <input
//                         type="radio"
//                         name={`quiz-${quizIndex}`}
//                         value={optIdx}
//                         disabled={submitted}
//                         checked={selectedAnswers[quizIndex] === optIdx}
//                         onChange={() => handleAnswerChange(quizIndex, optIdx)}
//                       />
//                       {opt}
//                     </label>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         ) : (
//           <p>No quiz assigned yet.</p>
//         )}

//         <button
//           className="submit-btn"
//           onClick={handleSubmitAll}
//           disabled={submitted}
//         >
//           {submitted ? 'Submitted' : 'Submit All Answers'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CandidateQuizPage;
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './CandidateQuizpage.css';

const CandidateQuizPage = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState();
  const [message, setMessage] = useState(null); // ✅ store success/error messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
        );

        const candidateData = data?.data?.candidateData;
        const quizData = data?.data?.quizData?.questions || [];

        setAssignmentId(data?.data?._id);

        if (!candidateData) {
          throw new Error('Candidate data not found');
        }

        setCandidate(candidateData);
        setQuizzes(quizData);
      } catch (err) {
        console.error('Error fetching candidate or quizzes:', err);
        setMessage({ type: 'error', text: 'Unable to load candidate or quizzes.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId]);

  const handleAnswerChange = (quizIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionIndex,
    }));
  };

  const handleSubmitAll = async () => {
    if (Object.keys(selectedAnswers).length !== quizzes.length) {
      setMessage({ type: 'error', text: 'Please answer all questions before submitting!' });
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
        {
          assignmentId,
          candidateId: candidate?._id,
          candidateName: candidate.name || '',
          candidateEmail: candidate.email || '',
          answers: quizzes.map((_, index) => selectedAnswers[index]), // all answers
        }
      );

      setSubmitted(true);
      setMessage({ type: 'success', text: res.data.message || ' Quiz submitted successfully!' });

      // Optionally redirect after few seconds
      setTimeout(() => navigate('/thank-you'), 2000);

    } catch (err) {
      console.error('Submission error:', err);

      if (err.response?.status === 400 && err.response?.data?.message?.includes("already submitted")) {
        //  If quiz already submitted
        setMessage({ type: 'info', text: 'ℹ You have already submitted this quiz.' });
        setSubmitted(true);
      } else {
        setMessage({ type: 'error', text: ' Error submitting quiz, please try again.' });
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!candidate) return <div>Candidate not found</div>;

  return (
    
      <div className="candidate-quiz-container">
        <h1>Candidate Quiz Dashboard</h1>

        <p><strong>Name:</strong> {candidate.name} {candidate.lname || ''}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Tech:</strong> {candidate.tech}</p>
        <p><strong>Difficulty:</strong> {candidate.difficulty}</p>

        {/*  Show messages */}
        {message && (
          <div className={`alert ${message.type}`}>
            {message.text}
          </div>
        )}

        {quizzes.length > 0 ? (
          quizzes.map((quizItem, quizIndex) => (
            <div key={quizIndex} className="question-block">
              <h3>Q{quizIndex + 1}: {quizItem.question}</h3>
              <ul>
                {quizItem.options?.map((opt, optIdx) => (
                  <li key={optIdx}>
                    <label>
                      <input
                        type="radio"
                        name={`quiz-${quizIndex}`}
                        value={optIdx}
                        disabled={submitted}
                        checked={selectedAnswers[quizIndex] === optIdx}
                        onChange={() => handleAnswerChange(quizIndex, optIdx)}
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No quiz assigned yet.</p>
        )}

        <button
          className="submit-btn"
          onClick={handleSubmitAll}
          disabled={submitted}
        >
          {submitted ? 'Submitted' : 'Submit All Answers'}
        </button>
      </div>
    
  );
};

export default CandidateQuizPage;
