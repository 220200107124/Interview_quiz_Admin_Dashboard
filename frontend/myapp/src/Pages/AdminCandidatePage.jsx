import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminCandidatePage.css';
import AdminSideBar from '../Components/AdminSideBar';
import Footer from '../Components/Footer';

// Icons...
// 
// const SearchIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <circle cx="11" cy="11" r="8"></circle>
//     <path d="m21 21-4.35-4.35"></path>
//   </svg>
// );
const SendIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
);


const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// const SaveIcon = () => (
//   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
//     <polyline points="17,21 17,13 7,13 7,21"></polyline>
//     <polyline points="7,3 7,8 15,8"></polyline>
//   </svg>
// );

// const CloseIcon = () => (
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <line x1="18" y1="6" x2="6" y2="18"></line>
//     <line x1="6" y1="6" x2="18" y2="18"></line>
//   </svg>
// );

// const FilterIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//     <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
//   </svg>
// );


const AdminCandidatePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ 
    name: '', 
    lname: '', 
    email: '', 
    tech: 'React',
    difficulty: 'Easy'         //  Added default difficulty
  });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const techOptions = ['React', 'Node', 'JavaScript', 'Next js', 'Graphic Design'];
  const difficultyOptions = [ 'Easy','Beginner', 'Intermediate', 'Advanced'];


  const [quizzes, setQuizzes] = useState([]);
  useEffect(() => {
  fetchCandidates();
  fetchQuizzes();
}, []);
const fetchQuizzes = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/quizzes');
    setQuizzes(res.data);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
  }
};



  const fetchCandidates = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    }
  };

  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.lname || !newCandidate.email) {
      return alert('Please fill all fields');
    }

    //  Check uniqueness: no same name+lname combination
// const nameExists = candidates.some(
//   c =>
    
//     (c.lname?.toLowerCase() || '') === newCandidate.lname.toLowerCase()
// );
// if (nameExists) {
//   return alert('Candidate with the same last name already exists.');
// }
const isTechDifficultyUnique = (tech, difficulty) => {
  return !candidates.some(candidate =>
    String(candidate.tech).toLowerCase() === tech.toLowerCase() &&
    String(candidate.difficulty).toLowerCase() === difficulty.toLowerCase()
  );
};
if (!isTechDifficultyUnique(newCandidate.tech, newCandidate.difficulty)) {
  return alert('A candidate with this tech and difficulty level already exists.');
}

   try {
      const res = await axios.post('http://localhost:8080/api/candidates', newCandidate);
      setCandidates(prev => [...prev, res.data]);
      setNewCandidate({ name: '', lname: '', email: '', tech: 'React', difficulty: '' });  // 🔥 reset difficulty too
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  const handleEditCandidate = (candidate) => setEditingCandidate({ ...candidate });

  const handleUpdateCandidate = async () => {
    try {
      const res = await axios.put(`http://localhost:8080/api/candidates/${editingCandidate._id}`, editingCandidate);
      setCandidates(candidates.map(c => c._id === res.data._id ? res.data : c));
      setEditingCandidate(null);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`http://localhost:8080/api/candidates/${id}`);
        setCandidates(candidates.filter(c => c._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };
  // <-----------------handle the sent quiz is exist -------->

const handleSendTest = (candidate) => {
  const matchingQuiz = quizzes.find(
    quiz =>
      String(quiz.category).toLowerCase() === String(candidate.tech).toLowerCase() &&
      String(quiz.difficulty).toLowerCase() === String(candidate.difficulty).toLowerCase()
  );

  if (!matchingQuiz) {
    return alert(`No quiz found for ${candidate.tech} at difficulty ${candidate.difficulty}`);
  }

  // else, proceed
  alert(`Test sent to ${candidate.email} for ${candidate.tech} at difficulty ${candidate.difficulty}`);
};



  return (
    <div>
      <div className="candidate-page">
         <AdminSideBar /> {/*admin side bar components */}
        <div className="container">
          <h1 className="main-title">Candidate Management</h1>

          <div className="add-candidate-section">
            <h2>Add New Candidate</h2>
            <div className="form-grid">
              <input
                type="text"
                placeholder="First Name"
                value={newCandidate.name}
                onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newCandidate.lname}
                onChange={e => setNewCandidate({ ...newCandidate, lname: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newCandidate.email}
                onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
              />
              <select
                value={newCandidate.tech}
                onChange={e => setNewCandidate({ ...newCandidate, tech: e.target.value })}
              >
                {techOptions.map(tech => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>



              {/* Add difficulty select */}
              <select
                value={newCandidate.difficulty}
                onChange={e => setNewCandidate({ ...newCandidate, difficulty: e.target.value })}
              >
                {difficultyOptions.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>

              <button onClick={handleAddCandidate} className="add-btn">
                <PlusIcon /> Add
              </button>
            </div>
          </div>

            {/* canditate list table */}
          <div className="candidate-list">
            <h2>Candidate List</h2>
            {candidates.length === 0 ? (
              <p>No candidates added yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Tech</th>
                    <th>Difficulty</th> 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate._id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.lname}</td>
                      <td>{candidate.email}</td>
                      <td>{candidate.tech}</td>
                      <td>{candidate.difficulty||'Easy'}</td>
                      <td>
                        <button onClick={() => handleEditCandidate(candidate)}><EditIcon /></button>
                        <button onClick={() => handleDeleteCandidate(candidate._id)}><TrashIcon /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* qdit quiz candidate details in api */}
          {editingCandidate && (
            <div className="edit-modal">
              <div className="modal-content">
                <h3>Edit Candidate</h3>
                <input
                  type="text"
                  value={editingCandidate.name}
                  onChange={e => setEditingCandidate({ ...editingCandidate, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingCandidate.lname}
                  onChange={e => setEditingCandidate({ ...editingCandidate, lname: e.target.value })}
                />
                <input
                  type="email"
                  value={editingCandidate.email}
                  onChange={e => setEditingCandidate({ ...editingCandidate, email: e.target.value })}
                />
                <select
                  value={editingCandidate.tech}
                  onChange={e => setEditingCandidate({ ...editingCandidate, tech: e.target.value })}
                >
                  {techOptions.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>


                {/*  Edit difficulty */}
                <select
                  value={editingCandidate.difficulty}
                  onChange={e => setEditingCandidate({ ...editingCandidate, difficulty: e.target.value })}
                >
                  {difficultyOptions.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>

                <div className="modal-actions">
                  <button onClick={() => handleSendTest(editingCandidate)}><SendIcon /> Send Test</button>
                  <button onClick={handleUpdateCandidate}>Save</button>
                  <button onClick={() => setEditingCandidate(null)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AdminCandidatePage;
