import { test, expect } from '@playwright/test';

test.describe('PGP Tool Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects/pgp-tool');
  });

  test('should display the main title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Simple PGP Tool', level: 1 })).toBeVisible();
  });

  test('should have expandable sections for key generation, encryption, and decryption', async ({ page }) => {
    // <summary> elements are often treated as buttons by accessibility roles
    await expect(page.locator('summary:has-text("Generate New Key Pair")')).toBeVisible();
    await expect(page.locator('summary:has-text("Encrypt Message")')).toBeVisible();
    await expect(page.locator('summary:has-text("Decrypt Message")')).toBeVisible();
  });

  test('key generation section should have input fields', async ({ page }) => {
    const keyGenSummary = page.locator('summary:has-text("Generate New Key Pair")');
    await keyGenSummary.click();
    
    const detailsElement = page.locator('details:has-text("Generate New Key Pair")');
    await expect(detailsElement).toHaveAttribute('open');

    await expect(detailsElement.getByLabel('Your Name:')).toBeVisible();
    await expect(detailsElement.getByLabel('Your Email:')).toBeVisible();
    await expect(detailsElement.getByLabel('New Key Passphrase:')).toBeVisible();
    await expect(detailsElement.getByRole('button', { name: 'Generate Keys' })).toBeVisible();
  });

  test('encryption section should have input fields', async ({ page }) => {
    const encryptSummary = page.locator('summary:has-text("Encrypt Message")');
    await encryptSummary.click();
    
    const detailsElement = page.locator('details:has-text("Encrypt Message")');
    await expect(detailsElement).toHaveAttribute('open');

    await expect(detailsElement.getByLabel("Recipient's PGP Public Key:")).toBeVisible();
    await expect(detailsElement.getByLabel('Plaintext Message to Encrypt:')).toBeVisible();
    await expect(detailsElement.getByRole('button', { name: 'Encrypt' })).toBeVisible();
  });

  test('decryption section should have input fields', async ({ page }) => {
    const decryptSummary = page.locator('summary:has-text("Decrypt Message")');
    await decryptSummary.click();

    const detailsElement = page.locator('details:has-text("Decrypt Message")');
    await expect(detailsElement).toHaveAttribute('open');

    await expect(detailsElement.getByLabel('Your PGP Private Key:')).toBeVisible();
    await expect(detailsElement.getByLabel('Private Key Passphrase (if any):')).toBeVisible();
    await expect(detailsElement.getByLabel('PGP Encrypted Message:')).toBeVisible();
    await expect(detailsElement.getByRole('button', { name: 'Decrypt' })).toBeVisible();
  });

  test('should display instructions section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'How to Use This Tool' })).toBeVisible();
  });

  test('should perform end-to-end PGP operations (generate, encrypt, decrypt)', async ({ page }) => {
    const testName = 'Test User';
    const testEmail = 'test@example.com';
    const testPassphrase = 'supersecretpassphrase';
    const originalMessage = 'This is a secret message for testing PGP!';

    // 1. Key Generation
    await page.locator('summary:has-text("Generate New Key Pair")').click();
    await expect(page.locator('details:has-text("Generate New Key Pair")')).toHaveAttribute('open');

    await page.locator('input#userName').fill(testName);
    await page.locator('input#userEmail').fill(testEmail);
    await page.locator('input#keyGenPassphrase').fill(testPassphrase);
    await page.locator('button:has-text("Generate Keys")').click();

    const generatedPublicKeyTextarea = page.locator('textarea#generatedPublicKey');
    const generatedPrivateKeyTextarea = page.locator('textarea#generatedPrivateKey');

    await expect(generatedPublicKeyTextarea).toBeVisible({ timeout: 20000 }); // Key gen can be slow
    await expect(generatedPrivateKeyTextarea).toBeVisible({ timeout: 20000 });

    const publicKey = await generatedPublicKeyTextarea.inputValue();
    const privateKey = await generatedPrivateKeyTextarea.inputValue();

    expect(publicKey).toContain('-----BEGIN PGP PUBLIC KEY BLOCK-----');
    expect(privateKey).toContain('-----BEGIN PGP PRIVATE KEY BLOCK-----');

    // 2. Encryption
    await page.locator('summary:has-text("Encrypt Message")').click();
    await expect(page.locator('details:has-text("Encrypt Message")')).toHaveAttribute('open');
    
    // Clear the message input field if it was used by decryption previously
    // The component reuses the 'message' state for both encryption input and decryption input
    await page.locator('textarea#encryptMessage').clear(); 


    await page.locator('textarea#encryptPublicKey').fill(publicKey);
    await page.locator('textarea#encryptMessage').fill(originalMessage);
    await page.locator('button:has-text("Encrypt")').click();

    const outputTextarea = page.locator('textarea#output');
    await expect(outputTextarea).toBeVisible({ timeout: 10000 });
    const encryptedMessage = await outputTextarea.inputValue();
    expect(encryptedMessage).toContain('-----BEGIN PGP MESSAGE-----');

    // 3. Decryption
    await page.locator('summary:has-text("Decrypt Message")').click();
    await expect(page.locator('details:has-text("Decrypt Message")')).toHaveAttribute('open');

    await page.locator('textarea#decryptPrivateKey').fill(privateKey);
    await page.locator('input#decryptPassphrase').fill(testPassphrase);
    await page.locator('textarea#decryptMessage').fill(encryptedMessage); // Use the encrypted message from step 2
    await page.locator('button:has-text("Decrypt")').click();

    await expect(outputTextarea).toBeVisible({ timeout: 10000 }); // Output area is reused
    // It might take a moment for the value to update after decryption
    await expect(outputTextarea).toHaveValue(originalMessage, { timeout: 10000 });
  });
  
});
