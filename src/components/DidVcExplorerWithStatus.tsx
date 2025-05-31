"use client";

import React, { useState, useEffect } from "react";
import { Info, CheckCircle } from "lucide-react";

interface StatusSidebarProps {
  personalDid: string | null;
  institutionDid: string | null; 
  vc: string | null;
  verificationResult: { verified: boolean } | null;
  recipientDid: string | null;
  onReset: () => void;
}

export const StatusSidebar: React.FC<StatusSidebarProps> = ({ 
  personalDid, 
  institutionDid, 
  vc, 
  verificationResult,
  recipientDid,
  onReset
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="w-5 h-5" />
          Current Status
        </h3>
        {(personalDid || institutionDid || vc) && (
          <button
            onClick={onReset}
            className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <div className="space-y-3">
        <div className={`p-3 rounded-lg border-2 transition-all ${
          personalDid ? "border-blue-500 bg-blue-500/10" : "border-gray-600"
        }`}>
          <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
            {personalDid ? <CheckCircle className="w-4 h-4 text-blue-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
            Personal DID
          </h4>
          <p className="text-xs text-gray-400">
            {personalDid ? "Generated ✓" : "Not yet generated"}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg border-2 transition-all ${
          institutionDid ? "border-green-500 bg-green-500/10" : "border-gray-600"
        }`}>
          <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
            {institutionDid ? <CheckCircle className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
            Institution DID
          </h4>
          <p className="text-xs text-gray-400">
            {institutionDid ? "Generated ✓" : "Not yet generated"}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg border-2 transition-all ${
          vc ? "border-purple-500 bg-purple-500/10" : "border-gray-600"
        }`}>
          <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
            {vc ? <CheckCircle className="w-4 h-4 text-purple-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
            Credential
          </h4>
          <p className="text-xs text-gray-400">
            {vc ? "Issued ✓" : "Not yet created"}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg border-2 transition-all ${
          verificationResult?.verified ? "border-yellow-500 bg-yellow-500/10" : "border-gray-600"
        }`}>
          <h4 className="font-medium mb-1 flex items-center gap-2 text-sm">
            {verificationResult?.verified ? <CheckCircle className="w-4 h-4 text-yellow-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-500" />}
            Verification
          </h4>
          <p className="text-xs text-gray-400">
            {verificationResult?.verified ? "Verified ✓" : "Not yet verified"}
          </p>
        </div>
      </div>
      
      {/* Show relationships */}
      {vc && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-xs font-medium text-gray-400 mb-2">Cryptographic Relationships:</h4>
          <div className="flex flex-col gap-1 text-xs">
            {institutionDid && (
              <div className="flex items-center gap-2">
                <span className="text-green-400">Institution</span>
                <span className="text-gray-500">→</span>
                <span className="text-purple-400">signs</span>
              </div>
            )}
            {recipientDid && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Credential</span>
                <span className="text-gray-500">→</span>
                <span className="text-blue-400">issued to</span>
              </div>
            )}
            {verificationResult?.verified && (
              <div className="flex items-center gap-2">
                <span className="text-purple-400">Verified</span>
                <span className="text-gray-500">→</span>
                <span className="text-green-400">authentic ✓</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Hook to extract state from DidVcExplorer
export const useDidVcExplorerState = () => {
  const [state, setState] = useState({
    personalDid: null as string | null,
    institutionDid: null as string | null,
    vc: null as string | null,
    verificationResult: null as { verified: boolean } | null,
    recipientDid: null as string | null,
    resetDemo: () => {}
  });

  useEffect(() => {
    // Poll for state changes from the DidVcExplorer component
    const checkState = () => {
      const explorerState = (window as { __didVcExplorerState?: unknown }).__didVcExplorerState as {
        personalDid: string | null;
        institutionDid: string | null;
        vc: string | null;
        verificationResult: { verified: boolean } | null;
        recipientDid: string | null;
        resetDemo: () => void;
      } | undefined;
      if (explorerState) {
        setState(explorerState);
      }
    };

    checkState();
    const interval = setInterval(checkState, 100);

    return () => clearInterval(interval);
  }, []);

  return state;
};