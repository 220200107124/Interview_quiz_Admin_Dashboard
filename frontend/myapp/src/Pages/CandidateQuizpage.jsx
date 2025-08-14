//  import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CandidateQuizpage.css';

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();
//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const[candidateName,setCandidateName]=useState('');
//   const[candidateEmail,setCandidateEmail]=useState('');
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submittedQuizzes, setSubmittedQuizzes] = useState({});
//    // track actual submissions

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch candidate info
//         const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/candidates/${candidateId}`);
//         setCandidate(candidateRes.data);

//         // Fetch assigned quizzes
//         const quizRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz-by-candidate/${candidateId}`);
//         let quizData = quizRes.data;
//         if (quizData && !Array.isArray(quizData)) quizData = [quizData];
//         setQuizzes(quizData);

//         // Optionally: fetch actual submitted quizzes from backend
//         // Example: const submittedRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/submissions/${candidateId}`);
//         // submittedRes.data should be array of assignmentIds
//         // Then mark them as submitted:
//         // const submittedMap = {};
//         // submittedRes.data.forEach(sub => { submittedMap[sub.assignmentId] = true });
//         // setSubmittedQuizzes(submittedMap);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching candidate or quizzes:', err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId]);

//   const handleAnswerChange = (quizIndex, questionIndex, value) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [quizIndex]: { ...prev[quizIndex], [questionIndex]: value }
//     }));
//   };

//   const handleSubmit = async (quizIndex) => {
//     const quizItem = quizzes[quizIndex];
//     const assignmentId = quizItem._id || quizItem.quiz?._id;
//     const answersArray = selectedAnswers[quizIndex] ? Object.values(selectedAnswers[quizIndex]) : [];

//     if (answersArray.length === 0) {
//       alert('Please answer at least one question before submitting!');
//       return;
//     }

//     try {




   
//     if (!candidateName || !candidateEmail) {
//       const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/candidates/${candidateId}`),
//       candidatesData = candidateRes.data;
//     }

//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-quiz`, {
//         assignmentId,
//         candidateId,
//         answers: answersArray,
//          candidatesName: candidateName || candidateData?.name || candidateData?.fullName,
//         candidateEmail: candidateEmail || candidateData?.email,
     

//       });

//       alert(res.data.message || 'Quiz submitted successfully!');

//       // Mark quiz as submitted locally
//       setSubmittedQuizzes(prev => ({ ...prev, [quizIndex]: true }));
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
//             const questions = quizItem.questions || (quizItem.quiz && quizItem.quiz.questions) || [];
//             const quizTitle = quizItem.quiz?.title || quizItem.title || 'Quiz';
//             const isSubmitted = submittedQuizzes[quizIndex]; // true only if actually submitted

//             return (
//               <div key={quizIndex} className="question-block">
//                 <h3>{quizTitle}</h3>

//                 {questions.length > 0 ? (
//                   <ul>
//                     {questions.map((q, questionIndex) => (
//                       <li key={questionIndex}>
//                         {q.question && <div><strong>Q{questionIndex + 1}:</strong> {q.question}</div>}
//                         {q.options && q.options.map((opt, optIdx) => (
//                           <label key={optIdx}>
//                             <input
//                               type="radio"
//                               name={`quiz-${quizIndex}-question-${questionIndex}`}
//                               value={opt}
//                               disabled={isSubmitted}
//                               checked={selectedAnswers[quizIndex]?.[questionIndex] === opt}
//                               onChange={(e) => handleAnswerChange(quizIndex, questionIndex, e.target.value)}
//                             />
//                             {opt}
//                           </label>
//                         ))}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : <div>No questions found for this quiz.</div>}

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


// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CandidateQuizpage.css';

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();
//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [candidateName, setCandidateName] = useState('');
//   const [candidateEmail, setCandidateEmail] = useState('');
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submittedQuizzes, setSubmittedQuizzes] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch candidate info
//         const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/candidates/${candidateId}`);
//         setCandidate(candidateRes.data);
        
//         // Set candidate name and email from the fetched data
//         setCandidateName(candidateRes.data.name || candidateRes.data.fullName || '');
//         setCandidateEmail(candidateRes.data.email || '');

//         // Fetch assigned quizzes - try the quiz-by-candidate endpoint first
//         const quizRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/quiz-by-candidate/${candidateId}`);
//         console.log("=== QUIZ RESPONSE DEBUG ===");
//         console.log("Quiz response data:", quizRes.data);
//         let quizData = quizRes.data;
//         if (quizData && !Array.isArray(quizData)) quizData = [quizData];
//         setQuizzes(quizData);

//         // Optionally: fetch actual submitted quizzes from backend
//         // Example: const submittedRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/submissions/${candidateId}`);
//         // submittedRes.data should be array of assignmentIds
//         // Then mark them as submitted:
//         // const submittedMap = {};
//         // submittedRes.data.forEach(sub => { submittedMap[sub.assignmentId] = true });
//         // setSubmittedQuizzes(submittedMap);

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching candidate or quizzes:', err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId]);

//   const handleAnswerChange = (quizIndex, questionIndex, value) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [quizIndex]: { ...prev[quizIndex], [questionIndex]: value }
//     }));
//   };

//   const handleSubmit = async (quizIndex) => {
//     const quizItem = quizzes[quizIndex];
//     const assignmentId = quizItem._id || quizItem.quiz?._id;
//     const answersArray = selectedAnswers[quizIndex] ? Object.values(selectedAnswers[quizIndex]) : [];

//     if (answersArray.length === 0) {
//       alert('Please answer at least one question before submitting!');
//       return;
//     }

//     try {
//       // Fetch candidate details if not already available (fallback)
//       let candidateData = null;
//       if (!candidateName || !candidateEmail) {
//         const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/candidates/${candidateId}`);
//         candidateData = candidateRes.data;
//       }

//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-quiz`, {
//         assignmentId,
//         candidateId,
//         candidateName: candidateName || candidateData?.name || candidateData?.fullName,
//         candidateEmail: candidateEmail || candidateData?.email,
//         answers: answersArray
//       });

//       alert(res.data.message || 'Quiz submitted successfully!');

//       // Mark quiz as submitted locally
//       setSubmittedQuizzes(prev => ({ ...prev, [quizIndex]: true }));
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
//             const questions = quizItem.questions || (quizItem.quiz && quizItem.quiz.questions) || [];
//             const quizTitle = quizItem.quiz?.title || quizItem.title || 'Quiz';
//             const isSubmitted = submittedQuizzes[quizIndex]; // true only if actually submitted

//             return (
//               <div key={quizIndex} className="question-block">
//                 <h3>{quizTitle}</h3>

//                 {questions.length > 0 ? (
//                   <ul>
//                     {questions.map((q, questionIndex) => (
//                       <li key={questionIndex}>
//                         {q.question && <div><strong>Q{questionIndex + 1}:</strong> {q.question}</div>}
//                         {q.options && q.options.map((opt, optIdx) => (
//                           <label key={optIdx}>
//                             <input
//                               type="radio"
//                               name={`quiz-${quizIndex}-question-${questionIndex}`}
//                               value={opt}
//                               disabled={isSubmitted}
//                               checked={selectedAnswers[quizIndex]?.[questionIndex] === opt}
//                               onChange={(e) => handleAnswerChange(quizIndex, questionIndex, e.target.value)}
//                             />
//                             {opt}
//                           </label>
//                         ))}
//                       </li>
//                     ))}
//                   </ul>
//                 ) : <div>No questions found for this quiz.</div>}

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
  const [submittedQuizzes, setSubmittedQuizzes] = useState({});
const  [assignmentId,setAssignmentId] = useState()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`
        );

        const candidateData = data?.data?.candidateData;
        const quizData = data?.data?.quizData?.questions || [];
      
        setAssignmentId(data?.data?._id)

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

  console.log("candidate",candidate)
  const handleSubmit = async (quizIndex) => {
    const quizItem = quizzes[quizIndex];

    if (selectedAnswers[quizIndex] === undefined) {
      alert('Please select an answer before submitting!');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/submit-quiz`,
        {
          assignmentId,
          candidateId:candidate?._id,
          candidateName: candidate.name || '',
          candidateEmail: candidate.email || '',

          answers: [selectedAnswers[quizIndex]], // single answer for this question
        }
      );

      alert(res.data.message || 'Quiz submitted successfully!');
      setSubmittedQuizzes((prev) => ({ ...prev, [quizIndex]: true }));
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
          quizzes.map((quizItem, quizIndex) => {
            const isSubmitted = submittedQuizzes[quizIndex];

            return (
              <div key={quizIndex} className="question-block">
                <h3>Q{quizIndex + 1}: {quizItem.question}</h3>

                {quizItem.options?.length > 0 ? (
                  <ul>
                    {quizItem.options.map((opt, optIdx) => (
                      <li key={optIdx}>
                        <label>
                          <input
                            type="radio"
                            name={`quiz-${quizIndex}`}
                            value={optIdx}
                            disabled={isSubmitted}
                            checked={selectedAnswers[quizIndex] === optIdx}
                            onChange={() => handleAnswerChange(quizIndex, optIdx)}
                          />
                          {opt}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>No options found for this question.</div>
                )}

                {isSubmitted && <p style={{ color: 'green' }}>You have submitted this quiz.</p>}

                <button
                  className="submit-btn"
                  onClick={() => handleSubmit(quizIndex)}
                  disabled={isSubmitted}
                >
                  {isSubmitted ? 'Submitted' : 'Submit Quiz'}
                </button>
              </div>
            );
          })
        ) : (
          <p>No quiz assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateQuizPage;


// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import './CandidateQuizpage.css';

// const CandidateQuizPage = () => {
//   const { candidateId } = useParams();
//   const [candidate, setCandidate] = useState(null);
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [candidateName, setCandidateName] = useState('');
//   const [candidateEmail, setCandidateEmail] = useState('');
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submittedQuizzes, setSubmittedQuizzes] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch candidate info
//         const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/assignment/getByToken/${candidateId}`);

// console.log("candidateRes.data",candidateRes.data.data.quizData.questions
// )

//         setCandidate(candidateRes.data?.data?.candidateData);
        
//         // Set candidate name and email from the fetched data
//         setCandidateName(candidateRes.data?.data?.candidateData?.name || candidateRes.data?.data?.candidateData?.fullName || '');
//         setCandidateEmail(candidateRes.data?.data?.candidateData?.email || '');
// setQuizzes(candidateRes.data.data.quizData.questions
// );

       

//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching candidate or quizzes:', err);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [candidateId]);

//   const handleAnswerChange = (quizIndex, questionIndex, value) => {
//     setSelectedAnswers(prev => ({
//       ...prev,
//       [quizIndex]: { ...prev[quizIndex], [questionIndex]: value }
//     }));
//   };

//   const handleSubmit = async (quizIndex) => {
//     const quizItem = quizzes[quizIndex];
//     console.log(quizItem)
//     const assignmentId = quizItem._id || quizItem.quiz?._id;
//     const answersArray = selectedAnswers[quizIndex] ? Object.values(selectedAnswers[quizIndex]) : [];

//     if (answersArray.length === 0) {
//       alert('Please answer at least one question before submitting!');
//       return;
//     }
    

//     try {
//       // Fetch candidate details if not already available (fallback)
//       let candidateData = null;
//       if (!candidateName || !candidateEmail) {
//         const candidateRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/candidates/${candidateId}`);
//         candidateData = candidateRes.data;
//       }
//        console.log(assignmentId);
//       const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/submit-quiz`, {
//         assignmentId,
//         candidateId,
//         candidateName: candidateName || candidateData?.name ,
//         candidateEmail: candidateEmail || candidateData?.email,
//         answers: answersArray
//       });
      

//       alert(res.data.message || 'Quiz submitted successfully!');

//       // Mark quiz as submitted locally
//       setSubmittedQuizzes(prev => ({ ...prev, [quizIndex]: true }));
//     } catch (err) {
//       console.error('Submission error:', err);
//       alert('Error submitting quiz, please try again.');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!candidate) return <div>Candidate not found</div>;


//   console.log('quizzesquizzesquizzes',quizzes)
//   return (
//     <div className="dashboard-wrapper">
//       <div className="candidate-quiz-container">
//         <h1>Candidate Quiz Dashboard</h1>

//         <p><strong>Name:</strong> {candidate.name} {candidate.lname || ''}</p>
//         <p><strong>Email:</strong> {candidate.email}</p>
//         <p><strong>Tech:</strong> {candidate.tech}</p>
//         <p><strong>Difficulty:</strong> {candidate.difficulty}</p>


// {quizzes.length > 0 ? (
//   quizzes.map((quizItem, quizIndex) => {
//     const isSubmitted = submittedQuizzes[quizIndex];
    
//     return (
//       <div key={quizIndex} className="question-block">
//         {/* Question */}
//         <h3>Q{quizIndex + 1}: {quizItem.question}</h3>

//         {/* Options */}
//         {quizItem.options && quizItem.options.length > 0 ? (
//           <ul>
//             {quizItem.options.map((opt, optIdx) => (
//               <li key={optIdx}>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`quiz-${quizIndex}`} // all options in one question share name
//                     value={optIdx}
//                     disabled={isSubmitted}
//                     checked={selectedAnswers[quizIndex] === optIdx}
//                     onChange={(e) => handleAnswerChange(quizIndex, optIdx)}
//                   />
//                   {opt}
//                 </label>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div>No options found for this question.</div>
//         )}

//         {/* Submission Status */}
//         {isSubmitted && <p style={{ color: 'green' }}>You have submitted this quiz.</p>}

//         {/* Submit Button */}
//         <button
//           className="submit-btn"
//           onClick={() => handleSubmit(quizIndex)}
//           disabled={isSubmitted}
//         >
//           {isSubmitted ? 'Submitted' : 'Submit Quiz'}
//         </button>
//       </div>
//     );
//   })
// ) : (
//   <p>No quiz assigned yet.</p>
// )}

      
//       </div>
//     </div>
//   );
// };

// export default CandidateQuizPage;