"use client";

import React from "react";
import { StatusSidebar, useDidVcExplorerState } from "@/components/DidVcExplorerWithStatus";

export default function DidVcExplorerSidebar() {
  const state = useDidVcExplorerState();
  
  return (
    <StatusSidebar
      personalDid={state.personalDid}
      institutionDid={state.institutionDid}
      vc={state.vc}
      verificationResult={state.verificationResult}
      recipientDid={state.recipientDid}
      onReset={state.resetDemo}
    />
  );
}