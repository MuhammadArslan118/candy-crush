import { Level } from "../types";

export const levels: Level[] = [
  {
    number: 1,
    targetScore: 1000,
    moves: 15,
    background: "from-purple-400 to-pink-500",
  },
  {
    number: 2,
    targetScore: 2000,
    moves: 12,
    specialGoal: {
      type: "🍬",
      count: 10,
    },
    background: "from-blue-400 to-purple-500",
  },
  {
    number: 3,
    targetScore: 3000,
    moves: 10,
    specialGoal: {
      type: "🍭",
      count: 8,
    },
    background: "from-green-400 to-blue-500",
  },
  {
    number: 4,
    targetScore: 5000,
    moves: 8,
    specialGoal: {
      type: "🧁",
      count: 5,
    },
    background: "from-yellow-400 to-red-500",
  },
  {
    number: 5,
    targetScore: 8000,
    moves: 10,
    specialGoal: {
      type: "🧁",
      count: 8,
    },
    background: "from-blue-400 to-red-500",
  },
];
