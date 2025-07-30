import axios from 'axios';

export const quizAPI = {
  getQuizzes: () => axios.get('http://localhost:8080/api/quizzes')
  .then(res => res.data),
  createQuiz: (quiz) => axios.post('http://localhost:8080/api/quizzes', quiz)
  .then(res => res.data),
  updateQuiz: (id, quiz) => axios.put(`http://localhost:8080/api/quizzes/${id}`, quiz)
  .then(res => res.data),
   deleteQuiz: (id) => axios.delete(`http://localhost:8080/api/quizzes/${id}`)
  .then(res => res.data)
};
