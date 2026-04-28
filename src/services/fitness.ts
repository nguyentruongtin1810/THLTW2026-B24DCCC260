// Services for Fitness App using localStorage

import { Workout, HealthMetric, Goal, Exercise } from '../models/fitness';

const WORKOUTS_KEY = 'fitness_workouts';
const HEALTH_METRICS_KEY = 'fitness_health_metrics';
const GOALS_KEY = 'fitness_goals';
const EXERCISES_KEY = 'fitness_exercises';

// Workout Services
export const getWorkouts = (): Workout[] => {
  const data = localStorage.getItem(WORKOUTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workout: Workout) => {
  const workouts = getWorkouts();
  const index = workouts.findIndex(w => w.id === workout.id);
  if (index >= 0) {
    workouts[index] = workout;
  } else {
    workouts.push(workout);
  }
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

export const deleteWorkout = (id: string) => {
  const workouts = getWorkouts().filter(w => w.id !== id);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

// Health Metrics Services
export const getHealthMetrics = (): HealthMetric[] => {
  const data = localStorage.getItem(HEALTH_METRICS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveHealthMetric = (metric: HealthMetric) => {
  const metrics = getHealthMetrics();
  const index = metrics.findIndex(m => m.id === metric.id);
  if (index >= 0) {
    metrics[index] = metric;
  } else {
    metrics.push(metric);
  }
  localStorage.setItem(HEALTH_METRICS_KEY, JSON.stringify(metrics));
};

export const deleteHealthMetric = (id: string) => {
  const metrics = getHealthMetrics().filter(m => m.id !== id);
  localStorage.setItem(HEALTH_METRICS_KEY, JSON.stringify(metrics));
};

// Goals Services
export const getGoals = (): Goal[] => {
  const data = localStorage.getItem(GOALS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveGoal = (goal: Goal) => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === goal.id);
  if (index >= 0) {
    goals[index] = goal;
  } else {
    goals.push(goal);
  }
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const deleteGoal = (id: string) => {
  const goals = getGoals().filter(g => g.id !== id);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

// Exercises Services
export const getExercises = (): Exercise[] => {
  const data = localStorage.getItem(EXERCISES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveExercise = (exercise: Exercise) => {
  const exercises = getExercises();
  const index = exercises.findIndex(e => e.id === exercise.id);
  if (index >= 0) {
    exercises[index] = exercise;
  } else {
    exercises.push(exercise);
  }
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
};

export const deleteExercise = (id: string) => {
  const exercises = getExercises().filter(e => e.id !== id);
  localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
};

// Initialize with sample data if empty
export const initializeSampleData = () => {
  if (getWorkouts().length === 0) {
    const sampleWorkouts: Workout[] = [
      {
        id: '1',
        date: '2024-01-01',
        type: 'Cardio',
        duration: 30,
        calories: 300,
        notes: 'Morning run',
        status: 'Completed',
      },
      {
        id: '2',
        date: '2024-01-02',
        type: 'Strength',
        duration: 45,
        calories: 200,
        notes: 'Weight training',
        status: 'Completed',
      },
    ];
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(sampleWorkouts));
  }

  if (getHealthMetrics().length === 0) {
    const sampleMetrics: HealthMetric[] = [
      {
        id: '1',
        date: '2024-01-01',
        weight: 70,
        height: 170,
        restingHeartRate: 65,
        sleepHours: 8,
      },
    ];
    localStorage.setItem(HEALTH_METRICS_KEY, JSON.stringify(sampleMetrics));
  }

  if (getGoals().length === 0) {
    const sampleGoals: Goal[] = [
      {
        id: '1',
        name: 'Lose 5kg',
        type: 'Weight Loss',
        targetValue: 65,
        currentValue: 70,
        deadline: '2024-06-01',
        status: 'In Progress',
      },
    ];
    localStorage.setItem(GOALS_KEY, JSON.stringify(sampleGoals));
  }

  if (getExercises().length === 0) {
    const sampleExercises: Exercise[] = [
      {
        id: '1',
        name: 'Push-ups',
        muscleGroup: 'Chest',
        difficulty: 'Medium',
        description: 'Basic chest exercise',
        avgCaloriesPerHour: 300,
        instructions: 'Start in plank position, lower chest to ground, push back up.',
      },
      {
        id: '2',
        name: 'Squats',
        muscleGroup: 'Legs',
        difficulty: 'Easy',
        description: 'Lower body strength exercise',
        avgCaloriesPerHour: 250,
        instructions: 'Stand with feet shoulder-width, lower as if sitting back into a chair.',
      },
    ];
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(sampleExercises));
  }
};