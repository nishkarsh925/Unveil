'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Clock, Trophy, Award, Share2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Game configuration
const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', color: 'emerald', timeMultiplier: 1 },
  { value: 'intermediate', label: 'Intermediate', color: 'amber', timeMultiplier: 0.75 },
  { value: 'advanced', label: 'Advanced', color: 'rose', timeMultiplier: 0.5 }
];

const categories = [
  { value: 'bias', label: 'Bias Detection', icon: '⚖️' },
  { value: 'fact-checking', label: 'Fact Checking', icon: '🔍' },
  { value: 'source-analysis', label: 'Source Analysis', icon: '📊' },
  { value: 'critical-thinking', label: 'Critical Thinking', icon: '🧠' },
  { value: 'misinformation', label: 'Misinformation', icon: '🚫' }
];

// More diverse and challenging questions
const allQuestions = [
  {
    question: "Which headline shows potential clickbait?",
    options: [
      "Scientists Discover New Planet in Alpha Centauri System",
      "You Won't BELIEVE What This Celebrity Did Next - #6 Will SHOCK You!",
      "Global Economy Shows Signs of Recovery According to Latest Report",
      "Local Council Approves New Infrastructure Plan After Public Consultation"
    ],
    correct: 1,
    explanation: "Clickbait headlines often use ALL CAPS, extreme language like 'SHOCK', and make vague promises about content.",
    category: 'bias',
    difficulty: 'beginner',
    timeEstimate: 20
  },
  {
    question: "What's a key indicator of source credibility?",
    options: [
      "Lots of ads and sponsored content",
      "Anonymous sources for sensitive information",
      "Clear attribution, citations and transparent methodology",
      "Emotional language that resonates with readers"
    ],
    correct: 2,
    explanation: "Credible sources cite their information clearly and explain how they gathered data or reached conclusions.",
    category: 'source-analysis',
    difficulty: 'intermediate',
    timeEstimate: 25
  },
  {
    question: "Which statement about this image is most accurate?",
    image: true,
    imageDescription: "[Image shows a graph with an exaggerated y-axis scaling]",
    options: [
      "The graph shows objective data visualization",
      "The graph indicates dramatic change in the measured variable",
      "The graph uses manipulated scaling to exaggerate differences",
      "The graph follows best practices for data visualization"
    ],
    correct: 2,
    explanation: "Manipulated axis scaling is a common way to visually exaggerate differences in data that might be less significant.",
    category: 'critical-thinking',
    difficulty: 'intermediate',
    timeEstimate: 30
  },
  {
    question: "A news article states: 'Studies show this supplement is effective.' What question should you ask?",
    options: [
      "Is the supplement natural or synthetic?",
      "Which specific studies, conducted by whom, with what sample size and methodology?",
      "How much does the supplement cost?",
      "Is the supplement available without prescription?"
    ],
    correct: 1,
    explanation: "Vague references to 'studies' without specific citations is a red flag. Always ask for specific research details.",
    category: 'fact-checking',
    difficulty: 'beginner',
    timeEstimate: 25
  },
  {
    question: "Why might a social media post going viral not be trustworthy?",
    options: [
      "Popular content is always false",
      "Virality is driven by emotional reactions, not accuracy",
      "Only government sources can be trusted",
      "Social media algorithms prioritize user satisfaction"
    ],
    correct: 1,
    explanation: "Content often goes viral because it triggers strong emotions like outrage or amazement, not because it's accurate or important.",
    category: 'misinformation',
    difficulty: 'beginner',
    timeEstimate: 20
  },
  {
    question: "A news site publishes a story that fits perfectly with your political views. What should you do?",
    options: [
      "Share it immediately to inform others",
      "Check if other sources with different viewpoints are reporting similar facts",
      "Trust it because it aligns with what you already believe",
      "Comment supportively to boost the article's visibility"
    ],
    correct: 1,
    explanation: "Confirmation bias makes us more likely to accept information that confirms our existing beliefs without scrutiny.",
    category: 'bias',
    difficulty: 'intermediate',
    timeEstimate: 25
  },
  {
    question: "Which approach is most helpful for evaluating a scientific claim in the news?",
    options: [
      "Check if it was published on a major news site",
      "See if the news article links to peer-reviewed research",
      "Read the comments to see if people agree with it",
      "Check if the information makes intuitive sense"
    ],
    correct: 1,
    explanation: "Scientific claims should be backed by peer-reviewed research. Legitimate news coverage will link to or cite the original studies.",
    category: 'fact-checking',
    difficulty: 'advanced',
    timeEstimate: 30
  },
  {
    question: "Which statement about deepfake videos is false?",
    options: [
      "They can be created using AI to make people appear to say things they never said",
      "They're always easily identifiable by obvious visual glitches",
      "They represent an emerging challenge for media literacy",
      "They can be used to spread misinformation by creating false evidence"
    ],
    correct: 1,
    explanation: "Advanced deepfakes can be very convincing and may not contain obvious visual glitches, making them difficult to identify.",
    category: 'misinformation',
    difficulty: 'advanced',
    timeEstimate: 25
  },
  {
    question: "A website claims to provide 'the news they don't want you to see.' This likely indicates:",
    options: [
      "The site has exclusive breaking news",
      "The site is uncovering important hidden truths",
      "The site is using conspiratorial framing to attract attention",
      "The content has been verified by multiple sources"
    ],
    correct: 2,
    explanation: "Phrases like 'they don't want you to know' use conspiratorial framing to make content seem more important or exclusive than it is.",
    category: 'critical-thinking',
    difficulty: 'intermediate',
    timeEstimate: 20
  },
  {
    question: "Which technique is NOT a form of media manipulation?",
    options: [
      "Cherry-picking data that supports a particular narrative",
      "Using emotional language to frame neutral events",
      "Citing multiple credible sources with different perspectives",
      "Using misleading or out-of-context images"
    ],
    correct: 2,
    explanation: "Including multiple credible sources with different perspectives is a sign of balanced, responsible journalism, not manipulation.",
    category: 'source-analysis', 
    difficulty: 'advanced',
    timeEstimate: 30
  }
];

export function MediaLiteracyGame() {
  // Game state
  const [gameState, setGameState] = useState('start'); // start, playing, feedback, results
  const [difficulty, setDifficulty] = useState('beginner');
  const [selectedCategories, setSelectedCategories] = useState(['bias', 'fact-checking']);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState([]);
  const [timer, setTimer] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Filter questions based on selected difficulty and categories
  useEffect(() => {
    if (gameState === 'start') {
      const filtered = allQuestions.filter(q => 
        (q.difficulty === difficulty || 
         (difficulty === 'intermediate' && q.difficulty === 'beginner') || 
         (difficulty === 'advanced')) && 
        selectedCategories.includes(q.category)
      );
      
      // Ensure we have at least 5 questions, fallback to all if needed
      const gameQuestions = filtered.length >= 5 
        ? shuffle(filtered).slice(0, 10) 
        : shuffle(allQuestions).slice(0, 10);
      
      setQuestions(gameQuestions);
    }
  }, [difficulty, selectedCategories, gameState]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(time => {
          if (time <= 1) {
            clearInterval(interval);
            handleTimeout();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleTimeout = () => {
    setTimerActive(false);
    setAnsweredCorrectly([...answeredCorrectly, false]);
    setGameState('feedback');
  };

  // Start the game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnsweredCorrectly([]);
    const currentQuestion = questions[0];
    const difficultyMultiplier = difficultyLevels.find(d => d.value === difficulty).timeMultiplier;
    const newMaxTime = Math.round(currentQuestion.timeEstimate * difficultyMultiplier);
    setMaxTime(newMaxTime);
    setTimer(newMaxTime);
    setTimerActive(true);
  };

  // Handle answer selection
  const handleAnswer = (index) => {
    setTimerActive(false);
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestionIndex].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    setAnsweredCorrectly([...answeredCorrectly, isCorrect]);
    setGameState('feedback');
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setGameState('playing');
      
      // Reset timer for next question
      const currentQuestion = questions[nextIndex];
      const difficultyMultiplier = difficultyLevels.find(d => d.value === difficulty).timeMultiplier;
      const newMaxTime = Math.round(currentQuestion.timeEstimate * difficultyMultiplier);
      setMaxTime(newMaxTime);
      setTimer(newMaxTime);
      setTimerActive(true);
    } else {
      setGameState('results');
    }
  };

  // Restart the game
  const restartGame = () => {
    setGameState('start');
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredCorrectly([]);
  };

  // Helper function to shuffle array
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Calculate achievements
  const getAchievements = () => {
    const achievements = [];
    
    if (score === questions.length) {
      achievements.push({ icon: Trophy, label: 'Perfect Score!', description: 'You answered all questions correctly' });
    }
    
    if (score >= Math.floor(questions.length * 0.8)) {
      achievements.push({ icon: Award, label: 'Media Expert', description: 'You scored over 80%' });
    }
    
    if (answeredCorrectly.filter(Boolean).length >= 3) {
      achievements.push({ icon: CheckCircle, label: 'Critical Thinker', description: 'You correctly answered 3+ questions in a row' });
    }
    
    return achievements.length ? achievements : [{ icon: Award, label: 'Participant', description: 'Keep practicing to earn achievements!' }];
  };

  // Render START screen
  if (gameState === 'start') {
    return (
      <Card className="max-w-lg mx-auto overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">Media Literacy Challenge</CardTitle>
          <p className="opacity-90">Test your ability to spot misinformation and analyze media critically.</p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-${level.color}-500`}></span>
                        <span>{level.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categories (select at least one)</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategories.includes(category.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (selectedCategories.includes(category.value) && selectedCategories.length > 1) {
                        setSelectedCategories(selectedCategories.filter(c => c !== category.value));
                      } else if (!selectedCategories.includes(category.value)) {
                        setSelectedCategories([...selectedCategories, category.value]);
                      }
                    }}
                    className="flex items-center gap-1"
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <h3 className="font-medium mb-2">Game Rules</h3>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li>Answer questions before the timer runs out</li>
                <li>Harder difficulty levels give you less time</li>
                <li>Each correct answer earns you a point</li>
                <li>Unlock achievements based on your performance</li>
              </ul>
            </div>
          </div>

          <Button 
            onClick={startGame}
            disabled={selectedCategories.length === 0 || questions.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            Start Challenge
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Render PLAYING screen
  if (gameState === 'playing' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / questions.length) * 100;
    
    return (
      <Card className="max-w-lg mx-auto overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{timer}s</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          <div className="space-y-4">
            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/20">
              {categories.find(c => c.value === currentQuestion.category)?.icon} 
              {categories.find(c => c.value === currentQuestion.category)?.label}
            </span>
            
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            
            {currentQuestion.image && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
                <p className="text-sm italic">{currentQuestion.imageDescription}</p>
              </div>
            )}
            
            <div className="grid gap-3">
              <AnimatePresence mode="wait">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full text-left justify-start h-auto p-4"
                      onClick={() => handleAnswer(index)}
                    >
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render FEEDBACK screen
  if (gameState === 'feedback' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    
    return (
      <Card className="max-w-lg mx-auto overflow-hidden shadow-lg rounded-xl">
        <CardHeader className={`space-y-2 ${isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              {isCorrect ? (
                <><CheckCircle className="text-green-600 dark:text-green-400" /> Correct!</>
              ) : (
                <><XCircle className="text-red-600 dark:text-red-400" /> Incorrect</>
              )}
            </CardTitle>
            <div>Score: {score}/{currentQuestionIndex + 1}</div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent className="space-y-4 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
            
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    index === currentQuestion.correct
                      ? 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                      : index === selectedAnswer
                      ? 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                      : 'bg-gray-50 dark:bg-gray-800/10'
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <h4 className="font-medium mb-1">Explanation:</h4>
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <Button 
            onClick={nextQuestion}
            className="w-full"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Render RESULTS screen
  if (gameState === 'results') {
    const achievements = getAchievements();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <Card className="max-w-lg mx-auto overflow-hidden shadow-lg rounded-xl">
        <CardHeader className="space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold">Challenge Complete!</CardTitle>
          <p className="opacity-90">Your media literacy skills have been evaluated.</p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">{percentage}%</div>
            <p className="text-sm opacity-80">You scored {score} out of {questions.length} questions correctly</p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-medium">Achievements Earned</h3>
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <achievement.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium">{achievement.label}</div>
                  <div className="text-xs opacity-80">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Categories</h3>
            <div className="grid grid-cols-2 gap-2">
              {selectedCategories.map(cat => {
                const category = categories.find(c => c.value === cat);
                const catQuestions = questions.filter(q => q.category === cat);
                const catScore = answeredCorrectly
                  .filter((_, i) => questions[i].category === cat)
                  .filter(Boolean).length;
                
                return (
                  <div key={cat} className="p-3 bg-gray-50 rounded-lg dark:bg-gray-800/10">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <div className="text-sm opacity-80">
                      {catScore}/{catQuestions.length} correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={restartGame}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-2" /> Play Again
            </Button>
            <Button 
              onClick={() => console.log('Sharing results...')}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              <Share2 className="h-4 w-4 mr-2" /> Share Results
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fallback for empty state
  return <div>Loading game...</div>;
}
