// src/hooks/useRandomPlan.js
import { useState } from "react";
import { mockPlans } from "../utils/mockPlans";

const useRandomPlan = () => {
  const [plan, setPlan] = useState(null);
  const generatePlan = () => {
    const random = mockPlans[Math.floor(Math.random() * mockPlans.length)];
    setPlan(random);
  };
  return { plan, generatePlan };
};

export default useRandomPlan;