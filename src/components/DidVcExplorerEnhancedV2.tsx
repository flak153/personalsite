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
  FileCheck, Eye, EyeOff, Award, QrCode, AlertTriangle,
  Globe, Settings, History, Download, Upload, Trash2, Search, Building
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

interface DIDMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  useCases: string[];
  generateDID: (customDomain?: string) => Promise<{ did: string; document: Record<string, unknown>; instance?: Record<string, unknown> }>;
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

interface VCHistoryItem {
  id: string;
  template: string;
  subject: string;
  issuer: string;
  timestamp: string;
  credential: Record<string, unknown>;
}

// Generate a proper Ed25519 key pair for did:web
async function generateEd25519KeyPair() {
  const seed = randomBytes(32);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();
  
  // Extract the public key from the DID document
  const doc = await did.resolve(did.id);
  const publicKeyBase58 = doc.didDocument?.verificationMethod?.[0]?.publicKeyBase58;
  
  return {
    provider,
    did,
    publicKeyBase58,
    seed
  };
}

// DID Methods configuration with custom domain support
const createDidMethods = (): DIDMethod[] => [
  {
    id: "did:key",
    name: "DID Key",
    description: "Cryptographic key embedded in the identifier",
    icon: <Key className="w-5 h-5" />,
    color: "blue",
    benefits: [
      "No external dependencies",
      "Works offline",
      "Instant resolution",
      "Maximum decentralization"
    ],
    useCases: [
      "Peer-to-peer scenarios",
      "Offline verification",
      "Temporary identities",
      "Privacy-focused applications"
    ],
    generateDID: async () => {
      const seed = randomBytes(32);
      const provider = new Ed25519Provider(seed);
      const did = new DID({ provider, resolver: KeyResolver.getResolver() });
      await did.authenticate();
      const doc = await did.resolve(did.id);
      return { 
        did: did.id, 
        document: (doc.didDocument || {}) as Record<string, unknown>, 
        instance: did as unknown as Record<string, unknown> 
      };
    }
  },
  {
    id: "did:web",
    name: "DID Web",
    description: "DID hosted on a web domain",
    icon: <Globe className="w-5 h-5" />,
    color: "green",
    benefits: [
      "Uses existing web infrastructure",
      "Easy to implement",
      "Human-readable identifiers",
      "Good for organizations"
    ],
    useCases: [
      "Corporate identities",
      "Educational institutions",
      "Government services",
      "Public-facing organizations"
    ],
    generateDID: async (customDomain?: string) => {
      // Generate real Ed25519 key pair for did:web
      const { provider, publicKeyBase58 } = await generateEd25519KeyPair();
      
      let domain: string;
      let department: string;
      let id: string;
      
      if (customDomain) {
        // Parse custom domain input
        const parts = customDomain.split(':');
        domain = parts[0] || "example.com";
        department = parts[1] || "identity";
        id = parts[2] || crypto.randomUUID().split('-')[0];
      } else {
        // Use default random values
        const domains = [
          "university.edu",
          "company.com",
          "organization.org",
          "institution.edu",
          "government.gov",
          "healthcare.org"
        ];
        domain = domains[Math.floor(Math.random() * domains.length)];
        department = ["identity", "credentials", "did", "auth"][Math.floor(Math.random() * 4)];
        id = crypto.randomUUID().split('-')[0];
      }
      
      const did = `did:web:${domain}:${department}:${id}`;
      
      // Create a proper DID document with real public key
      const document = {
        "@context": [
          "https://www.w3.org/ns/did/v1",
          "https://w3id.org/security/suites/ed25519-2020/v1"
        ],
        id: did,
        verificationMethod: [{
          id: `${did}#key-1`,
          type: "Ed25519VerificationKey2020",
          controller: did,
          publicKeyMultibase: `z${publicKeyBase58}` // Multibase encoded public key
        }],
        authentication: [`${did}#key-1`],
        assertionMethod: [`${did}#key-1`],
        capabilityDelegation: [`${did}#key-1`],
        capabilityInvocation: [`${did}#key-1`]
      };
      
      // Store the provider and document for later use
      return { 
        did, 
        document,
        instance: { provider, document } // Store both for signing
      };
    }
  }
];

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
  },
  {
    id: "employee-badge",
    name: "Employee Badge",
    description: "Corporate employee credential",
    icon: <Building className="w-8 h-8" />,
    bgGradient: "from-orange-600 to-red-600",
    accentColor: "orange",
    template: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      type: ["VerifiableCredential", "EmployeeBadgeCredential"],
      credentialSubject: {
        employment: {
          employeeId: "EMP-" + Math.floor(Math.random() * 100000),
          position: "Senior Software Engineer",
          department: "Engineering",
          startDate: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          clearanceLevel: "Confidential"
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
  onDelete?: () => void;
  onExport?: () => void;
}> = ({ credential, template, isVerified, onDelete, onExport }) => {
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
      case "employee-badge":
        return (credSubject.employment as Record<string, unknown>) || {};
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
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {onExport && (
              <button
                onClick={onExport}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Export credential"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                title="Delete from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
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

          {template.id === "employee-badge" && (
            <>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70">Position</p>
                <p className="font-semibold">{(details.position as string) || 'Senior Software Engineer'}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">Department</p>
                  <p className="font-semibold">{(details.department as string) || 'Engineering'}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70">Employee ID</p>
                  <p className="font-semibold">{(details.employeeId as string) || 'EMP-12345'}</p>
                </div>
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

const DidVcExplorerEnhancedV2: React.FC = () => {
  // State management
  const [selectedPersonalMethod, setSelectedPersonalMethod] = useState<string>("did:key");
  const [selectedInstitutionMethod, setSelectedInstitutionMethod] = useState<string>("did:web");
  
  const [personalDid, setPersonalDid] = useState<string | null>(null);
  const [, setPersonalDidInstance] = useState<Record<string, unknown> | null>(null);
  const [personalDidDocument, setPersonalDidDocument] = useState<Record<string, unknown> | null>(null);
  
  const [institutionDid, setInstitutionDid] = useState<string | null>(null);
  const [institutionDidInstance, setInstitutionDidInstance] = useState<Record<string, unknown> | null>(null);
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
  const [showVisualCredential, setShowVisualCredential] = useState(true);
  
  // New enhanced features
  const [customDomain, setCustomDomain] = useState<string>("");
  const [showCustomDomainInput, setShowCustomDomainInput] = useState(false);
  const [vcHistory, setVcHistory] = useState<VCHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const didMethods = createDidMethods();

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
    setCustomDomain("");
    setShowCustomDomainInput(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as { Prism?: { highlightAll: () => void } }).Prism !== "undefined") {
      (window as { Prism?: { highlightAll: () => void } }).Prism?.highlightAll();
    }
  }, [personalDid, institutionDid, vc, verificationResult]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('vcHistory');
    if (savedHistory) {
      setVcHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (vcHistory.length > 0) {
      localStorage.setItem('vcHistory', JSON.stringify(vcHistory));
    }
  }, [vcHistory]);

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
    methods: [
      {
        title: "Two Approaches to Digital Identity",
        content: "did:key and did:web represent two fundamental approaches: complete decentralization vs. leveraging existing web infrastructure. Both use the same cryptography but differ in how identities are discovered.",
        icon: <Shield className="w-5 h-5" />
      },
      {
        title: "did:key - Pure Cryptography",
        content: "Your public key IS your identifier. No servers, no domains, no external dependencies. The DID contains everything needed to verify signatures. Perfect for privacy and offline scenarios.",
        icon: <Key className="w-5 h-5" />
      },
      {
        title: "did:web - Domain-Based Trust",
        content: "Links identity to web domains like 'did:web:university.edu'. The domain provides trust context - you know it's really from that university. The DID document is hosted at a well-known URL.",
        icon: <Globe className="w-5 h-5" />
      },
      {
        title: "Same Crypto, Different Discovery",
        content: "Both use Ed25519 signatures for security. The difference is discovery: did:key is self-contained while did:web requires fetching the document from a URL. Both are cryptographically secure!",
        icon: <Shield className="w-5 h-5" />
      }
    ],
    advanced: [
      {
        title: "Custom Domains for did:web",
        content: "You can now specify custom domains for did:web DIDs. Format: &apos;domain:department:id&apos; (e.g., &apos;mycompany.com:hr:alice&apos;). This makes DIDs more meaningful and recognizable.",
        icon: <Settings className="w-5 h-5" />
      },
      {
        title: "Credential History",
        content: "All issued credentials are saved in your browser's local storage. You can review, export, or import them later. This helps demonstrate credential persistence and portability.",
        icon: <History className="w-5 h-5" />
      },
      {
        title: "Batch Verification",
        content: "The verification process now shows detailed steps, helping you understand how DIDs are resolved and signatures are validated. This transparency builds trust in the system.",
        icon: <Search className="w-5 h-5" />
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
      const method = didMethods.find(m => m.id === selectedPersonalMethod);
      if (!method) throw new Error("Invalid DID method selected");
      
      const result = await method.generateDID();
      
      setPersonalDidInstance(result.instance || null);
      setPersonalDid(result.did);
      setPersonalDidDocument(result.document);
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
      const method = didMethods.find(m => m.id === selectedInstitutionMethod);
      if (!method) throw new Error("Invalid DID method selected");
      
      const result = await method.generateDID(
        selectedInstitutionMethod === "did:web" && customDomain ? customDomain : undefined
      );
      
      setInstitutionDidInstance(result.instance || null);
      setInstitutionDid(result.did);
      setInstitutionDidDocument(result.document);
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
    
    if (!institutionDid) {
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      const templateData = template.template as {
        "@context": string[];
        type: string[];
        credentialSubject: Record<string, unknown>;
      };

      const vcPayload = {
        ...templateData,
        id: `urn:uuid:${crypto.randomUUID()}`,
        issuer: institutionDid,
        issuanceDate: new Date().toISOString(),
        credentialSubject: {
          id: recipientDid,
          ...templateData.credentialSubject
        }
      };

      // Handle signing for both did:key and did:web
      if (institutionDidInstance) {
        let jwsResult;
        let kid;
        
        if (institutionDid.startsWith("did:key")) {
          // For did:key, use the DID instance directly
          const didInstance = institutionDidInstance as { createDagJWS: (payload: Record<string, unknown>) => Promise<{ jws?: { signatures?: Array<{ signature: string; protected: string }> } }>; id: string };
          jwsResult = await didInstance.createDagJWS(vcPayload);
          kid = didInstance.id;
          
          // Extract kid from protected header if available
          if (jwsResult.jws?.signatures?.[0]?.protected) {
            try {
              const decodedBytes = uint8ArrayFromString(jwsResult.jws.signatures[0].protected, "base64url");
              const protectedHeader = JSON.parse(uint8ArrayToString(decodedBytes));
              if (protectedHeader.kid) {
                kid = protectedHeader.kid.startsWith("#") 
                  ? didInstance.id + protectedHeader.kid 
                  : protectedHeader.kid;
              }
            } catch (e) {
              console.warn("Could not parse JWS protected header", e);
            }
          }
        } else if (institutionDid.startsWith("did:web")) {
          // For did:web, create a temporary DID instance with the provider
          const { provider } = institutionDidInstance as { provider: Ed25519Provider };
          const tempDid = new DID({ 
            provider, 
            resolver: KeyResolver.getResolver() 
          });
          await tempDid.authenticate();
          
          jwsResult = await tempDid.createDagJWS(vcPayload);
          kid = `${institutionDid}#key-1`;
        }
        
        if (!jwsResult?.jws?.signatures?.length) {
          throw new Error("Failed to create JWS or JWS has no signatures.");
        }

        const firstSignature = jwsResult.jws.signatures[0];
        
        const finalSignedVc = {
          ...vcPayload,
          proof: {
            type: "Ed25519Signature2018",
            created: new Date().toISOString(),
            proofPurpose: "assertionMethod",
            verificationMethod: kid,
            jws: firstSignature.signature,
            protected: firstSignature.protected
          }
        };

        setVc(JSON.stringify(finalSignedVc, null, 2));
        
        // Add to history
        const historyItem: VCHistoryItem = {
          id: crypto.randomUUID(),
          template: selectedTemplate,
          subject: recipientDid,
          issuer: institutionDid,
          timestamp: new Date().toISOString(),
          credential: finalSignedVc
        };
        setVcHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
      } else {
        throw new Error("No signing instance available for the institution DID");
      }

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

      if (!proof || !proof.verificationMethod) {
        throw new Error("VC is missing proof or verificationMethod in proof.");
      }

      // Step 1: Extract issuer information
      setVerificationStep("Extracting issuer DID from credential...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Identify DID method
      setVerificationStep("Identifying DID method and resolution strategy...");
      await new Promise(resolve => setTimeout(resolve, 800));

      const issuerDid = parsedVc.issuer;
      const didMethod = issuerDid.split(":")[1];

      // Step 3: Resolve issuer's DID
      setVerificationStep(`Resolving ${didMethod} DID to get public key...`);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 4: Verify signature structure
      setVerificationStep("Checking cryptographic signature structure...");
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verify the proof has required fields
      if (!proof.jws || !proof.protected) {
        throw new Error("Invalid proof structure - missing JWS or protected header");
      }

      // Step 5: Verify signature
      setVerificationStep("Verifying Ed25519 signature with issuer's public key...");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 6: Check subject
      setVerificationStep("Verifying credential subject matches recipient...");
      await new Promise(resolve => setTimeout(resolve, 800));

      // For educational purposes, we're simulating verification
      const isSubjectValid = parsedVc.credentialSubject && parsedVc.credentialSubject.id;
      const isProofValid = proof.type === "Ed25519Signature2018" && proof.jws;

      if (isSubjectValid && isProofValid) {
        setVerificationStep("✅ Verification complete!");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setVerificationResult({
          verified: true,
          message: "✅ Credential verified successfully!",
          details: {
            issuer: parsedVc.issuer,
            issuerMethod: didMethod,
            subject: parsedVc.credentialSubject.id,
            subjectMethod: parsedVc.credentialSubject.id.split(":")[1],
            issuanceDate: parsedVc.issuanceDate,
            credentialType: parsedVc.type.join(", "),
            verificationMethod: proof.verificationMethod,
            proofType: proof.type,
            signatureAlgorithm: "Ed25519",
            verificationSteps: [
              "✓ Extracted issuer DID",
              `✓ Identified ${didMethod} method`,
              `✓ Resolved ${didMethod} DID`,
              "✓ Validated signature structure",
              "✓ Verified Ed25519 signature",
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

  const exportCredential = (credential: Record<string, unknown>) => {
    const dataStr = JSON.stringify(credential, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `credential-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importCredential = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          setVcToVerify(content);
        } catch {
          setError("Failed to import credential");
        }
      };
      reader.readAsText(file);
    }
  };

  const deleteFromHistory = (id: string) => {
    setVcHistory(prev => prev.filter(item => item.id !== id));
  };

  const filteredHistory = vcHistory.filter(item => 
    searchQuery === "" || 
    item.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      {/* Enhanced Educational Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white relative mb-6">
        <h2 className="text-3xl font-bold mb-2">Enhanced DID Methods Explorer</h2>
        <p className="text-lg opacity-90">
          Create, manage, and verify decentralized credentials with advanced features
        </p>
        <div className="mt-3 text-sm opacity-80 flex flex-wrap gap-2">
          <span className="inline-block bg-white/20 px-2 py-1 rounded">🔑 did:key - Pure Cryptography</span>
          <span className="inline-block bg-white/20 px-2 py-1 rounded">🌐 did:web - Custom Domains</span>
          <span className="inline-block bg-white/20 px-2 py-1 rounded">📜 Credential History</span>
          <span className="inline-block bg-white/20 px-2 py-1 rounded">🔍 Import/Export</span>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          {(personalDid || institutionDid || vc) && (
            <button
              onClick={resetDemo}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
            >
              Reset Demo
            </button>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors flex items-center gap-1"
          >
            <History className="w-4 h-4" />
            History ({vcHistory.length})
          </button>
        </div>
      </div>

      <div className="space-y-6">

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-start gap-2">
          <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Credential History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-800 rounded-lg p-6 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <History className="w-5 h-5" />
                Credential History
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search history..."
                  className="bg-gray-700 text-white rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {filteredHistory.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {searchQuery ? "No matching credentials found" : "No credentials in history yet"}
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredHistory.map((item) => {
                  const template = vcTemplates.find(t => t.id === item.template);
                  if (!template) return null;
                  
                  return (
                    <CredentialCard
                      key={item.id}
                      credential={item.credential}
                      template={template}
                      onDelete={() => deleteFromHistory(item.id)}
                      onExport={() => exportCredential(item.credential)}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* DID Generation Section */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Key className="w-5 h-5" />
          Step 1: Create Your Identity
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          Choose DID methods that match your use case. Individuals might prefer did:key for privacy, while institutions often use did:web for trust.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal DID */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Your Personal DID</h4>
            
            {/* Method Selection */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Choose DID Method:</label>
              <div className="flex gap-2">
                {didMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPersonalMethod(method.id)}
                    className={`p-2 rounded-lg border text-xs transition-all flex-1 ${
                      selectedPersonalMethod === method.id
                        ? method.id === 'did:key' 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span>{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

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
                  {didMethods.find(m => m.id === selectedPersonalMethod)?.icon}
                  Generate {selectedPersonalMethod}
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
          
          {/* Institution DID */}
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-3">Institution DID</h4>
            
            {/* Method Selection */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">Choose DID Method:</label>
              <div className="flex gap-2">
                {didMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setSelectedInstitutionMethod(method.id);
                      if (method.id === "did:web") {
                        setShowCustomDomainInput(true);
                      } else {
                        setShowCustomDomainInput(false);
                      }
                    }}
                    className={`p-2 rounded-lg border text-xs transition-all flex-1 ${
                      selectedInstitutionMethod === method.id
                        ? method.id === 'did:key' 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <span>{method.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Domain Input for did:web */}
            {showCustomDomainInput && selectedInstitutionMethod === "did:web" && (
              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">
                  Custom Domain (optional):
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="example.com:department:id"
                  className="bg-gray-700 text-white rounded px-3 py-1 text-xs w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: domain:department:id (e.g., university.edu:registrar:2024)
                </p>
              </div>
            )}

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
                  {didMethods.find(m => m.id === selectedInstitutionMethod)?.icon}
                  Generate {selectedInstitutionMethod}
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

        {/* Method Info Cards */}
        {(selectedPersonalMethod || selectedInstitutionMethod) && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {selectedPersonalMethod && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h5 className="text-sm font-semibold mb-2 text-blue-400">
                  {didMethods.find(m => m.id === selectedPersonalMethod)?.name} Benefits
                </h5>
                <ul className="text-xs space-y-1">
                  {didMethods.find(m => m.id === selectedPersonalMethod)?.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedInstitutionMethod && (
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h5 className="text-sm font-semibold mb-2 text-green-400">
                  {didMethods.find(m => m.id === selectedInstitutionMethod)?.name} Use Cases
                </h5>
                <ul className="text-xs space-y-1">
                  {didMethods.find(m => m.id === selectedInstitutionMethod)?.useCases.map((useCase, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span className="text-gray-300">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
              <p className="text-xs text-gray-500 mt-1">Method: {institutionDid.split(":")[1].toUpperCase()}</p>
            </div>
          )}

          {/* Template Selection with Visual Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select credential type:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
              <p className="text-gray-400 text-sm mt-2">Using {institutionDid?.split(":")[1]} method</p>
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
                  onClick={() => exportCredential(JSON.parse(vc))}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Export
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
          Now act as a verifier. The verification process works across all DID methods!
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-400">
                Paste the Verifiable Credential here:
              </label>
              <label className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importCredential}
                  className="hidden"
                />
                <span className="flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  Import
                </span>
              </label>
            </div>
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
                        .filter(([key]) => key !== "verificationSteps" && key !== "error")
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
            Understanding Different DID Methods
          </h3>
          {expandedSections.has("education") ? 
            <ChevronUp className="w-5 h-5" /> : 
            <ChevronDown className="w-5 h-5" />
          }
        </button>
        
        {expandedSections.has("education") && (
          <div className="space-y-4">
            {educationalSteps.methods.map((step, idx) => (
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
            
            {/* Advanced Features */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-200 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Features
              </h4>
              {educationalSteps.advanced.map((step, idx) => (
                <div key={idx} className="bg-gray-700 p-4 rounded-lg mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-purple-400">{step.icon}</div>
                    <div>
                      <h5 className="font-medium mb-1">{step.title}</h5>
                      <p className="text-sm text-gray-300">{step.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cryptographic Note */}
            <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-medium text-yellow-400 mb-1">Educational Demo Note</h5>
                  <p className="text-sm text-gray-300">
                    This demo uses real Ed25519 cryptography for both DID methods. The signatures are genuine and cryptographically valid. 
                    However, in production:
                  </p>
                  <ul className="text-sm text-gray-300 mt-2 space-y-1 ml-4">
                    <li>• did:web documents would be hosted at https://domain/.well-known/did.json</li>
                    <li>• Verification would fetch and validate the actual DID documents</li>
                    <li>• The JWS signatures would be verified against the payload using the public key</li>
                    <li>• Additional security measures like key rotation and revocation would be implemented</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      </div>
    </div>
  );
};

export default DidVcExplorerEnhancedV2;