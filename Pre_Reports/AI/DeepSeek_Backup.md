
### 🔥 Critical Backup Plan (The "Something Broke" Protocol)**

This plan is designed to be your team's emergency playbook. Rehearse these scenarios so everyone knows their role when something goes wrong. The goal is to **never say "it's broken."** Instead, you say, "For the purposes of this demo, we'll now switch to our locally running network," projecting confidence and preparedness.

#### **Backup 1: Smart Contract Deployment Fails (No Internet/Sepolia Down)**

*   **The Problem:** You can't connect to the Sepolia testnet, the faucet is dry, or deployment transactions are stuck.
*   **The Immediate Action:**
    1.  **Remain Calm.** This is expected and why we have a backup.
    2.  The Smart Contract developer immediately runs: `npx hardhat node`
        *   This starts a local Hardhat network on `http://127.0.0.1:8545`. It creates 20 test accounts with 10,000 test ETH each instantly.
*   **The Switch:**
    1.  The Frontend developer connects MetaMask to this local network.
        *   In MetaMask: Add Network → Network Name: `Hardhat Local`, RPC URL: `http://127.0.0.1:8545`, Chain ID: `31337`, Currency Symbol: `ETH`.
    2.  Import a test account into MetaMask using the private keys provided in the terminal when you ran `npx hardhat node`.
    3.  Deploy your smart contract to this local network using Hardhat: `npx hardhat run scripts/deploy.js --network localhost`
*   **What to Tell the Judges:** "To ensure a smooth and reliable demonstration without depending on external testnet stability, we are running our blockchain verification on a local, instantiated Hardhat network. The functionality and security guarantees are identical to a public testnet."

#### **Backup 2: Frontend-Blockchain Connection Issues**

*   **The Problem:** The website doesn't pop up MetaMask, shows a "provider not found" error, or transactions don't go through.
*   **The Immediate Action:**
    1.  **Designated Troubleshooter** (one team member pre-assigned this role) takes over.
    2.  They check the browser console (F12) for errors.
    3.  They verify that the correct contract address and ABI are loaded in the frontend code.
*   **The Switch:**
    1.  If the issue cannot be fixed in 60 seconds, the presenter moves to the pre-recorded video.
    2.  **"It seems we're experiencing a temporary connectivity issue with our wallet service. Let me walk you through a pre-recorded demonstration of the complete, seamless user flow."**
    3.  Play the video embedded in your slides. The video should be **silent** with large text captions explaining each step, so the presenter can narrate over it.

#### **Backup 3: QR Code Scanner Fails**

*   **The Problem:** The camera doesn't activate, the library fails to load, or it can't read the QR code.
*   **The Immediate Action:**
    1.  The presenter doesn't panic. They already know this is a possibility.
*   **The Switch:**
    1.  **"While our system is designed for one-click QR verification, we also support manual verification for accessibility."**
    2.  The presenter asks the "student" to click a button in their app that says **"Copy Verification Link"** or **"Show Manual Code"**.
    3.  This reveals a long string (the credential data) or a simple shortcode.
    4.  The "employer" can then paste this string into an input field on their verification page and click "Verify Manually." The result is the same.
    5.  This actually **impresses judges** by showing you've thought about edge cases and usability.

#### **Backup 4: Critical Bug Found Minutes Before Demo**

*   **The Problem:** You discover a flaw that breaks the core functionality during your final test.
*   **The Immediate Action:**
    1.  **Scope Hammer.** Immediately revert to the last working version using Git (`git stash` or `git reset --hard`).
    2.  **Disable the broken feature.** If the bug is in a new feature (e.g., a fancy history log), comment it out. Your core issue/verify flow must always work.
*   **The Switch:**
    1.  If the core flow is broken and cannot be fixed, **activate "Presentation Mode."**
    2.  **Do not try to debug live.** Your demo is now your slides and your pre-recorded video.
    3.  **"Today, we'd like to focus on explaining the architecture and user experience of VerifyEd. We've built a functional prototype, and to best utilize our time, we'll use a pre-recorded video to showcase the user flow while we deep-dive into the innovative technology behind it."**
    4.  Use your slides to talk about the smart contract logic, the hash function, and the security model. The video provides the visual proof.

#### **Backup 5: The "Nothing Works" Nuclear Option**

*   **The Problem:** A catastrophic issue: laptop won't start, internet is completely down, etc.
*   **The Solution:**
    1.  **Have your slides and video on a USB drive.** You can quickly present from another machine.
    2.  Your presentation becomes a **product pitch** and **technical explanation**.
    3.  **"While we intended to show a live demo, technical circumstances beyond our control have led us to focus on what truly matters: the solution itself. Let us talk you through our working prototype via video and explain how every component functions to solve a critical problem."**
    4.  A team that handles a total meltdown with grace and professionalism can often score higher than a team with a working but poorly explained demo.

**Remember:** Judges award points for:
*   **Idea and Impact** (You have this)
*   **Technical Implementation** (You planned it well)
*   **Execution and Demo** (This backup plan IS your execution strategy)
*   **Design and UX** (You have a fallback UI)
*   **Teamwork and Problem-Solving** (Using these backups shows elite-level problem-solving)
