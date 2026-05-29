export const USER_PROFILE = {
  name: 'Champion',
  age: 22,
  height: 179,
  startWeight: 57.0,
  currentWeight: 57.0,
  goalWeight: 65.0,
  calorieTarget: 2200,
  units: 'kg',
  gymDays: [1, 2, 3, 4, 5], // Mon-Fri
};

export const WEIGHT_HISTORY = [
  { date: '2026-05-20', weight: 56.5 },
  { date: '2026-05-24', weight: 56.8 },
  { date: '2026-05-28', weight: 57.0 },
];

export const MEAL_PLAN = [
  {
    day: 1, // Example for Monday, usually rotated in AppContext
    meals: [
      { id: 'm1', name: 'Breakfast Boost', time: '08:00', calories: 450, foods: ['3 Eggs', '2 Bread slices', 'Peanut Butter'], portion: 'Small' },
      { id: 'm2', name: 'Appetite Snack', time: '11:00', calories: 350, foods: ['Banana', 'Avocado', 'Handful of Nuts'], portion: 'Small' },
      { id: 'm3', name: 'Power Lunch', time: '14:00', calories: 550, foods: ['Injera with Doro Wat', 'Boiled Egg'], portion: 'Regular' },
      { id: 'm4', name: 'Pre-Workout Fuel', time: '17:30', calories: 300, foods: ['Yogurt', 'Banana'], portion: 'Small' },
      { id: 'm5', name: 'Muscle Recovery', time: '20:30', calories: 550, foods: ['Cheese Sandwich', 'Glass of Milk', 'Avocado'], portion: 'Regular' },
    ]
  }
];

export const WORKOUT_PLAN = [
  {
    id: 'w1',
    day: 1,
    splitType: 'Chest & Triceps',
    focus: 'Push Strength & Chest Volume',
    exercises: [
      { id: 'ex1-1', name: 'Dumbbell Bench Press', sets: 4, reps: '8-10', weight: 0, description: 'Lie on bench, press dumbbells upward above chest.', tip: 'Keep elbows at a 45-degree angle for shoulder safety.' },
      { id: 'ex1-2', name: 'Incline DB Press', sets: 3, reps: '10-12', weight: 0, description: 'Bench at 30 degrees. Focus on upper chest.', tip: 'Squeeze your chest at the top of the movement.' },
      { id: 'ex1-3', name: 'Dumbbell Flyes', sets: 3, reps: '12-15', weight: 0, description: 'Wide arc movement to stretch chest fibers.', tip: 'Don’t go too heavy; focus on the stretch.' },
      { id: 'ex1-4', name: 'Overhead DB Extension', sets: 3, reps: '10-12', weight: 0, description: 'Hold one DB with both hands behind head.', tip: 'Keep elbows tucked close to your ears.' },
      { id: 'ex1-5', name: 'DB Tricep Kickbacks', sets: 3, reps: '12-15', weight: 0, description: 'Lean forward, extend arm back fully.', tip: 'Pause for 1 second at full extension.' },
      { id: 'ex1-6', name: 'Diamond Pushups', sets: 3, reps: 'Failure', weight: 0, description: 'Hands close together to target triceps.', tip: 'Keep your core tight.' },
    ]
  },
  {
    id: 'w2',
    day: 2,
    splitType: 'Back & Biceps',
    focus: 'Pull Width & Bicep Peak',
    exercises: [
      { id: 'ex2-1', name: 'One-Arm DB Rows', sets: 4, reps: '10-12', weight: 0, description: 'Pull DB to hip while supported on bench.', tip: 'Pull with your elbows, not your hands.' },
      { id: 'ex2-2', name: 'Dumbbell Pullovers', sets: 3, reps: '12', weight: 0, description: 'Lie across bench, lower DB behind head.', tip: 'Targets both lats and chest.' },
      { id: 'ex2-3', name: 'DB Shrugs', sets: 4, reps: '15', weight: 0, description: 'Hold DBs, shrug shoulders toward ears.', tip: 'Hold the squeeze at the top.' },
      { id: 'ex2-4', name: 'Standing DB Curls', sets: 3, reps: '10-12', weight: 0, description: 'Standard bicep curl with palms up.', tip: 'Control the weight on the way down.' },
      { id: 'ex2-5', name: 'Hammer Curls', sets: 3, reps: '10-12', weight: 0, description: 'Curls with palms facing each other.', tip: 'Targets the forearms and outer bicep.' },
      { id: 'ex2-6', name: 'Concentration Curls', sets: 3, reps: '12', weight: 0, description: 'Seated, elbow against inner thigh.', tip: 'Focus on reaching a full peak contraction.' },
    ]
  },
  {
    id: 'w3',
    day: 3,
    splitType: 'Shoulders & Traps',
    focus: 'Shoulder Breadth & V-Taper',
    exercises: [
      { id: 'ex3-1', name: 'Seated DB Shoulder Press', sets: 4, reps: '8-10', weight: 0, description: 'Press DBs from shoulders to overhead.', tip: 'Don’t lock your elbows at the top.' },
      { id: 'ex3-2', name: 'Lateral Raises', sets: 4, reps: '15', weight: 0, description: 'Raise DBs out to the side like wings.', tip: 'Lead with your pinkies for side-delt focus.' },
      { id: 'ex3-3', name: 'Front DB Raises', sets: 3, reps: '12', weight: 0, description: 'Raise DBs forward to eye level.', tip: 'Stop at eye level; don’t swing.' },
      { id: 'ex3-4', name: 'Reverse DB Flyes', sets: 3, reps: '15', weight: 0, description: 'Bent over, raise arms out to sides.', tip: 'Targets the rear delts (back of shoulder).' },
      { id: 'ex3-5', name: 'Arnold Press', sets: 3, reps: '10-12', weight: 0, description: 'Rotate palms as you press overhead.', tip: 'Increases range of motion for growth.' },
      { id: 'ex3-6', name: 'Upright DB Rows', sets: 3, reps: '12', weight: 0, description: 'Pull DBs up toward your chin.', tip: 'Keep the weights close to your body.' },
    ]
  },
  {
    id: 'w4',
    day: 4,
    splitType: 'Complete Arms',
    focus: 'Bicep & Tricep Hypertrophy',
    exercises: [
      { id: 'ex4-1', name: 'Close Grip DB Press', sets: 4, reps: '10', weight: 0, description: 'Press DBs while keeping them together.', tip: 'Tension should stay on the triceps.' },
      { id: 'ex4-2', name: 'Incline DB Curls', sets: 3, reps: '12', weight: 0, description: 'Curls while lying on an incline bench.', tip: 'Great for stretching the long head of the bicep.' },
      { id: 'ex4-3', name: 'Skull Crushers (DB)', sets: 3, reps: '10-12', weight: 0, description: 'Lower DBs toward forehead, extend up.', tip: 'Keep your elbows pointing at the ceiling.' },
      { id: 'ex4-4', name: 'Zottman Curls', sets: 3, reps: '10-12', weight: 0, description: 'Curl up, rotate palms, lower down.', tip: 'Combines standard and reverse curls.' },
      { id: 'ex4-5', name: 'Bench Dips', sets: 3, reps: 'Failure', weight: 0, description: 'Use bench to dip your body weight.', tip: 'Add a dumbbell to your lap for extra weight.' },
      { id: 'ex4-6', name: 'Cross Body Hammer Curls', sets: 3, reps: '12', weight: 0, description: 'Hammer curl toward opposite shoulder.', tip: 'Builds thickness in the arm.' },
    ]
  },
  {
    id: 'w5',
    day: 5,
    splitType: 'Upper Body Power',
    focus: 'Compound Movements',
    exercises: [
      { id: 'ex5-1', name: 'DB Floor Press', sets: 4, reps: '8', weight: 0, description: 'Bench press on the floor.', tip: 'Allows for heavier weights safely.' },
      { id: 'ex5-2', name: 'DB Renegade Rows', sets: 3, reps: '10 per arm', weight: 0, description: 'Row while in a plank position.', tip: 'Targets back and stability.' },
      { id: 'ex5-3', name: 'Clean and Press (DB)', sets: 3, reps: '8-10', weight: 0, description: 'Explosive lift from floor to overhead.', tip: 'Great full-body-power compound.' },
      { id: 'ex5-4', name: 'Wide DB Rows', sets: 3, reps: '12', weight: 0, description: 'Row with elbows flared out.', tip: 'Focus on upper back/traps.' },
      { id: 'ex5-5', name: 'Tricep Pushups', sets: 3, reps: 'Failure', weight: 0, description: 'Pushups with elbows scraping ribs.', tip: 'Finish the muscle off entirely.' },
      { id: 'ex5-6', name: 'Preacher Curls (DB)', sets: 3, reps: '12', weight: 0, description: 'One arm at a time over bench.', tip: 'Isolation for the lower bicep.' },
    ]
  }
];
