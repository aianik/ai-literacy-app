// Likert-scale items from the validated AI Literacy Scale
// Factor 1: Functional Knowledge of AI Systems (11 items)
// Factor 2: AI in Society (8 items)
export const likertItems = [
  { id: 'l1',  factor: 1, text: 'I can differentiate between narrow AI and general AI.' },
  { id: 'l2',  factor: 1, text: 'I understand the process of programming AI applications.' },
  { id: 'l3',  factor: 1, text: 'I understand the process of training AI applications using data.' },
  { id: 'l4',  factor: 1, text: 'I am capable of programming a basic AI application.' },
  { id: 'l5',  factor: 1, text: 'I can clearly articulate the strengths of current AI systems.' },
  { id: 'l6',  factor: 1, text: 'I have a clear understanding of neural networks as a model in AI.' },
  { id: 'l7',  factor: 1, text: 'I can explain how AI systems make decisions based on learned patterns.' },
  { id: 'l8',  factor: 1, text: 'I am confident in my ability to analyze data used in AI training.' },
  { id: 'l9',  factor: 1, text: 'I can thoroughly explain the machine learning process and its components.' },
  { id: 'l10', factor: 1, text: 'I am capable of critically evaluating training data for inaccuracies.' },
  { id: 'l11', factor: 1, text: 'I understand the role of sensors in AI systems.' },
  { id: 'l12', factor: 2, text: 'I am aware that AI decisions can reflect biases present in their training data.' },
  { id: 'l13', factor: 2, text: 'I recognize that the capabilities and limitations of AI systems are shaped by what they learn from data.' },
  { id: 'l14', factor: 2, text: 'I am aware that AI systems can effectively respond to human inputs in real-time.' },
  { id: 'l15', factor: 2, text: 'I recognize the importance of collaboration across disciplines for improving human-AI interaction.' },
  { id: 'l16', factor: 2, text: 'I am aware of the ethical challenges associated with AI development.' },
  { id: 'l17', factor: 2, text: 'I recognize that existing regulations play a role in addressing ethical concerns in AI development.' },
  { id: 'l18', factor: 2, text: 'I understand how AI systems adapt based on inputs from humans.' },
  { id: 'l19', factor: 2, text: 'I can describe the role of humans in influencing AI systems.' },
]

// Multiple-choice items — correct answer index is 0-based
export const mcqItems = [
  {
    id: 'm1',
    text: 'What is one of the primary characteristics of intelligence?',
    options: [
      'Following preset commands',
      'The ability to learn and adapt',
      'Memorizing large amounts of information',
      'Moving objects with precision',
    ],
    correct: 1,
  },
  {
    id: 'm2',
    text: 'What convinces us that an AI is intelligent?',
    options: [
      'The ability to walk and talk',
      'The presence of an artificial brain',
      'Being at least as intelligent as humans',
      'Acting rationally to achieve specific goals effectively',
    ],
    correct: 3,
  },
  {
    id: 'm3',
    text: 'Which statement best describes narrow AI?',
    options: [
      'A system capable of solving diverse problems across multiple domains',
      'A system designed to address a single, specific problem',
      'A speculative future AI that mimics human thought processes',
      'An AI capable of performing any task as effectively as humans',
    ],
    correct: 1,
  },
  {
    id: 'm4',
    text: 'What is something narrow AI is unable to do?',
    options: [
      'Make decisions under uncertain conditions',
      'Perform a wide range of tasks across different domains',
      'Solve a task with greater efficiency than a human',
      'Learn from unstructured data',
    ],
    correct: 1,
  },
  {
    id: 'm5',
    text: 'In which task is AI already outperforming humans?',
    options: [
      'Accurately detecting tumors in medical imaging',
      'Programming complex software',
      'Translating lengthy novels',
      'Designing innovative cancer treatments',
    ],
    correct: 0,
  },
  {
    id: 'm6',
    text: 'In which domain do humans still outperform AI?',
    options: [
      'Predicting extreme weather events from data',
      'Proving mathematical theorems',
      'Answering factual quiz questions',
      'Playing poker',
    ],
    correct: 1,
  },
  {
    id: 'm7',
    text: 'Which data structure is most commonly used in AI systems?',
    options: [
      'Flowcharts that map out decision-making processes',
      'Neural networks that simulate interconnected brain-like structures',
      'Pie charts for visualizing datasets',
      'Tables that organize raw data in rows and columns',
    ],
    correct: 1,
  },
  {
    id: 'm8',
    text: 'How does AI decision-making differ from human decision-making?',
    options: [
      'AI is entirely logic-based',
      'AI relies on learned patterns and lacks emotional influence in decision-making',
      'AI is capable of creativity and intuition',
      'AI always makes faster decisions than humans',
    ],
    correct: 1,
  },
  {
    id: 'm9',
    text: 'What distinguishes supervised learning from unsupervised learning?',
    options: [
      'In supervised learning, the output values of the training data are known',
      'In supervised learning, humans continuously supervise the training process',
      'In supervised learning, all steps are fully documented',
      'Supervised learning is subject to stricter legal regulations',
    ],
    correct: 0,
  },
  {
    id: 'm10',
    text: 'At which stage can humans influence the outcomes of machine learning?',
    options: [
      'By calculating prediction accuracy',
      'By randomly splitting data into training and testing sets',
      'By selecting the model used in the learning process',
      'By abstracting the structure of the model',
    ],
    correct: 2,
  },
  {
    id: 'm11',
    text: 'What is essential for training a machine learning model?',
    options: [
      'Large amounts of diverse data',
      'High-speed internet',
      'Simple handcrafted rules',
      'Constant human supervision',
    ],
    correct: 0,
  },
  {
    id: 'm12',
    text: 'What is the primary benefit of using data visualizations?',
    options: [
      'Storing data effectively',
      'Preparing images for recognition tasks',
      'Conveying insights and clearly communicating results',
      'Performing statistical tests',
    ],
    correct: 2,
  },
  {
    id: 'm13',
    text: 'Why do machine learning systems produce strong results?',
    options: [
      'They are extremely powerful in computation',
      'They think like humans, but faster',
      'They analyze large datasets to identify patterns and improve models',
      'They are based on expert systems with stored knowledge',
    ],
    correct: 2,
  },
  {
    id: 'm14',
    text: 'You observe that a machine learning model is better at recognizing cats than dogs. What could explain this difference?',
    options: [
      'There are fewer online images of dogs compared to cats, making them harder to identify',
      'Smaller animals like cats are inherently easier for models to recognize than larger ones like dogs',
      'Most machine learning models are naturally better at recognizing cats',
      'The training data for dogs was not diverse or representative of all dog breeds',
    ],
    correct: 3,
  },
  {
    id: 'm15',
    text: 'Which statement accurately describes the machine learning process?',
    options: [
      'It is grounded in behaviorist learning theories',
      'It is an iterative process that involves repeated refinement',
      'Supervised and unsupervised learning follow identical steps',
      'The process can be reversed to generate artificial datasets',
    ],
    correct: 1,
  },
  {
    id: 'm16',
    text: 'What should be considered when splitting data into training and test sets?',
    options: [
      'Ensure the datasets are equal in size',
      'Randomly divide the data into training and test sets',
      'Use higher-quality data for the test set than the training set',
      'Ensure training and test data are as distinct as possible',
    ],
    correct: 1,
  },
  {
    id: 'm17',
    text: 'Which is a common ethical concern related to AI?',
    options: [
      'The speed of AI systems',
      'Bias and fairness in AI decision-making',
      "AI's limitations in performing calculations",
      'The programming languages used to develop AI',
    ],
    correct: 1,
  },
  {
    id: 'm18',
    text: 'Which societal challenge is frequently associated with AI?',
    options: [
      'Lack of investment in education systems',
      "Shortages of computer chips due to AI's computational demands",
      'High error rates in AI-powered manufacturing processes',
      'Displacement of human workers by AI systems',
    ],
    correct: 3,
  },
]
