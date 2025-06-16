"use client";

import DecisionTree from "./DecisionTree";
import { engineeringDecisionTreeData } from "@/data/engineeringDecisionTree";

export default function EngineeringDecisionTree() {
  return (
    <DecisionTree
      title="Engineering Decision Tree"
      data={engineeringDecisionTreeData}
      startId="start"
    />
  );
}