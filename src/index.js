import QuizPool from '../src/Quiz';
import quiz from '../src/sometext';

var pool = new QuizPool(quiz);
pool.evaluatePool();
console.log(pool.getQuestions())
