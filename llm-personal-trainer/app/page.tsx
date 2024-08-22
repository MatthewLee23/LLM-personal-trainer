'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChat } from 'ai/react';

export default function Chat() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goal: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: ''
  });
  const [extraDetails, setExtraDetails] = useState(''); // State for extra details
  const [workoutProgram, setWorkoutProgram] = useState('');

  const { handleSubmit, input, setInput, messages } = useChat({
    onFinish: (data) => {
      setWorkoutProgram((prev) => prev + data.content);
    }
  });

  const questions = [
    {
      question: "What's your primary fitness goal?",
      options: ["Lose Weight", "Build Muscle", "Improve Endurance", "General Fitness"]
    },
    {
      question: "What's your age group?",
      options: ["18-25", "26-35", "36-45", "46+"]
    },
    {
      question: "What's your height range?",
      options: ["Under 5'5\"", "5'5\" - 5'9\"", "5'10\" - 6'2\"", "Over 6'2\""]
    },
    {
      question: "What's your weight range?",
      options: ["Under 130 lbs", "130-160 lbs", "161-190 lbs", "Over 190 lbs"]
    },
    {
      question: "What's your current fitness level?",
      options: ["Beginner", "Intermediate (about a year of lifting experience)", "Advanced", "Athletic"]
    }
  ];

  const handleAnswer = (answer: string) => {
    const currentQuestion = Object.keys(answers)[step];
    setAnswers({ ...answers, [currentQuestion]: answer });

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(step + 1); // Proceed to the extra details textbox step
    }
  };

  const handleExtraDetailsSubmit = () => {
    const prompt = `
      Create an extremely detailed 3-month workout program with an extremely detailed schedule with days and week numbers. You give them
      exact meals to eat and how much they should weigh. You give them exact workouts with sets and reps. You give them a strength progression
      model. You provide inspiring quotes from famous bodybuilders and athletes. Also, create the workout program with these details in mind:
      Goal: ${answers.goal}
      Age: ${answers.age}
      Height: ${answers.height}
      Weight: ${answers.weight}
      Fitness Level: ${answers.fitnessLevel}
      Additional Details: ${extraDetails}
    `;
    setInput(prompt);
    handleSubmit();  // Trigger the API call and stream response
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4"
    style={{
      backgroundImage: 'url(https://thumbs.dreamstime.com/b/futuristic-fitness-room-advanced-equipment-future-gym-health-generative-ai-futuristic-fitness-room-advanced-288975630.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">Personal Trainer of the Future</CardTitle>
          <CardDescription>Your path to fitness, tailored just for you</CardDescription>
        </CardHeader>
        <CardContent>
          {workoutProgram ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-800">Your Personalized Workout Program</h2>
              <pre className="whitespace-pre-wrap text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
                {workoutProgram}
              </pre>
              <Button className="w-full" onClick={() => { setStep(0); setWorkoutProgram(''); setExtraDetails(''); }}>Start Over</Button>
            </div>
          ) : (
            <>
              {step < questions.length ? (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">{questions[step].question}</h2>
                  <Progress value={(step / questions.length) * 100} className="h-2 mb-2" />
                  <p className="text-sm text-gray-500">Question {step + 1} of {questions.length}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {questions[step].options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto py-4 px-6 text-left justify-start items-start hover:bg-blue-50 hover:text-blue-600 transition-all"
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">Any additional details?</h2>
                  <textarea
                    className="w-full h-32 p-2 mb-4 border border-gray-300 rounded shadow-xl"
                    placeholder="Add any extra information here..."
                    value={extraDetails}
                    onChange={(e) => setExtraDetails(e.target.value)}
                  />
                  <Button className="w-full" onClick={handleExtraDetailsSubmit}>Submit</Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
