import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { quizQuestions } from "../data/quizData";
// import Toastify from "toastify-js";  // Ensure you have Toastify library included

const Index = () => {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userName, setUserName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [timer, setTimer] = useState(null); // Timer will be set once user selects it
  const [intervalId, setIntervalId] = useState(null);
  const [selectedTime, setSelectedTime] = useState(''); // Initially no time selected

  // Handle answer selection
  const handleAnswerClick = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      toast('Correct Answer', 'green', 1500);
    } else {
      toast('Incorrect Answer', 'red', 1500);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowScore(true);
        clearInterval(intervalId); // Stop the timer when quiz ends
      }
    }, 1000);
  };

  // Start the quiz with the user-selected timer
  const startQuiz = () => {
    if (!userName) {
      toast('Please enter your name to start the quiz', 'red', 2000);
      return;
    }
    if (!selectedTime) {
      toast('Please choose a timer to start the quiz', 'red', 2000);
      return;
    }

    setQuizStarted(true);
    setTimer(Number(selectedTime)); // Set the timer to the user-selected time

    // Start the timer countdown
    const id = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(id);
          setShowScore(true); // Show score when timer ends
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  // Finish the quiz early (user clicked "Finish attempt")
  const finishQuiz = () => {
    clearInterval(intervalId); // Stop the timer
    setShowScore(true); // Immediately show score
  };

  // Reset the quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(Number(selectedTime) || 60); // Reset to selected timer
    setQuizStarted(false);
    clearInterval(intervalId); // Clear previous interval
  };

  // Toast notification
  function toast(message = 'Welcome', colour = 'red', duration = 3000) {
    Toastify({
      text: message,
      duration: duration,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: colour,
      },
      onClick: function () { },
    }).showToast();
  }

  // Get option button class
  const getOptionClassName = (option) => {
    if (!isAnswered) return "btn btn-outline-primary";
    if (option === quizQuestions[currentQuestion].correctAnswer) {
      return "btn btn-success";
    }
    if (option === selectedAnswer && selectedAnswer !== quizQuestions[currentQuestion].correctAnswer) {
      return "btn btn-danger";
    }
    return "btn btn-outline-primary";
  };

  // Display quiz end screen
  if (showScore) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex justify-content-center align-items-center vh-100 overflow-auto"
      >
        <div className="card shadow-lg p-4" style={{ maxWidth: "500px" }}>
          <div className="text-center">
            <h2 className="card-title">Quiz Complete!</h2>
            <p className="card-text fs-4">
              {userName}, you scored {score} out of {quizQuestions.length}
            </p>
            <button onClick={resetQuiz} className="btn btn-primary mt-3">
              Restart Quiz
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Display quiz or start screen
  if (!quizStarted) {
    return (
      <>
        <h1 className="text-center fw-bold display-2">SAM QUIZ</h1>
        <div className="d-flex justify-content-center align-items-center mt-5">
          <div className="card shadow-lg p-4" style={{ maxWidth: "500px" }}>
            <div className="text-center">
              <h2 className="card-title">Welcome to Sam Quiz</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              {/* Timer select */}
              <div className="mb-3">
                <select
                  className="form-control"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="">Choose timer</option>
                  <option value="600">10 Minute</option>
                  <option value="900">15 minute</option>
                  <option value="1200">20 minutes</option>
                  <option value="1500">25 minutes</option>
                </select>
              </div>
              <button onClick={startQuiz} className="btn btn-primary mt-3">
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-center fw-bold display-2">SAM QUIZ</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="d-flex justify-content-center align-items-center mt-5"
      >
        <div className="card shadow-lg p-4" style={{ maxWidth: "700px" }}>
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <span className="text-muted">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              {/* <span className="text-muted">Score: {score}</span> */}
              <span className="text-muted">Time: {timer}s</span>
            </div>
            <div className="progress mt-2">
              <motion.div
                className="progress-bar bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <motion.div
            key={currentQuestion}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-4">{quizQuestions[currentQuestion].question}</h2>
            <div className="d-grid gap-2">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.11 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerClick(option)}
                  className={getOptionClassName(option)}
                  disabled={isAnswered}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Finish attempt button */}
          <div className="text-center mt-4">
            <button onClick={finishQuiz} className="btn btn-danger">
              Finish Attempt
            </button>
          </div>

          <a href="https://github.com/DvSamM" className="mx-auto pt-5 fw-bold">DEV SAM</a>
        </div>
      </motion.div>
    </>
  );
};

export default Index;
