import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminCandidatePage.css';
import AdminSideBar from '../Components/AdminSideBar';
import Footer from '../Components/Footer';

// Icons (SVGs)
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

const AdminCandidatePage = () => {
  // ✅ State management
  const [candidates, setCandidates] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);   // Global loader (fetch/add/edit/delete)
  const [sending, setSending] = useState(false);   // Loader when sending quiz
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [newCandidate, setNewCandidate] = useState({
    name: '', lname: '', email: '', tech: 'React', difficulty: 'Easy'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;
  const totalPages = Math.ceil(candidates.length / pageSize);
  const paginatedCandidates = candidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const techOptions = ['General', 'React', 'Node', 'JavaScript', 'Next js', 'Graphic Design'];
  const difficultyOptions = ['Easy', 'Beginner', 'Intermediate', 'Advanced'];

  //  Fetch data on mount
  useEffect(() => {
    fetchCandidates();
    fetchQuizzes();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/candidates');
      setCandidates(res.data);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/quizzes');
      setQuizzes(res.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  // ➕ Add new candidate
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.lname || !newCandidate.email) {
      return alert('Please fill all fields');
    }

    // Unique check: tech + difficulty combination
    const exists = candidates.some(c =>
      c.tech.toLowerCase() === newCandidate.tech.toLowerCase() &&
      c.difficulty.toLowerCase() === newCandidate.difficulty.toLowerCase()
    );
    if (exists) return alert('Candidate with this tech and difficulty already exists.');

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/candidates', newCandidate);
      setCandidates(prev => [...prev, res.data]);
      setNewCandidate({ name: '', lname: '', email: '', tech: 'React', difficulty: 'Easy' });
    } catch (err) {
      console.error('Add error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✏ Edit / update candidate
  const handleEditCandidate = (candidate) => setEditingCandidate({ ...candidate });

  const handleUpdateCandidate = async () => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8080/api/candidates/${editingCandidate._id}`, editingCandidate);
      setCandidates(candidates.map(c => c._id === res.data._id ? res.data : c));
      setEditingCandidate(null);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 Delete candidate
  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/candidates/${id}`);
        setCandidates(candidates.filter(c => c._id !== id));
      } catch (err) {
        console.error('Delete error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  //  Send quiz to candidate
  const handleSendTest = async (candidate) => {
    const matchingQuiz = quizzes.find(q =>
      q.category.toLowerCase() === candidate.tech.toLowerCase() &&
      q.difficulty.toLowerCase() === candidate.difficulty.toLowerCase()
    );
    if (!matchingQuiz) return alert(`No quiz found for ${candidate.tech} - ${candidate.difficulty}`);

    setSending(true);
    try {
      const res = await axios.post(`http://localhost:8080/api/assign/${candidate._id}`, {
        quizId: matchingQuiz._id, title: matchingQuiz.title
      });
      alert(res.data.message);
      setEditingCandidate(null);
    } catch (err) {
      console.error(err);
      alert('Failed to assign quiz');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="candidate-page">
        <AdminSideBar />
        <div className="container">
          <h1 className="main-title">Candidate Management</h1>

          {loading && <div className="loader">Loading...</div>}

          {/* Add Candidate Form */}
          <div className="add-candidate-section">
            <h2>Add New Candidate</h2>
            <div className="form-grid">
              <input type="text" placeholder="First Name"
                value={newCandidate.name}
                onChange={e => setNewCandidate({ ...newCandidate, name: e.target.value })}
              />
              <input type="text" placeholder="Last Name"
                value={newCandidate.lname}
                onChange={e => setNewCandidate({ ...newCandidate, lname: e.target.value })}
              />
              <input type="email" placeholder="Email"
                value={newCandidate.email}
                onChange={e => setNewCandidate({ ...newCandidate, email: e.target.value })}
              />
              <select value={newCandidate.tech}
                onChange={e => setNewCandidate({ ...newCandidate, tech: e.target.value })}
              >
                {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={newCandidate.difficulty}
                onChange={e => setNewCandidate({ ...newCandidate, difficulty: e.target.value })}
              >
                {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <button onClick={handleAddCandidate}><PlusIcon /> Add</button>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="candidate-list">
            <h2>Candidate List</h2>
            {candidates.length === 0 ? (
              <p>No candidates added yet.</p>
            ) : (
              <>
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
                    {paginatedCandidates.map(candidate => (
                      <tr key={candidate._id}>
                        <td>{candidate.name}</td>
                        <td>{candidate.lname}</td>
                        <td>{candidate.email}</td>
                        <td>{candidate.tech}</td>
                        <td>{candidate.difficulty}</td>
                        <td>
                          <button onClick={() => handleEditCandidate(candidate)}><EditIcon /></button>
                          <button onClick={() => handleDeleteCandidate(candidate._id)}><TrashIcon /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination">
                  <button disabled={currentPage === 1}
                   className='pagination-btn' onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={pageNum === currentPage ? 'active' : ''}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button className='pagination-btn' disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                </div>
              </>
            )}
          </div>

          {/* Edit Modal */}
          {editingCandidate && (
            <div className="edit-modal">
              <div className="modal-content">
                <h3>Edit Candidate</h3>
                <input type="text" value={editingCandidate.name}
                  onChange={e => setEditingCandidate({ ...editingCandidate, name: e.target.value })} />
                <input type="text" value={editingCandidate.lname}
                  onChange={e => setEditingCandidate({ ...editingCandidate, lname: e.target.value })} />
                <input type="email" value={editingCandidate.email}
                  onChange={e => setEditingCandidate({ ...editingCandidate, email: e.target.value })} />
                <select value={editingCandidate.tech}
                  onChange={e => setEditingCandidate({ ...editingCandidate, tech: e.target.value })}>
                  {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={editingCandidate.difficulty}
                  onChange={e => setEditingCandidate({ ...editingCandidate, difficulty: e.target.value })}>
                  {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <div className="modal-actions">
                  {sending ? <div className="loader"></div> : (
                    <>
                      <button onClick={() => handleSendTest(editingCandidate)}><SendIcon /> Send Test</button>
                      <button onClick={handleUpdateCandidate}>Save</button>
                      <button onClick={() => setEditingCandidate(null)}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminCandidatePage;
