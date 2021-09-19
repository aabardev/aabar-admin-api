import { getAuthorizationUrl, getNewTokens } from "./dbxHandlers.js";
import * as readline from "readline";

const initTokenFile = () => {
  // (1) Get Authorization URL
  const authorizationUrl = getAuthorizationUrl();
  console.log(`Authorization URL: ${authorizationUrl}`);
  console.log(`\tStep 1: Go to Authorization Url`);
  console.log(`\tStep 2: Click "Continue" then "Allow"`);
  console.log(`\tStep 3: Copy Authorization Code`);

  // (2) Get Authorization Code from user
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\tStep 4: Paste Authorization Code here: ", async (authorizationCode) => {
    await getNewTokens(authorizationCode);
    rl.close();
  });

  rl.on("close", function () {
    process.exit(0);
  });
};

initTokenFile();