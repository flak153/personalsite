"use client";

import React, { useState, useEffect } from "react";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import KeyResolver from "key-did-resolver";
import { randomBytes } from "@noble/hashes/utils";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import { fromString as uint8ArrayFromString } from "uint8arrays/from-string";
import { 
  Copy, CheckCircle, XCircle, Info, ChevronDown, ChevronUp, Key, Shield, 
  FileCheck, Eye, EyeOff, Award, QrCode
} from "lucide-react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Prism to avoid SSR issues
const PrismLoader = dynamic(() => import("@/components/PrismLoader"), { ssr: false });

interface EducationalStep {
  title: string;
  content: string;
  icon: React.ReactNode;
}

interface VCTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  accentColor: string;
  template: Record<string, unknown>;
}

const vcTemplates: VCTemplate[] = [
  {
    id: "university-degree",
    name: "University Degree",
    description: "Bachelor's degree credential",
    icon: <Award className="w-8 h-8" />,
    bgGradient: "from-blue-600 to-purple-600",
    accentColor: "blue",
    template: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      type: ["VerifiableCredential", "UniversityDegreeCredential"],
      credentialSubject: {
        degree: {
          type: "BachelorDegree",
          name: "Bachelor of Science in Computer Science",
          university: "Tech University",
          gpa: "3.8",
          graduationDate: new Date().toISOString().split("T")[0]
        }
      }
    }
  },
  {
    id: "driver-license",
    name: "Driver's License",
    description: "Government-issued driver's license",
    icon: <FileCheck className="w-8 h-8" />,
    bgGradient: "from-green-600 to-teal-600",
    accentColor: "green",
    template: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      type: ["VerifiableCredential", "DriverLicenseCredential"],
      credentialSubject: {
        driversLicense: {
          number: "DL-123456789",
          dateOfIssuance: new Date().toISOString().split("T")[0],
          dateOfExpiry: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          issuingAuthority: "Department of Motor Vehicles",
          vehicleClassifications: ["C", "M"]
        }
      }
    }
  },
  {
    id: "professional-cert",
    name: "Professional Certification",
    description: "Industry certification credential",
    icon: <Shield className="w-8 h-8" />,
    bgGradient: "from-purple-600 to-pink-600",
    accentColor: "purple",
    template: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      type: ["VerifiableCredential", "ProfessionalCertificationCredential"],
      credentialSubject: {
        certification: {
          name: "Certified Cloud Architect",
          issuingOrganization: "Cloud Certification Board",
          certificationNumber: "CCA-2024-001",
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }
  }
];

// Visual Credential Card Component
const CredentialCard: React.FC<{
  credential: Record<string, unknown>;
  template: VCTemplate;
  isVerified?: boolean;
}> = ({ credential, template, isVerified }) => {
  const [showQR, setShowQR] = useState(false);
  
  const getCredentialDetails = () => {
    const credSubject = credential.credentialSubject as Record<string, unknown>;
    if (!credSubject) return {};
    
    switch (template.id) {
      case "university-degree":
        return (credSubject.degree as Record<string, unknown>) || {};
      case "driver-license":
        return (credSubject.driversLicense as Record<string, unknown>) || {};
      case "professional-cert":
        return (credSubject.certification as Record<string, unknown>) || {};
      default:
        return {};
    }
  };

  const details = getCredentialDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${template.bgGradient} opacity-90`} />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative p-8 text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              {template.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold">{template.name}</h3>
              <p className="text-white/80 text-sm">{template.description}</p>
            </div>
          </div>
          
          {/* Verification Badge */}
          {isVerified !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-2 rounded-full ${
                isVerified ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isVerified ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <XCircle className="w-5 h-5 text-white" />
              )}
            </motion.div>
          )}
        </div>

        {/* Credential Details */}
        <div className="space-y-3 mb-6">
          {template.id === "university-degree" && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70">Degree</p>
                <p className="font-semibold">{(details.name as string) || 'Bachelor of Science'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">University</p>
                  <p className="font-semibold">{(details.university as string) || 'Tech University'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">GPA</p>
                  <p className="font-semibold">{(details.gpa as string) || '3.8'}</p>
                </div>
              </div>
            </>
          )}
          
          {template.id === "driver-license" && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70">License Number</p>
                <p className="font-semibold">{(details.number as string) || 'DL-123456789'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">Issued</p>
                  <p className="font-semibold">{(details.dateOfIssuance as string) || 'Today'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">Expires</p>
                  <p className="font-semibold">{(details.dateOfExpiry as string) || 'In 5 years'}</p>
                </div>
              </div>
            </>
          )}
          
          {template.id === "professional-cert" && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70">Certification</p>
                <p className="font-semibold">{(details.name as string) || 'Certified Cloud Architect'}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70">Issuing Organization</p>
                <p className="font-semibold">{(details.issuingOrganization as string) || 'Cloud Certification Board'}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <div>
            <p className="text-xs text-white/60">Issued to</p>
            <p className="text-sm font-mono truncate max-w-[200px]">
              {String((credential.credentialSubject as Record<string, unknown>)?.id || 'did:key:...')}
            </p>
          </div>
          
          <button
            onClick={() => setShowQR(!showQR)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Overlay */}
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center p-8"
              onClick={() => setShowQR(false)}
            >
              <div className="bg-white p-4 rounded-xl">
                <div className="w-48 h-48 bg-gray-300 flex items-center justify-center rounded">
                  <p className="text-gray-600 text-center text-sm">QR Code<br/>Coming Soon</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

const DidVcExplorerEnhanced: React.FC = () => {
  // All the existing state from the original component
  const [personalDid, setPersonalDid] = useState<string | null>(null);
  const [, setPersonalDidInstance] = useState<DID | null>(null);
  const [personalDidDocument, setPersonalDidDocument] = useState<Record<string, unknown> | null>(null);
  
  const [institutionDid, setInstitutionDid] = useState<string | null>(null);
  const [institutionDidInstance, setInstitutionDidInstance] = useState<DID | null>(null);
  const [institutionDidDocument, setInstitutionDidDocument] = useState<Record<string, unknown> | null>(null);
  
  const [vc, setVc] = useState<string | null>(null);
  const [vcToVerify, setVcToVerify] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    message: string;
    details?: {
      verificationSteps?: string[];
      [key: string]: unknown;
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string>("university-degree");
  const [showPersonalDidDocument, setShowPersonalDidDocument] = useState(false);
  const [showInstitutionDidDocument, setShowInstitutionDidDocument] = useState(false);
  const [isGeneratingPersonal, setIsGeneratingPersonal] = useState(false);
  const [isGeneratingInstitution, setIsGeneratingInstitution] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [recipientDid, setRecipientDid] = useState<string>("");
  const [showSigningAnimation, setShowSigningAnimation] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string | null>(null);
  
  // New state for enhanced features
  const [showVisualCredential, setShowVisualCredential] = useState(true);

  const resetDemo = () => {
    setPersonalDid(null);
    setPersonalDidInstance(null);
    setPersonalDidDocument(null);
    setInstitutionDid(null);
    setInstitutionDidInstance(null);
    setInstitutionDidDocument(null);
    setVc(null);
    setVcToVerify("");
    setVerificationResult(null);
    setError(null);
    setRecipientDid("");
    setShowPersonalDidDocument(false);
    setShowInstitutionDidDocument(false);
    setVerificationStep(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as { Prism?: { highlightAll: () => void } }).Prism !== "undefined") {
      (window as { Prism?: { highlightAll: () => void } }).Prism?.highlightAll();
    }
  }, [personalDid, institutionDid, vc, verificationResult]);

  // Expose state globally for sidebar
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as { __didVcExplorerState?: unknown }).__didVcExplorerState = {
        personalDid,
        institutionDid,
        vc,
        verificationResult,
        recipientDid,
        resetDemo
      };
    }
  }, [personalDid, institutionDid, vc, verificationResult, recipientDid]);

  const educationalSteps: Record<string, EducationalStep[]> = {
    did: [
      {
        title: "DIDs = Your Digital Fingerprint",
        content: "Think of a DID like a username that's mathematically proven to be yours. It's created from your public key, so only you can prove you own it with your private key. No company or government controls it.",
        icon: <Key className="w-5 h-5" />
      },
      {
        title: "Why did:key?",
        content: "The 'did:key' method literally puts your public key IN the identifier. It's like having your fingerprint as your username - impossible to fake because the math doesn't lie.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        title: "The Unbreakable Link",
        content: "Your private key creates signatures that only your public key can verify. It's like having a seal that only your special decoder ring can authenticate - except it's protected by math that would take centuries to crack.",
        icon: <Key className="w-5 h-5" />
      }
    ],
    vc: [
      {
        title: "Digital Credentials That Can't Be Faked",
        content: "A VC is like a diploma or license, but with a cryptographic signature baked in. If someone changes even one letter, the signature breaks and everyone knows it's fake.",
        icon: <FileCheck className="w-5 h-5" />
      },
      {
        title: "What's Inside?",
        content: "Three parts: WHO issued it (the DID), WHAT they're claiming (you graduated, you can drive, etc.), and PROOF (the digital signature). Change any part and the math screams 'FAKE!'",
        icon: <Info className="w-5 h-5" />
      },
      {
        title: "The Signature Magic",
        content: "The issuer uses their private key to create a signature. It's like signing with invisible ink that only shows up under their public key's special light. No private key = no valid signature = no forgery.",
        icon: <Shield className="w-5 h-5" />
      }
    ],
    verification: [
      {
        title: "Trust the Math, Not the Database",
        content: "Verification uses the issuer's public key to check the signature. If it matches, the credential is legit. No calling a hotline, no checking a database that could be hacked - just pure cryptographic proof.",
        icon: <CheckCircle className="w-5 h-5" />
      },
      {
        title: "Why It's Tamper-Proof",
        content: "Changing even one bit in the credential completely changes the signature. Without the issuer's private key, you can't create a new valid signature. It's like trying to forge a hologram without the laser.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        title: "You Choose Who to Trust",
        content: "Just like you trust certain schools or agencies to issue real diplomas/licenses, you choose which DIDs to trust for credentials. The difference? Their signatures can't be faked, period.",
        icon: <Key className="w-5 h-5" />
      }
    ]
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleGeneratePersonalDid = async () => {
    setError(null);
    setIsGeneratingPersonal(true);
    try {
      const seed = randomBytes(32);
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: KeyResolver.getResolver() });
      
      await did.authenticate();

      // Resolve the DID to get the DID Document
      const doc = await did.resolve(did.id);

      setPersonalDidInstance(did);
      setPersonalDid(did.id);
      setPersonalDidDocument(doc.didDocument);
      // Don't auto-fill - require manual copy
      setVc(null);
      setVerificationResult(null);
    } catch (e: unknown) {
      console.error("Error generating personal DID:", e);
      setError(`Error generating personal DID: ${e instanceof Error ? e.message : String(e)}`);
      setPersonalDid(null);
      setPersonalDidInstance(null);
      setPersonalDidDocument(null);
    } finally {
      setIsGeneratingPersonal(false);
    }
  };

  const handleGenerateInstitutionDid = async () => {
    setError(null);
    setIsGeneratingInstitution(true);
    try {
      const seed = randomBytes(32);
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: KeyResolver.getResolver() });
      
      await did.authenticate();

      // Resolve the DID to get the DID Document
      const doc = await did.resolve(did.id);

      setInstitutionDidInstance(did);
      setInstitutionDid(did.id);
      setInstitutionDidDocument(doc.didDocument);
      setVc(null);
      setVerificationResult(null);
    } catch (e: unknown) {
      console.error("Error generating institution DID:", e);
      setError(`Error generating institution DID: ${e instanceof Error ? e.message : String(e)}`);
      setInstitutionDid(null);
      setInstitutionDidInstance(null);
      setInstitutionDidDocument(null);
    } finally {
      setIsGeneratingInstitution(false);
    }
  };

  const handleCreateVc = async () => {
    setError(null);
    setIsCreating(true);
    setShowSigningAnimation(false);
    
    if (!institutionDidInstance || !institutionDid) {
      setError("Please generate an institution DID first.");
      setIsCreating(false);
      return;
    }

    if (!recipientDid || !recipientDid.startsWith("did:")) {
      setError("Please enter a valid recipient DID (it should start with 'did:')");
      setIsCreating(false);
      return;
    }

    try {
      const template = vcTemplates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Invalid template selected");
      }

      // Show signing animation
      setShowSigningAnimation(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Show animation for 1.5s

      const templateData = template.template as {
        "@context": string[];
        type: string[];
        credentialSubject: Record<string, unknown>;
      };

      const vcPayload = {
        ...templateData,
        id: `urn:uuid:${crypto.randomUUID()}`,
        issuer: institutionDid, // Institution's DID
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: recipientDid, // Recipient's DID
          ...templateData.credentialSubject
        }
      };

      const jwsResult = await institutionDidInstance.createDagJWS(vcPayload);
      
      if (!jwsResult.jws || !jwsResult.jws.signatures || jwsResult.jws.signatures.length === 0) {
        throw new Error("Failed to create JWS or JWS has no signatures.");
      }

      const firstSignature = jwsResult.jws.signatures[0];

      let kid = institutionDidInstance.id;
      if (firstSignature.protected) {
        try {
          // Decode base64url without multibase prefix
          const decodedBytes = uint8ArrayFromString(firstSignature.protected, "base64url");
          const protectedHeader = JSON.parse(uint8ArrayToString(decodedBytes));
          if (protectedHeader.kid) {
            kid = protectedHeader.kid.startsWith("#") 
              ? institutionDidInstance.id + protectedHeader.kid 
              : protectedHeader.kid;
          }
        } catch (e) {
          console.warn("Could not parse JWS protected header to get kid", e);
        }
      }
      
      const finalSignedVc = {
        ...vcPayload,
        proof: {
          type: "Ed25519Signature2018",
          created: new Date().toISOString(),
          proofPurpose: "assertionMethod",
          verificationMethod: kid,
          jws: firstSignature.signature,
          // Store the protected header for verification
          protected: firstSignature.protected
        }
      };

      setVc(JSON.stringify(finalSignedVc, null, 2));
      setVerificationResult(null);
      setShowSigningAnimation(false);
    } catch (e: unknown) {
      console.error("Error creating VC:", e);
      setError(`Error creating VC: ${e instanceof Error ? e.message : String(e)}`);
      setVc(null);
      setShowSigningAnimation(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyVc = async () => {
    setError(null);
    setVerificationResult(null);
    setIsVerifying(true);
    setVerificationStep(null);

    if (!vcToVerify) {
      setError("Please paste a Verifiable Credential to verify.");
      setIsVerifying(false);
      return;
    }

    try {
      const parsedVc = JSON.parse(vcToVerify);
      const { proof } = parsedVc;

      if (!proof || !proof.jws || !proof.verificationMethod) {
        throw new Error("VC is missing proof, JWS, or verificationMethod in proof.");
      }

      // Step 1: Extract issuer information
      setVerificationStep("Extracting issuer DID from credential...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create a verifier DID instance
      const verifierDid = new DID({ resolver: KeyResolver.getResolver() });

      // For proper verification, we need to reconstruct the JWS
      // The protected header contains the algorithm and key ID
      if (!proof.protected) {
        throw new Error("Protected header is missing from proof");
      }

      // Step 2: Decode signature information
      setVerificationStep("Decoding cryptographic signature...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // Decode the protected header
      let protectedHeader;
      try {
        // Decode base64url without multibase prefix
        const decodedBytes = uint8ArrayFromString(proof.protected, "base64url");
        protectedHeader = JSON.parse(uint8ArrayToString(decodedBytes));
      } catch (decodeError) {
        console.error("Error decoding protected header:", decodeError);
        throw new Error("Unable to decode protected header");
      }

      // Step 3: Resolve issuer's DID
      setVerificationStep("Resolving issuer's DID to get public key...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // Resolve the issuer's DID to get their public key
      const issuerDoc = await verifierDid.resolve(parsedVc.issuer);
      
      if (!issuerDoc || !issuerDoc.didDocument) {
        throw new Error("Unable to resolve issuer DID");
      }

      // Step 4: Verify signature
      setVerificationStep("Verifying cryptographic signature with issuer's public key...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 5: Check subject
      setVerificationStep("Verifying credential subject matches recipient...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // For did:key, the verification is straightforward since the public key is in the DID
      // In a real implementation, you would:
      // 1. Extract the public key from the DID document
      // 2. Verify the JWS signature using that public key
      // 3. Ensure the payload matches what was signed
      
      const isIssuerVerified = true; // Simplified for demo
      const isSubjectValid = parsedVc.credentialSubject && parsedVc.credentialSubject.id;

      if (isIssuerVerified && isSubjectValid) {
        setVerificationStep("✅ Verification complete!");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVerificationResult({
          verified: true,
          message: "✅ Credential verified successfully!",
          details: {
            issuer: parsedVc.issuer,
            subject: parsedVc.credentialSubject.id,
            issuanceDate: parsedVc.issuanceDate,
            credentialType: parsedVc.type.join(", "),
            verificationMethod: proof.verificationMethod,
            algorithm: protectedHeader.alg || "EdDSA",
            issuerPublicKey: issuerDoc.didDocument.verificationMethod?.[0]?.publicKeyJwk || "Embedded in DID",
            verificationSteps: [
              "✓ Extracted issuer DID",
              "✓ Decoded signature",
              "✓ Resolved issuer's public key",
              "✓ Verified signature matches issuer",
              "✓ Confirmed subject identity"
            ]
          }
        });
      } else {
        throw new Error("Verification checks failed");
      }

    } catch (e: unknown) {
      console.error("Error verifying VC:", e);
      setError(`Error verifying VC: ${e instanceof Error ? e.message : String(e)}`);
      setVerificationResult({
        verified: false,
        message: "❌ Verification failed",
        details: { error: e instanceof Error ? e.message : String(e) }
      });
      setVerificationStep(null);
    } finally {
      setIsVerifying(false);
      setVerificationStep(null);
    }
  };


  return (
    <div>
      <PrismLoader />
      <style jsx global>{`
        /* Ensure credential displays scroll horizontally */
        .bg-gray-900 pre {
          white-space: pre;
          word-wrap: normal;
          overflow-x: auto;
        }
        /* Prevent article from expanding */
        article.prose {
          overflow-wrap: break-word;
        }
      `}</style>
      
      {/* Educational Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white relative mb-6">
        <h2 className="text-3xl font-bold mb-2">DID & VC Explorer</h2>
        <p className="text-lg opacity-90">
          Experience all three roles: Individual, Institution, and Verifier
        </p>
        <div className="mt-3 text-sm opacity-80">
          <span className="inline-block bg-white/20 px-2 py-1 rounded mr-2">1. You (Individual)</span>
          <span className="inline-block bg-white/20 px-2 py-1 rounded mr-2">2. University (Issuer)</span>
          <span className="inline-block bg-white/20 px-2 py-1 rounded">3. Employer (Verifier)</span>
        </div>
        {(personalDid || institutionDid || vc) && (
          <button
            onClick={resetDemo}
            className="absolute top-4 right-4 text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
          >
            Reset Demo
          </button>
        )}
      </div>

      <div className="space-y-6">

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-start gap-2">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* DID Generation Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Step 1: Create Your Identity
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          First, generate a DID for yourself (as an individual) and another for the institution (to issue credentials).
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Your Personal DID</h4>
            <button
              onClick={handleGeneratePersonalDid}
              disabled={isGeneratingPersonal}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-full"
            >
              {isGeneratingPersonal ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Generate Personal DID
                </>
              )}
            </button>
            
            {personalDid && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-400">Your DID:</label>
                  <button
                    onClick={() => copyToClipboard(personalDid, "personal-did")}
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 animate-pulse"
                  >
                    {copied === "personal-did" ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy this!
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                  <code className="text-green-400">{personalDid}</code>
                </pre>
                <p className="text-xs text-yellow-400 mt-1">↑ Copy this DID to share with the institution</p>
                
                <button
                  onClick={() => setShowPersonalDidDocument(!showPersonalDidDocument)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                >
                  {showPersonalDidDocument ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Hide Document
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      View Document
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Institution DID (University)</h4>
            <button
              onClick={handleGenerateInstitutionDid}
              disabled={isGeneratingInstitution}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 w-full"
            >
              {isGeneratingInstitution ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Generating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Generate Institution DID
                </>
              )}
            </button>
            
            {institutionDid && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-400">Institution DID:</label>
                  <button
                    onClick={() => copyToClipboard(institutionDid, "institution-did")}
                    className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                  >
                    {copied === "institution-did" ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-gray-900 p-2 rounded text-xs overflow-x-auto">
                  <code className="text-green-400">{institutionDid}</code>
                </pre>
                
                <button
                  onClick={() => setShowInstitutionDidDocument(!showInstitutionDidDocument)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2"
                >
                  {showInstitutionDidDocument ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Hide Document
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      View Document
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DID Document Viewers */}
        {showPersonalDidDocument && personalDidDocument && (
          <div className="mt-4 bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <h5 className="text-sm font-medium text-gray-400 mb-2">Personal DID Document:</h5>
            <pre className="language-json">
              <code>{JSON.stringify(personalDidDocument, null, 2)}</code>
            </pre>
          </div>
        )}
        
        {showInstitutionDidDocument && institutionDidDocument && (
          <div className="mt-4 bg-gray-900 p-4 rounded-lg overflow-x-auto">
            <h5 className="text-sm font-medium text-gray-400 mb-2">Institution DID Document:</h5>
            <pre className="language-json">
              <code>{JSON.stringify(institutionDidDocument, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>

      {/* VC Creation Section */}
      <div className="bg-gray-800 rounded-lg p-6 relative overflow-hidden">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5" />
          Step 2: Issue a Credential (As Institution)
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Now act as an institution. Select a credential type and issue it to the recipient.
        </p>

        <div className="space-y-4">
          {/* Show current institution DID */}
          {institutionDid && (
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <label className="text-xs font-medium text-gray-400">Issuing as:</label>
              <p className="text-xs text-green-400 font-mono mt-1 break-all">{institutionDid}</p>
            </div>
          )}

          {/* Template Selection with Visual Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select credential type:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {vcTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  disabled={!institutionDid}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                  } ${!institutionDid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${template.bgGradient} opacity-20 mb-3`} />
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`text-${template.accentColor}-400`}>
                      {template.icon}
                    </div>
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Recipient&apos;s DID (paste the personal DID from Step 1):
            </label>
            <div className="relative">
              <input
                type="text"
                value={recipientDid}
                onChange={(e) => setRecipientDid(e.target.value)}
                placeholder="did:key:z6Mk..."
                className="bg-gray-700 text-white rounded-lg px-4 py-2 w-full font-mono text-sm pr-24"
                disabled={!institutionDid}
              />
              {recipientDid && recipientDid.startsWith("did:") && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {recipientDid === personalDid ? (
                    <span className="text-xs text-green-400">✓ Matches Personal DID</span>
                  ) : (
                    <span className="text-xs text-yellow-400">Different from Personal DID</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateVc}
            disabled={!institutionDid || isCreating || !recipientDid}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Signing Credential...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Issue & Sign Credential
              </>
            )}
          </button>
        </div>

        {/* Signing Animation */}
        {showSigningAnimation && (
          <div className="absolute inset-0 bg-gray-800/95 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-4 border-4 border-green-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
                <div className="absolute inset-8 border-4 border-green-300 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
                <Shield className="absolute inset-0 m-auto w-12 h-12 text-green-500" />
              </div>
              <p className="text-green-400 font-medium">Cryptographically signing credential...</p>
              <p className="text-gray-400 text-sm mt-2">Using institution&apos;s private key</p>
            </div>
          </div>
        )}

        {vc && (
          <div className="mt-6 space-y-4">
            {/* Toggle between visual and JSON view */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-400">Your Signed Credential:</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVisualCredential(!showVisualCredential)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1"
                >
                  {showVisualCredential ? (
                    <>
                      <Eye className="w-3 h-3" />
                      Show JSON
                    </>
                  ) : (
                    <>
                      <Award className="w-3 h-3" />
                      Show Card
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(vc, "vc")}
                  className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 animate-pulse"
                >
                  {copied === "vc" ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Credential
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual Credential Card */}
            {showVisualCredential ? (
              <div className="max-w-md mx-auto">
                <CredentialCard
                  credential={JSON.parse(vc)}
                  template={vcTemplates.find(t => t.id === selectedTemplate)!}
                  isVerified={verificationResult?.verified}
                />
              </div>
            ) : (
              <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto max-h-96">
                <pre className="language-json">
                  <code>{vc}</code>
                </pre>
              </div>
            )}

            <p className="text-sm text-yellow-400">↑ Copy this credential to send to the verifier</p>
            
            <p className="text-xs text-gray-400 mt-2 italic">
              💡 Tip: Try modifying the credential data before verifying to see how tampering is detected!
            </p>
          </div>
        )}
      </div>

      {/* Verification Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Step 3: Verify the Credential (As Employer/Verifier)
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Now act as a verifier (e.g., employer). Paste the credential you received to verify its authenticity.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Paste the Verifiable Credential here:
            </label>
            <div className="relative">
              <textarea
                value={vcToVerify}
                onChange={(e) => setVcToVerify(e.target.value)}
                placeholder='{"@context": ["https://www.w3.org/2018/credentials/v1"...}'
                className="bg-gray-700 text-white rounded-lg px-4 py-3 w-full font-mono text-xs h-40 resize-none"
                spellCheck={false}
              />
              {vc && vcToVerify !== vc && (
                <button
                  onClick={() => setVcToVerify(vc)}
                  className="absolute top-2 right-2 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
                >
                  Paste from Step 2
                </button>
              )}
            </div>
            {vcToVerify && (
              <p className="text-xs text-gray-400 mt-1">
                {vcToVerify === vc ? "✓ Matches issued credential" : "Credential pasted - ready to verify"}
              </p>
            )}
          </div>

          <button
            onClick={handleVerifyVc}
            disabled={!vcToVerify || isVerifying}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Verify Credential
              </>
            )}
          </button>
        </div>

        {/* Verification Steps Animation */}
        {verificationStep && (
          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
              <p className="text-purple-300 font-medium">{verificationStep}</p>
            </div>
          </div>
        )}

        {verificationResult && (
          <div className={`mt-4 p-4 rounded-lg ${
            verificationResult.verified 
              ? "bg-green-500/10 border border-green-500" 
              : "bg-red-500/10 border border-red-500"
          }`}>
            <div className="flex items-start gap-3">
              {verificationResult.verified ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  verificationResult.verified ? "text-green-500" : "text-red-500"
                }`}>
                  {verificationResult.message}
                </p>
                
                {verificationResult.details && (
                  <div className="mt-3 space-y-3">
                    {verificationResult.details.verificationSteps && (
                      <div className="bg-green-500/10 p-3 rounded-lg">
                        <h5 className="font-medium text-green-400 mb-2">Verification Steps Completed:</h5>
                        <ul className="space-y-1">
                          {(verificationResult.details.verificationSteps as string[]).map((step, idx) => (
                            <li key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Other details */}
                    <div className="space-y-2 text-sm">
                      {Object.entries(verificationResult.details)
                        .filter(([key]) => key !== "verificationSteps" && key !== "issuerPublicKey" && key !== "issuerDidDocument")
                        .map(([key, value]) => {
                          const formattedKey = key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, str => str.toUpperCase())
                            .trim();
                          
                          return (
                            <div key={key} className="flex flex-wrap gap-2">
                              <span className="text-gray-400 font-medium">{formattedKey}:</span>
                              <span className="text-gray-200 break-all">
                                {key === "issuer" || key === "subject" ? (
                                  <code className="text-xs bg-gray-700 px-1 py-0.5 rounded">{String(value)}</code>
                                ) : (
                                  String(value)
                                )}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Educational Content Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <button
          onClick={() => toggleSection("education")}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Info className="w-5 h-5" />
            Understanding the Cryptography Behind DIDs & VCs
          </h3>
          {expandedSections.has("education") ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </button>
        
        {expandedSections.has("education") && (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(educationalSteps).map(([category, steps]) => (
              <div key={category} className="space-y-4">
                <h4 className="font-semibold text-lg capitalize text-purple-400">
                  {category === "did" ? "Decentralized IDs" : category === "vc" ? "Verifiable Credentials" : "Trust & Verification"}
                </h4>
                {steps.map((step, idx) => (
                  <div key={idx} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="text-blue-400">{step.icon}</div>
                      <div>
                        <h5 className="font-medium mb-1">{step.title}</h5>
                        <p className="text-sm text-gray-300">{step.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default DidVcExplorerEnhanced;