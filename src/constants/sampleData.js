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
  workoutTime: '17:00',
  sleepTime: '23:00',
  hydrationStartTime: '08:00',
  hydrationInterval: 3, // every 3 hours
};

export const WEIGHT_HISTORY = [
  { date: '2026-05-20', weight: 56.5 },
  { date: '2026-05-24', weight: 56.8 },
  { date: '2026-05-28', weight: 57.0 },
];

export const MEAL_PLAN = [
  {
    day: 1, // Monday
    meals: [
      { id: 'm1-1', name: 'Morning Power', time: '08:00', calories: 500, foods: ['4 Scrambled Eggs', 'Whole Wheat Toast', 'Avocado'], portion: 'Regular' },
      { id: 'm1-2', name: 'Oatmeal Gainer', time: '11:00', calories: 450, foods: ['Oats', 'Whey Protein', 'Peanut Butter', 'Banana'], portion: 'Large' },
      { id: 'm1-3', name: 'Beef & Rice', time: '14:00', calories: 650, foods: ['Lean Beef', 'Brown Rice', 'Broccoli'], portion: 'Regular' },
      { id: 'm1-4', name: 'Post-Gym Fuel', time: '18:00', calories: 400, foods: ['Protein Shake', 'Almonds', 'Apple'], portion: 'Small' },
      { id: 'm1-5', name: 'Bedtime Casein', time: '21:30', calories: 400, foods: ['Cottage Cheese', 'Blueberries', 'Walnuts'], portion: 'Regular' },
    ]
  },
  {
    day: 2, // Tuesday
    meals: [
      { id: 'm2-1', name: 'Greek Yogurt Mix', time: '08:30', calories: 450, foods: ['Greek Yogurt', 'Granola', 'Honey'], portion: 'Regular' },
      { id: 'm2-2', name: 'Chicken Wrap', time: '12:00', calories: 600, foods: ['Grilled Chicken', 'Whole Wheat Tortilla', 'Hummus'], portion: 'Large' },
      { id: 'm2-3', name: 'Pasta Feast', time: '15:30', calories: 700, foods: ['Whole Wheat Pasta', 'Turkey Meatballs', 'Marinara'], portion: 'Regular' },
      { id: 'm2-4', name: 'Nutty Snack', time: '18:30', calories: 350, foods: ['Trail Mix', 'Greek Yogurt'], portion: 'Small' },
      { id: 'm2-5', name: 'Salmon Dinner', time: '21:00', calories: 550, foods: ['Salmon', 'Sweet Potato', 'Asparagus'], portion: 'Regular' },
    ]
  },
  {
    day: 3, // Wednesday
    meals: [
      { id: 'm3-1', name: 'Protein Pancakes', time: '08:00', calories: 550, foods: ['Protein Pancakes', 'Maple Syrup', 'Strawberries'], portion: 'Regular' },
      { id: 'm3-2', name: 'Tuna Salad', time: '11:30', calories: 400, foods: ['Tuna', 'Light Mayo', 'Celery', 'Crackers'], portion: 'Small' },
      { id: 'm3-3', name: 'Steak & Potato', time: '14:30', calories: 750, foods: ['Sirloin Steak', 'Mashed Potatoes', 'Green Beans'], portion: 'Large' },
      { id: 'm3-4', name: 'Energy Bar', time: '17:30', calories: 300, foods: ['Kind Bar', 'Pear'], portion: 'Small' },
      { id: 'm3-5', name: 'Omelette Night', time: '20:30', calories: 500, foods: ['Veggie Omelette', 'Feta Cheese'], portion: 'Regular' },
    ]
  },
  {
    day: 4, // Thursday
    meals: [
      { id: 'm4-1', name: 'Smoothie Bowl', time: '08:00', calories: 480, foods: ['Açaí', 'Protein Powder', 'Seeds', 'Kiwi'], portion: 'Regular' },
      { id: 'm4-2', name: 'Turkey Sandwich', time: '12:00', calories: 550, foods: ['Turkey Breast', 'Rye Bread', 'Swiss Cheese'], portion: 'Regular' },
      { id: 'm4-3', name: 'Shrimp Stir Fry', time: '15:00', calories: 600, foods: ['Shrimp', 'Quinoa', 'Mixed Veggies'], portion: 'Regular' },
      { id: 'm4-4', name: 'Recovery Shake', time: '18:00', calories: 400, foods: ['Milk', 'Banana', 'Creatine'], portion: 'Small' },
      { id: 'm4-5', name: 'Bowl of Lentils', time: '21:00', calories: 500, foods: ['Lentil Soup', 'Whole Grain Bread'], portion: 'Regular' },
    ]
  },
  {
    day: 5, // Friday
    meals: [
      { id: 'm5-1', name: 'Breakfast Burrito', time: '08:30', calories: 600, foods: ['Eggs', 'Black Beans', 'Salsa', 'Tortilla'], portion: 'Large' },
      { id: 'm5-2', name: 'Hard Boiled Eggs', time: '11:30', calories: 350, foods: ['3 Eggs', 'Rice Cakes'], portion: 'Small' },
      { id: 'm5-3', name: 'Cod & Quinoa', time: '14:30', calories: 550, foods: ['Baked Cod', 'Quinoa', 'Zucchini'], portion: 'Regular' },
      { id: 'm5-4', name: 'Peanut Butter Celery', time: '18:00', calories: 300, foods: ['Celery', 'PB', 'Raisins'], portion: 'Small' },
      { id: 'm5-5', name: 'Steak Tacos', time: '21:00', calories: 650, foods: ['Corn Tortillas', 'Steak Strips', 'Guacamole'], portion: 'Large' },
    ]
  },
  {
    day: 6, // Saturday
    meals: [
      { id: 'm6-1', name: 'French Toast', time: '09:00', calories: 580, foods: ['Whole Wheat Toast', 'Cinnamon', 'Syrup'], portion: 'Regular' },
      { id: 'm6-2', name: 'Cottage Fruit', time: '12:00', calories: 400, foods: ['Cottage Cheese', 'Pineapple', 'Chia Seeds'], portion: 'Small' },
      { id: 'm6-3', name: 'Chicken Pasta', time: '15:30', calories: 700, foods: ['Chicken', 'Fettuccine', 'Alfredo (Light)'], portion: 'Large' },
      { id: 'm6-4', name: 'Cashew Handful', time: '19:00', calories: 350, foods: ['Roasted Cashews'], portion: 'Small' },
      { id: 'm6-5', name: 'Home Style Burger', time: '21:30', calories: 650, foods: ['Lean Patty', 'Brioche Bun', 'Salad'], portion: 'Regular' },
    ]
  },
  {
    day: 0, // Sunday
    meals: [
      { id: 'm0-1', name: 'Big Sunday Omelette', time: '10:00', calories: 600, foods: ['5 Eggs', 'Ham', 'Spinach', 'Mushrooms'], portion: 'Large' },
      { id: 'm0-2', name: 'Biltong/Jerky', time: '13:00', calories: 300, foods: ['Beef Jerky', 'Grapes'], portion: 'Small' },
      { id: 'm0-3', name: 'Roast Chicken', time: '16:00', calories: 700, foods: ['Chicken Thighs', 'Roasted Roots', 'Gravy'], portion: 'Large' },
      { id: 'm0-4', name: 'Yogurt & Berries', time: '19:00', calories: 400, foods: ['Greek Yogurt', 'Berries', 'Honey'], portion: 'Regular' },
      { id: 'm0-5', name: 'Light Salad', time: '21:30', calories: 350, foods: ['Kale', 'Chickpeas', 'Feta'], portion: 'Small' },
    ]
  },
];

export const WORKOUT_PLAN = [
  {
    id: 'w1',
    day: 1, // Mon
    splitType: 'Chest & Triceps',
    focus: 'Push Strength & Chest Volume',
    duration: '75 min',
    intensity: 'High',
    exercises: [
      { id: 'ex1-1', name: 'Dumbbell Bench Press', sets: 4, reps: '8-10', weight: 0, description: 'Lie on bench, press dumbbells upward above chest.', tip: 'Keep elbows at a 45-degree angle for shoulder safety.', muscle: 'Chest', equipment: 'Dumbbells' },
      { id: 'ex1-2', name: 'Incline DB Press', sets: 3, reps: '10-12', weight: 0, description: 'Bench at 30 degrees. Focus on upper chest.', tip: 'Squeeze your chest at the top of the movement.', muscle: 'Upper Chest', equipment: 'Bench / Dumbbells' },
      { id: 'ex1-3', name: 'Dumbbell Flyes', sets: 3, reps: '12-15', weight: 0, description: 'Wide arc movement to stretch chest fibers.', tip: 'Don’t go too heavy; focus on the stretch.', muscle: 'Chest', equipment: 'Dumbbells' },
      { id: 'ex1-4', name: 'Pushups to Failure', sets: 3, reps: 'Failure', weight: 0, description: 'Standard pushups to burn out.', tip: 'Maintain a straight line.', muscle: 'Chest/Shoulders', equipment: 'Bodyweight' },
      { id: 'ex1-5', name: 'Overhead DB Extension', sets: 3, reps: '10-12', weight: 0, description: 'Hold one DB with both hands behind head.', tip: 'Keep elbows tucked close to your ears.', muscle: 'Triceps', equipment: 'Dumbbell' },
      { id: 'ex1-6', name: 'DB Tricep Kickbacks', sets: 3, reps: '12-15', weight: 0, description: 'Lean forward, extend arm back fully.', tip: 'Pause for 1 second at full extension.', muscle: 'Triceps', equipment: 'Dumbbells' },
      { id: 'ex1-7', name: 'Diamond Pushups', sets: 3, reps: 'Failure', weight: 0, description: 'Hands close together to target triceps.', tip: 'Keep your core tight.', muscle: 'Triceps', equipment: 'Bodyweight' },
      { id: 'ex1-8', name: 'Dips', sets: 3, reps: '10-12', weight: 0, description: 'Lower body between two bars.', tip: 'Lean forward slightly for chest focus.', muscle: 'Triceps/Chest', equipment: 'Bars' },
    ]
  },
  {
    id: 'w2',
    day: 2, // Tue
    splitType: 'Back & Biceps',
    focus: 'Pull Width & Bicep Peak',
    duration: '70 min',
    intensity: 'High',
    exercises: [
      { id: 'ex2-1', name: 'One-Arm DB Rows', sets: 4, reps: '10-12', weight: 0, description: 'Pull DB to hip while supported on bench.', tip: 'Pull with your elbows, not your hands.', muscle: 'Lats', equipment: 'Dumbbells' },
      { id: 'ex2-2', name: 'Dumbbell Pullovers', sets: 3, reps: '12', weight: 0, description: 'Lie across bench, lower DB behind head.', tip: 'Targets both lats and chest.', muscle: 'Lats', equipment: 'Dumbbell' },
      { id: 'ex2-3', name: 'DB Shrugs', sets: 4, reps: '15', weight: 0, description: 'Hold DBs, shrug shoulders toward ears.', tip: 'Hold the squeeze at the top.', muscle: 'Traps', equipment: 'Dumbbells' },
      { id: 'ex2-4', name: 'Lat Pull-ins (DB)', sets: 3, reps: '12', weight: 0, description: 'Pull DB from overhead to side.', tip: 'Focus on the contraction.', muscle: 'Lats', equipment: 'Dumbbells' },
      { id: 'ex2-5', name: 'Standing DB Curls', sets: 3, reps: '10-12', weight: 0, description: 'Standard bicep curl with palms up.', tip: 'Control the weight on the way down.', muscle: 'Biceps', equipment: 'Dumbbells' },
      { id: 'ex2-6', name: 'Hammer Curls', sets: 3, reps: '10-12', weight: 0, description: 'Curls with palms facing each other.', tip: 'Targets the forearms and outer bicep.', muscle: 'Brachialis', equipment: 'Dumbbells' },
      { id: 'ex2-7', name: 'Concentration Curls', sets: 3, reps: '12', weight: 0, description: 'Seated, elbow against inner thigh.', tip: 'Focus on reaching a full peak contraction.', muscle: 'Biceps', equipment: 'Dumbbell' },
      { id: 'ex2-8', name: 'Zottman Curls', sets: 3, reps: '10', weight: 0, description: 'Regular curl up, reverse grip down.', tip: 'Great for forearm thickness.', muscle: 'Biceps/Forearms', equipment: 'Dumbbells' },
    ]
  },
  {
    id: 'w3',
    day: 3, // Wed
    splitType: 'Legs & Core',
    focus: 'Quad Strength & Abs',
    duration: '80 min',
    intensity: 'Extreme',
    exercises: [
      { id: 'ex3-1', name: 'Goblet Squats', sets: 4, reps: '12', weight: 0, description: 'Hold DB at chest, squat deep.', tip: 'Keep your chest up and core tight.', muscle: 'Quads', equipment: 'Dumbbell' },
      { id: 'ex3-2', name: 'DB Lunges', sets: 3, reps: '10 per leg', weight: 0, description: 'Step forward and lower hips.', tip: 'Ensure your knee doesn\'t pass your toes.', muscle: 'Quads/Glutes', equipment: 'Dumbbells' },
      { id: 'ex3-3', name: 'Split Squats', sets: 3, reps: '10 per leg', weight: 0, description: 'One foot elevated behind you.', tip: 'Killer for single leg strength.', muscle: 'Quads', equipment: 'Bench / DB' },
      { id: 'ex3-4', name: 'DB RDLs', sets: 3, reps: '12', weight: 0, description: 'Hinge at hips with DBs.', tip: 'Feel the stretch in your hamstrings.', muscle: 'Hamstrings', equipment: 'Dumbbells' },
      { id: 'ex3-5', name: 'Calf Raises', sets: 4, reps: '20', weight: 0, description: 'Stand on toes and lower.', tip: 'Hold the stretch at the bottom.', muscle: 'Calves', equipment: 'Dumbbells' },
      { id: 'ex3-6', name: 'Plank', sets: 3, reps: '60s', weight: 0, description: 'Hold bridge on elbows.', tip: 'Keep a straight line from head to heels.', muscle: 'Core', equipment: 'Bodyweight' },
      { id: 'ex3-7', name: 'Leg Raises', sets: 3, reps: '15', weight: 0, description: 'Lie on back, raise legs to 90 degrees.', tip: 'Don\'t let your back arch.', muscle: 'Abs', equipment: 'Bodyweight' },
      { id: 'ex3-8', name: 'Russian Twists', sets: 3, reps: '20', weight: 0, description: 'Sit and rotate torso side to side.', tip: 'Touch the floor on each side.', muscle: 'Obliques', equipment: 'Dumbbell' },
    ]
  },
  {
    id: 'w4',
    day: 4, // Thu
    splitType: 'Shoulders & Traps',
    focus: 'Shoulder Breadth & V-Taper',
    duration: '60 min',
    intensity: 'Medium',
    exercises: [
      { id: 'ex4-1', name: 'Seated DB Shoulder Press', sets: 4, reps: '8-10', weight: 0, description: 'Press DBs from shoulders to overhead.', tip: 'Don’t lock your elbows at the top.', muscle: 'Deltoids', equipment: 'Dumbbells' },
      { id: 'ex4-2', name: 'Lateral Raises', sets: 4, reps: '15', weight: 0, description: 'Raise DBs out to the side like wings.', tip: 'Lead with your pinkies for side-delt focus.', muscle: 'Side Delts', equipment: 'Dumbbells' },
      { id: 'ex4-3', name: 'Front DB Raises', sets: 3, reps: '12', weight: 0, description: 'Raise DBs forward to eye level.', tip: 'Stop at eye level; don’t swing.', muscle: 'Front Delts', equipment: 'Dumbbells' },
      { id: 'ex4-4', name: 'Reverse DB Flyes', sets: 3, reps: '15', weight: 0, description: 'Bent over, raise arms out to sides.', tip: 'Targets the rear delts.', muscle: 'Rear Delts', equipment: 'Dumbbells' },
      { id: 'ex4-5', name: 'Upright Rows (DB)', sets: 3, reps: '12', weight: 0, description: 'Pull DBs to chin level.', tip: 'Keep elbows high.', muscle: 'Delts/Traps', equipment: 'Dumbbells' },
      { id: 'ex4-6', name: 'Around the World', sets: 3, reps: '10', weight: 0, description: 'Rotate DBs in a circle.', tip: 'Keep arms straight.', muscle: 'Shoulders', equipment: 'Dumbbells' },
      { id: 'ex4-7', name: 'Arnold Press', sets: 3, reps: '10', weight: 0, description: 'Press with rotation.', tip: 'Full range of motion.', muscle: 'Shoulders', equipment: 'Dumbbells' },
    ]
  },
  {
    id: 'w5',
    day: 5, // Fri
    splitType: 'Upper Body Power',
    focus: 'High Intensity Compound Load',
    duration: '85 min',
    intensity: 'High',
    exercises: [
      { id: 'ex5-1', name: 'DB Bench Press', sets: 4, reps: '6-8', weight: 0, description: 'Heavy chest press for maximum fiber recruitment.', tip: 'Control the eccentric phase.', muscle: 'Chest', equipment: 'Flat Bench / DBs' },
      { id: 'ex5-2', name: 'Bent Over DB Rows', sets: 4, reps: '8', weight: 0, description: 'Double hand row for thick back development.', tip: 'Keep a neutral spine.', muscle: 'Back', equipment: 'Dumbbells' },
      { id: 'ex5-3', name: 'Standing DB Press', sets: 3, reps: '8-10', weight: 0, description: 'Shoulder press without back support.', tip: 'Brace your core hard.', muscle: 'Shoulders', equipment: 'Dumbbells' },
      { id: 'ex5-4', name: 'DB Pulls (Renegade)', sets: 3, reps: '10', weight: 0, description: 'Alternating rows in plank position.', tip: 'Minimize hip rotation.', muscle: 'Back/Core', equipment: 'Dumbbells' },
      { id: 'ex5-5', name: 'Weighted Dips', sets: 3, reps: 'Failure', weight: 0, description: 'Tricep focused dips with DB between feet.', tip: 'Full lockout at the top.', muscle: 'Triceps', equipment: 'Parallel Bars / DB' },
      { id: 'ex5-6', name: 'Incline DB Curls', sets: 3, reps: '12', weight: 0, description: 'Seated at 45 degrees for maximum bicep stretch.', tip: 'No swinging.', muscle: 'Biceps', equipment: 'Incline Bench / DBs' },
      { id: 'ex5-7', name: 'Farmer Walks', sets: 3, reps: '40m', weight: 0, description: 'Walk with heaviest possible DBs.', tip: 'Shoulders back, chest out.', muscle: 'Full Body/Grip', equipment: 'Heavy Dumbbells' },
      { id: 'ex5-8', name: 'Hollow Body Hold', sets: 3, reps: '45s', weight: 0, description: 'Isometric core stability hold.', tip: 'Lower back pinned to floor.', muscle: 'Core', equipment: 'Bodyweight' },
    ]
  },
  {
    id: 'w6',
    day: 6, // Sat
    splitType: 'Active Recovery',
    focus: 'Mobility & Stretching',
    duration: '45 min',
    intensity: 'Low',
    exercises: [
      { id: 'ex6-1', name: 'Walk', sets: 1, reps: '40 min', weight: 0, description: 'Brisk walk outside.', tip: 'Focus on breathing and movement.', muscle: 'Cardio', equipment: 'Treadmill/Outside' },
      { id: 'ex6-2', name: 'Yoga / Stretching', sets: 1, reps: '20 min', weight: 0, description: 'Stretch all major muscles.', tip: 'Hold each stretch for 30 seconds.', muscle: 'Mobility', equipment: 'Mat' },
      { id: 'ex6-3', name: 'Foam Rolling', sets: 1, reps: '10 min', weight: 0, description: 'Roll out legs and back.', tip: 'Find the tight spots.', muscle: 'Recovery', equipment: 'Foam Roller' },
    ]
  },
  {
    id: 'w7',
    day: 0, // Sun
    splitType: 'Rest Day',
    focus: 'Mental & Physical Reset',
    duration: '0 min',
    intensity: 'None',
    exercises: []
  }
];
