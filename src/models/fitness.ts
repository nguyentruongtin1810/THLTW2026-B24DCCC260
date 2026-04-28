// Models for Fitness App

export interface Workout {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
  duration: number; // minutes
  calories: number;
  notes: string;
  status: 'Completed' | 'Missed';
}

export interface HealthMetric {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  height: number; // cm
  restingHeartRate: number; // bpm
  sleepHours: number;
}

export interface Goal {
  id: string;
  name: string;
  type: 'Weight Loss' | 'Muscle Gain' | 'Endurance' | 'Other';
  targetValue: number;
  currentValue: number;
  deadline: string; // YYYY-MM-DD
  status: 'In Progress' | 'Achieved' | 'Cancelled';
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  avgCaloriesPerHour: number;
  instructions: string;
}