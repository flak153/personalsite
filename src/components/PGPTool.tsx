'use client';

import React, { useState } from 'react';
import * as openpgp from 'openpgp';

const PGPTool: React.FC = () => {
  const [publicKeyArmored, setPublicKeyArmored] = useState<string>('');
  const [privateKeyArmored, setPrivateKeyArmored] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // For key generation
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [keyGenPassphrase, setKeyGenPassphrase] = useState<string>('');
  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>('');
  const [generatedPrivateKey, setGeneratedPrivateKey] = useState<string>('');
  const [isGeneratingKeys, setIsGeneratingKeys] = useState<boolean>(false);

  const handleEncrypt = async () => {
    if (!publicKeyArmored || !message) {
      setError('Public key and message are required for encryption.');
      return;
    }
    setError('');
    setOutput('');
    setIsLoading(true);
    try {
      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
      const encryptedMessage = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey,
      });
      setOutput(encryptedMessage as string);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Encryption failed: ${e.message}`);
      } else {
        setError(`Encryption failed: An unknown error occurred`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!privateKeyArmored || !message) {
      setError('Private key and message (to decrypt) are required.');
      return;
    }
    setError('');
    setOutput('');
    setIsLoading(true);
    try {
      const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
      
      let decryptedPrivateKey = privateKey;
      if (!privateKey.isDecrypted() && passphrase) { // Check if NOT decrypted AND passphrase is provided
        try {
            decryptedPrivateKey = await openpgp.decryptKey({
                privateKey: privateKey,
                passphrase,
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
              setError(`Failed to decrypt private key: ${e.message}. Check passphrase.`);
            } else {
              setError(`Failed to decrypt private key: An unknown error occurred. Check passphrase.`);
            }
            setIsLoading(false);
            return;
        }
      } else if (!privateKey.isDecrypted() && !passphrase) { // Check if NOT decrypted AND NO passphrase
        setError('Private key is encrypted, but no passphrase was provided.');
        setIsLoading(false);
        return;
      }

      const encryptedMessage = await openpgp.readMessage({ armoredMessage: message });
      const { data: decryptedMessage } = await openpgp.decrypt({ // Removed _signatures
        message: encryptedMessage,
        decryptionKeys: decryptedPrivateKey,
      });

      setOutput(decryptedMessage as string);
      
      // Optionally, verify signatures if needed
      // const signatures = _signatures; // If needed for commented code, re-assign here
      // try {
      //   if (signatures && signatures.length > 0) {
      //     const publicKeyForVerification = await openpgp.readKey({ armoredKey: publicKeyArmored }); // Or extract from message
      //     await signatures[0].verified; // throws on invalid signature
      //     console.log('Signature verified');
      //   }
      // } catch (e: unknown) {
      //   if (e instanceof Error) {
      //     setError(prev => prev + `\nSignature verification failed: ${e.message}`);
      //   } else {
      //     setError(prev => prev + `\nSignature verification failed: An unknown error occurred`);
      //   }
      // }

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Decryption failed: ${e.message}`);
      } else {
        setError(`Decryption failed: An unknown error occurred`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateKeys = async () => {
    if (!userName || !userEmail) {
      setError('User Name and Email are required for key generation.');
      return;
    }
    if (!keyGenPassphrase) {
        setError('A passphrase is required to protect your new private key.');
        return;
    }
    setError('');
    setGeneratedPublicKey('');
    setGeneratedPrivateKey('');
    setIsGeneratingKeys(true);
    try {
      const { privateKey, publicKey } = await openpgp.generateKey({ // Removed _revocationCertificate
        type: 'curve25519', // Use 'curve25519' as the type, as per the TS error hint
        userIDs: [{ name: userName, email: userEmail }],
        passphrase: keyGenPassphrase,
        format: 'armored'
      });
      setGeneratedPublicKey(publicKey);
      setGeneratedPrivateKey(privateKey);
      // Optionally, offer revocationCertificate for download/display (Note: _revocationCertificate was removed from destructuring)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Key generation failed: ${e.message}`);
      } else {
        setError(`Key generation failed: An unknown error occurred`);
      }
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const commonTextareaStyles = "w-full p-2 border border-gray-600 rounded bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-shadow";
  const commonInputStyles = `${commonTextareaStyles} h-10`; // For regular input fields
  const commonButtonStyles = "px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-black font-medium transition-colors disabled:opacity-50";

  return (
    <div className="space-y-6 p-4 bg-black/30 backdrop-blur-md rounded-lg border border-white/20">
      {error && <div className="p-3 bg-red-700/50 border border-red-500 text-white rounded mb-4 whitespace-pre-wrap">{error}</div>}
      
      {/* Key Generation Section */}
      <details className="border border-gray-700 rounded-lg p-4">
        <summary className="cursor-pointer text-lg font-medium text-yellow-300 hover:text-yellow-100">Generate New Key Pair</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">Your Name:</label>
            <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="E.g., John Doe" className={commonInputStyles} />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-300 mb-1">Your Email:</label>
            <input type="email" id="userEmail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="E.g., john.doe@example.com" className={commonInputStyles} />
          </div>
          <div>
            <label htmlFor="keyGenPassphrase" className="block text-sm font-medium text-gray-300 mb-1">New Key Passphrase:</label>
            <input type="password" id="keyGenPassphrase" value={keyGenPassphrase} onChange={(e) => setKeyGenPassphrase(e.target.value)} placeholder="Secure passphrase for your new private key" className={commonInputStyles} />
          </div>
          <button onClick={handleGenerateKeys} disabled={isGeneratingKeys} className={commonButtonStyles}>
            {isGeneratingKeys ? 'Generating...' : 'Generate Keys'}
          </button>
          {generatedPublicKey && (
            <div>
              <label htmlFor="generatedPublicKey" className="block text-sm font-medium text-gray-300 mb-1">Generated Public Key:</label>
              <textarea id="generatedPublicKey" value={generatedPublicKey} readOnly rows={5} className={`${commonTextareaStyles} bg-gray-700`} />
            </div>
          )}
          {generatedPrivateKey && (
            <div>
              <label htmlFor="generatedPrivateKey" className="block text-sm font-medium text-gray-300 mb-1">Generated Private Key (Keep Safe!):</label>
              <textarea id="generatedPrivateKey" value={generatedPrivateKey} readOnly rows={8} className={`${commonTextareaStyles} bg-gray-700`} />
            </div>
          )}
        </div>
      </details>

      {/* Encryption Section */}
      <details className="border border-gray-700 rounded-lg p-4">
        <summary className="cursor-pointer text-lg font-medium text-yellow-300 hover:text-yellow-100">Encrypt Message</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="encryptPublicKey" className="block text-sm font-medium text-gray-300 mb-1">Recipient&apos;s PGP Public Key:</label>
            <textarea
              id="encryptPublicKey"
              value={publicKeyArmored}
              onChange={(e) => setPublicKeyArmored(e.target.value)}
              placeholder="Paste recipient's PGP Public Key here..."
              rows={4}
              className={commonTextareaStyles}
            />
          </div>
          <div>
            <label htmlFor="encryptMessage" className="block text-sm font-medium text-gray-300 mb-1">Plaintext Message to Encrypt:</label>
            <textarea
              id="encryptMessage"
              value={message} // Using the common message state
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message to encrypt..."
              rows={6}
              className={commonTextareaStyles}
            />
          </div>
          <button onClick={handleEncrypt} disabled={isLoading} className={commonButtonStyles}>
            {isLoading && !isGeneratingKeys ? 'Encrypting...' : 'Encrypt'}
          </button>
        </div>
      </details>

      {/* Decryption Section */}
      <details className="border border-gray-700 rounded-lg p-4">
        <summary className="cursor-pointer text-lg font-medium text-yellow-300 hover:text-yellow-100">Decrypt Message</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="decryptPrivateKey" className="block text-sm font-medium text-gray-300 mb-1">Your PGP Private Key:</label>
            <textarea
              id="decryptPrivateKey"
              value={privateKeyArmored}
              onChange={(e) => setPrivateKeyArmored(e.target.value)}
              placeholder="Paste your PGP Private Key here..."
              rows={4}
              className={commonTextareaStyles}
            />
          </div>
          <div>
            <label htmlFor="decryptPassphrase" className="block text-sm font-medium text-gray-300 mb-1">Private Key Passphrase (if any):</label>
            <input
              id="decryptPassphrase"
              type="password"
              value={passphrase} // Using common passphrase state
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase for your private key"
              className={commonInputStyles}
            />
          </div>
          <div>
            <label htmlFor="decryptMessage" className="block text-sm font-medium text-gray-300 mb-1">PGP Encrypted Message:</label>
            <textarea
              id="decryptMessage"
              value={message} // Using the common message state
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Paste PGP armored message here to decrypt..."
              rows={6}
              className={commonTextareaStyles}
            />
          </div>
          <button onClick={handleDecrypt} disabled={isLoading} className={commonButtonStyles}>
            {isLoading && !isGeneratingKeys ? 'Decrypting...' : 'Decrypt'}
          </button>
        </div>
      </details>
      
      {/* Common Output Area */}
      {output && (
        <div className="mt-6">
          <label htmlFor="output" className="block text-sm font-medium text-gray-300 mb-1">Result:</label>
          <textarea
            id="output"
            value={output}
            readOnly
            rows={8}
            className={`${commonTextareaStyles} bg-gray-700 cursor-not-allowed`}
            placeholder="Output will appear here"
          />
        </div>
      )}
    </div>
  );
};

export default PGPTool;
