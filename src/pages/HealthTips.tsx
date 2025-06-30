import React from 'react';
import { Heart, Brain, Salad, Sun, Moon, Dumbbell } from 'lucide-react';

const HealthTips: React.FC = () => {
  const tips = [
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Heart Health",
      tips: [
        "Exercise for at least 30 minutes daily",
        "Maintain a balanced diet low in saturated fats",
        "Monitor blood pressure regularly",
        "Stay hydrated with 8 glasses of water daily"
      ]
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "Mental Wellness",
      tips: [
        "Practice meditation or mindfulness",
        "Get adequate sleep (7-9 hours)",
        "Take regular breaks during work",
        "Stay socially connected with loved ones"
      ]
    },
    {
      icon: <Salad className="h-8 w-8 text-green-500" />,
      title: "Nutrition",
      tips: [
        "Eat plenty of fruits and vegetables",
        "Include protein in every meal",
        "Limit processed food intake",
        "Choose whole grains over refined grains"
      ]
    },
    {
      icon: <Sun className="h-8 w-8 text-yellow-500" />,
      title: "Daily Habits",
      tips: [
        "Start your day with a glass of water",
        "Take short walks after meals",
        "Practice good posture",
        "Limit screen time before bed"
      ]
    },
    {
      icon: <Moon className="h-8 w-8 text-blue-500" />,
      title: "Sleep Hygiene",
      tips: [
        "Maintain a consistent sleep schedule",
        "Create a relaxing bedtime routine",
        "Keep bedroom cool and dark",
        "Avoid caffeine in the evening"
      ]
    },
    {
      icon: <Dumbbell className="h-8 w-8 text-gray-500" />,
      title: "Physical Activity",
      tips: [
        "Mix cardio and strength training",
        "Stay active throughout the day",
        "Stretch regularly",
        "Find activities you enjoy"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Tips & Wellness Guide</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Simple yet effective tips to maintain good health and well-being in your daily life.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tips.map((section, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <div className="flex items-center mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold ml-3">{section.title}</h2>
            </div>
            <ul className="space-y-3">
              {section.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-cyan-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-cyan-800 mb-4">Remember</h2>
        <p className="text-cyan-700">
          These tips are general guidelines. Always consult with healthcare professionals for personalized medical advice.
          Regular check-ups and preventive care are essential for maintaining good health.
        </p>
      </div>
    </div>
  );
};

export default HealthTips;