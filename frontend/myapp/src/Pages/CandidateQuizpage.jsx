
// // export default CandidateQuizPage;
// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CandidateQuizpage.css';

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();

//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submittedQuizzes, setSubmittedQuizzes] = useState({});
// const  [assignmentId,setAssignmentId] = useState()
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
//         );

//         const candidateData = data?.data?.candidateData;
//         const quizData = data?.data?.quizData?.questions || [];
      
//         setAssignmentId(data?.data?._id)

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

//   console.log("candidate",candidate)
//   const handleSubmit = async (quizIndex) => {
//     // const quizItem = quizzes[quizIndex];

//     if (selectedAnswers[quizIndex] === undefined) {
//       alert('Please select an answer before submitting!');
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
//         {
//           assignmentId,
//           candidateId:candidate?._id,
//           candidateName: candidate.name || '',
//           candidateEmail: candidate.email || '',
         


      


//           answers: [selectedAnswers[quizIndex]], // single answer for this question
//         }
//       );

//       alert(res.data.message || 'Quiz submitted successfully!');
//       setSubmittedQuizzes((prev) => ({ ...prev, [quizIndex]: true }));
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
//           quizzes.map((quizItem, quizIndex) => {
//             const isSubmitted = submittedQuizzes[quizIndex];

//             return (
//               <div key={quizIndex} className="question-block">
//                 <h3>Q{quizIndex + 1}: {quizItem.question}</h3>

//                 {quizItem.options?.length > 0 ? (
//                   <ul>
//                     {quizItem.options.map((opt, optIdx) => (
//                       <li key={optIdx}>
//                         <label>
//                           <input
//                             type="radio"
//                             name={`quiz-${quizIndex}`}
//                             value={optIdx}
//                             disabled={isSubmitted}
//                             checked={selectedAnswers[quizIndex] === optIdx}
//                             onChange={() => handleAnswerChange(quizIndex, optIdx)}
//                           />
//                           {opt}
//                         </label>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <div>No options found for this question.</div>
//                 )}

//                 {isSubmitted && <p style={{ color: 'green' }}>You have submitted this quiz.</p>}

//                 <button
//                   className="submit-btn"
//                   onClick={() => handleSubmit(quizIndex)}
//                   disabled={isSubmitted}
//                 >
//                   {isSubmitted ? 'Submitted' : 'Submit Quiz'}
//                 </button>
//               </div>
//             );
//           })
//         ) : (
//           <p>No quiz assigned yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CandidateQuizPage;
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './CandidateQuizpage.css';

const CandidateQuizPage = () => {
  const { candidateId } = useParams();

  const [candidate, setCandidate] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [assignmentId, setAssignmentId] = useState();

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
      alert('Please answer all questions before submitting!');
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

      alert(res.data.message || 'Quiz submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting quiz, please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!candidate) return <div>Candidate not found</div>;

  return (
    <div className="dashboard-wrapper">
      <div className="candidate-quiz-container">
        <h1>Candidate Quiz Dashboard</h1>

        <p><strong>Name:</strong> {candidate.name} {candidate.lname || ''}</p>
        <p><strong>Email:</strong> {candidate.email}</p>
        <p><strong>Tech:</strong> {candidate.tech}</p>
        <p><strong>Difficulty:</strong> {candidate.difficulty}</p>

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
    </div>
  );
};

export default CandidateQuizPage;
