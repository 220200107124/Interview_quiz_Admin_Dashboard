import axios from 'axios';

export const quizAPI = {
  getQuizzes: () => axios.get('SERVER_URI/api/quizzes')
  .then(res => res.data),
  createQuiz: (quiz) => axios.post('SERVER_URI/api/quizzes', quiz)
  .then(res => res.data),
  updateQuiz: (id, quiz) => axios.put(`SERVER_URI/api/quizzes/${id}`, quiz)
  .then(res => res.data),
   deleteQuiz: (id) => axios.delete(`SERVER_URI/api/quizzes/${id}`)
  .then(res => res.data)
};
