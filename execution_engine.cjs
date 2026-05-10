const { ethers } = require("ethers");
// If you use .js instead of .cjs, change above to: import { ethers } from "ethers";

/** * 5.1 Lifecycle State Enum
 */
const LifecycleState = {
  ACTIVE: 0,
  PAUSED: 1,
  STALLED: 2,
  COMPLETED: 3,
  CANCELLED: 4,
};

// TEST DATA: We'll use this until your Supabase is ready
const testStrategy = {
  token_ticker: "TEST_MEME",
  dca_amount: 1.0, // Requires 1 ETH
  stall_count: 0,
  lifecycle_state: 0, // ACTIVE
};

/**
 * 6.2 Processing & 5.2 State Definitions
 */
async function processStrategy(strategy) {
  // If the strategy is already cancelled, don't process it
  if (strategy.lifecycle_state === LifecycleState.CANCELLED) {
    console.log(`Skipping ${strategy.token_ticker}: Strategy is CANCELLED.`);
    return;
  }

  console.log(`Checking strategy for: ${strategy.token_ticker}`);

  // Simulating a balance check for now (0.1 ETH)
  // Later this will be: const balance = await provider.getBalance(strategy.userWallet);
  const simulatedBalanceEth = 0.1;

  // --- 5.2 STALLED LOGIC ---
  if (simulatedBalanceEth < strategy.dca_amount) {
    console.warn(
      `[STALL] Insufficient ETH balance for ${strategy.token_ticker}`,
    );

    strategy.lifecycle_state = LifecycleState.STALLED;
    strategy.stall_count += 1;

    if (strategy.stall_count >= 3) {
      strategy.lifecycle_state = LifecycleState.CANCELLED;
      console.error(
        `[CANCELLED] Strategy ${strategy.token_ticker} terminated after 3 stalls.`,
      );
    }

    console.log(
      `Current State: ${strategy.lifecycle_state} | Stall Count: ${strategy.stall_count}`,
    );

    // await updateDatabase(strategy); // Save to Supabase once it's back up
    return;
  }

  // 7.1 BUY FLOW / 7.2 SELL FLOW (Executes if balance is sufficient)
  console.log(
    `✅ Balance sufficient. Executing trade for ${strategy.token_ticker}...`,
  );
}

/**
 * 6.1 Cycle Timing (130 seconds ± 60 seconds tolerance)
 */
function scheduleNextCycle() {
  const baseInterval = 130 * 1000;
  const tolerance = Math.random() * 120000 - 60000;
  const finalInterval = baseInterval + tolerance;

  console.log(
    `Next execution cycle scheduled in ${(finalInterval / 1000).toFixed(
      0,
    )} seconds.`,
  );

  setTimeout(async () => {
    await runMainLoop();
    scheduleNextCycle();
  }, finalInterval);
}

/**
 * Main Loop: This is the brain that runs every cycle
 */
async function runMainLoop() {
  console.log("\n--- Scanning Active Strategies ---");

  // For now, we manually process our test strategy
  await processStrategy(testStrategy);
}

// Start the engine
scheduleNextCycle();
