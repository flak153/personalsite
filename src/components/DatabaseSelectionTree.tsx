"use client";

import DecisionTree from "./DecisionTree";
import { databaseDecisionTreeData } from "@/data/databaseDecisionTree";

export default function DatabaseSelectionTree() {
  return (
    <DecisionTree
      title="Database Selection Guide"
      data={databaseDecisionTreeData}
      startId="start"
    />
  );
}