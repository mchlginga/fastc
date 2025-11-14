import { useState } from "react";
import { Award } from "react-feather";

const QuizComponent = ({ quizQuestions, onQuizComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerSelect = (answerIndex) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setUserAnswers(newAnswers);

        // Move to next question or show results
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Calculate score
            const correctAnswers = quizQuestions.reduce(
                (acc, question, index) => {
                    return (
                        acc +
                        (question.correctAnswer === newAnswers[index] ? 1 : 0)
                    );
                },
                0
            );

            setScore(correctAnswers);
            setShowResults(true);

            // Notify parent component about quiz completion
            if (onQuizComplete) {
                onQuizComplete(correctAnswers, quizQuestions.length);
            }
        }
    };

    if (showResults) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={24} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">
                    Quiz Completed!
                </h3>
                <p className="text-green-600 text-lg mb-4">
                    Score: {score} out of {quizQuestions.length}
                </p>
                <p className="text-green-500 mb-4">
                    {score === quizQuestions.length ? "Perfect!" : "Good job!"}
                </p>
                <p className="text-green-600 text-sm">
                    The lesson has been marked as complete. You can now proceed
                    to the next lesson.
                </p>
            </div>
        );
    }

    const question = quizQuestions[currentQuestion];

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-4">
                <span className="text-sm text-blue-600 font-medium">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <h3 className="text-lg font-semibold text-gray-800 mt-1">
                    {question.question}
                </h3>
            </div>

            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center">
                            <div className="w-6 h-6 border border-gray-300 rounded-full mr-3 flex items-center justify-center">
                                <span className="text-sm text-gray-600">
                                    {String.fromCharCode(65 + index)}
                                </span>
                            </div>
                            <span className="text-gray-700">{option}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizComponent;
