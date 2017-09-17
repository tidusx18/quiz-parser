/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_Quiz__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__src_sometext__ = __webpack_require__(2);



var pool = new __WEBPACK_IMPORTED_MODULE_0__src_Quiz__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__src_sometext__["a" /* default */]);
pool.evaluatePool();
console.log(pool.getQuestions())


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function QuizPool(quizPool) {
  this.quizPool = quizPool;
  this.currentQuestion = {};
  this.questions = [];
  this.matchPatterns = {
    type: /^Type: (\S{1,3})/i,
    prompt: /^\d{1,3}(?:\)|\.) /i,
    answer: /\*{0,1}([a-z])(?:\)|\.) ([\s\S]*)/i,
    correctAnswer: /^\*([a-z])(?:\)|\.) /i,
    // trueFalseQuestion: /^[ab](?:\)|\.) (?:true|false)/i,
    splitPool: /(?=^(?:\d{1,3}(?:\)|\.) |Type: \S{1,3}))/im,
    splitQuestion: /(?=^(?:\d{1,3}|\*{0,1}[a-z])(?:\)|\.) )/im,
    // splitAnswer: /(?:^(\*{0,1}[a-z])(?:\)|\.))/i
  };
}

QuizPool.prototype.splitPoolToQuestions = function(quizPool) {
  let splitResults = quizPool.trim().split(this.matchPatterns.splitPool);
  let results = [];
  while(splitResults.length != 0) {
    if (splitResults[0].includes('Type: ')) {
      results.push(splitResults.shift() + splitResults.shift());
    } else {
      results.push(splitResults.shift());
    }
  }
  return results;
};

QuizPool.prototype.evaluatePool = function() {
  let questions = this.splitPoolToQuestions(this.quizPool);

  for(let question of questions) {
    this.__startNewQuestion();
    let splitQuestion = question.split(this.matchPatterns.splitQuestion);
    
    for(let item of splitQuestion) {
      if(this.__search(item, 'type')) {
        this.currentQuestion.type = item;
      }      
      else if(this.__search(item, 'prompt')) {
        this.currentQuestion.prompt = item;
      }
      else if(this.__search(item, 'answer')) {
        if(this.__search(item, 'correctAnswer')) {
          let correctAnswer = this.__getMatch(item, 'correctAnswer');
          this.__addCorrectAnswer(correctAnswer[1]);
        }
        let answer = this.__getMatch(item, 'answer');
        this.__addAnswer([answer[1], answer[2]]); // [1] is answer letter/number, [2] is text.
      }
    }
    this.__addQuestion(this.currentQuestion);
    console.log('Question Added: ', this.currentQuestion);
  }
};

QuizPool.prototype.getQuestions = function() {
  return this.questions;
};

QuizPool.prototype.getQuestion = function(index) {
  if (index) {
  return this.questions[index];
  } else {
    return this.currentQuestion;
  }
};

QuizPool.prototype.__addQuestion = function(question) {
  this.questions.push(question);
};

QuizPool.prototype.__addAnswer = function(answer) {
  this.currentQuestion.answers.push(answer);
};

QuizPool.prototype.__addCorrectAnswer = function(correctAnswer) {
  this.currentQuestion.correctAnswers.push(correctAnswer);
};

QuizPool.prototype.__startNewQuestion = function() {
  return this.currentQuestion = {
      type: '',
      number: '',
      prompt: '',
      answers: [],
      correctAnswers: []
    }
};

QuizPool.prototype.__getMatch = function(item, patternName) {
  if(!item) {
    return console.log('Item paramater required to find match');
  }
  if (this.matchPatterns[patternName]) {
  return item.match(this.matchPatterns[patternName]);
  }
  console.log('Pattern does not exist: ', patternName)
  return false;
}

QuizPool.prototype.__search = function(item, patternName) {
  if(!item) {
    return console.log('Item paramater required for search');
  }
  if (this.matchPatterns[patternName]) {
  return item.search(this.matchPatterns[patternName]) > -1;
  }
  console.log('Pattern does not exist: ', patternName)
  return false;
};

/* harmony default export */ __webpack_exports__["a"] = (QuizPool);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var quiz = `
1) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
*b) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
c) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

d. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

2) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
*a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
b. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
c) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
d. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

3) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
b. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.
c) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

more stuff for answer "C".
d. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

Type: E
4) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.

wqeqweqweqweqwewq

asdsad

Type: E

5) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque fringilla arcu in arcu aliquet volutpat. Praesent quis ultricies libero. Nulla pharetra mollis finibus.`

/* harmony default export */ __webpack_exports__["a"] = (quiz);

/***/ })
/******/ ]);