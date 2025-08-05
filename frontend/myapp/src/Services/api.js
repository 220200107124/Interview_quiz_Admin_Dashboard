import axios from 'axios';

const API_URL = 'https://interview-quiz-admin-dashboard.onrender.com'; 

export const quizAPI = {
  getQuizzes: () => axios.get(`${API_URL}/api/quizzes`).then(res => res.data),
  createQuiz: (quiz) => axios.post(`${API_URL}/api/quizzes`, quiz).then(res => res.data),
  updateQuiz: (id, quiz) => axios.put(`${API_URL}/api/quizzes/${id}`, quiz).then(res => res.data),
  deleteQuiz: (id) => axios.delete(`${API_URL}/api/quizzes/${id}`).then(res => res.data)
};
