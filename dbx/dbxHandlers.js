import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const dbx_token_file = process.env.DBX_TOKEN_FILE;
const dbx_client_id = process.env.DBX_CLIENT_ID;
const dbx_client_secret = process.env.DBX_CLIENT_SECRET;
const dbx_app_folder_name = process.env.DBX_APP_FOLDER_NAME;
const dbx_img_folder_name = process.env.DBX_IMG_FOLDER_NAME;

export const getAuthorizationUrl = () => {
  return {
    auth_url: `https://www.dropbox.com/oauth2/authorize?client_id=${dbx_client_id}&response_type=code&token_access_type=offline`,
  };
};

export const getNewTokens = async (authorizationCode) => {
  console.log("AUTHORIZATION CODE:\n", authorizationCode);
  const reqUrl = "https://api.dropbox.com/oauth2/token";
  const reqOptions = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `code=${authorizationCode}&grant_type=authorization_code&client_id=${dbx_client_id}&client_secret=${dbx_client_secret}`,
  };

  let status = "failed";
  let msg = "";
  try {
    const dbxTokenRes = await (await fetch(reqUrl, reqOptions)).json();
    console.log("DBX Response:");
    console.log(dbxTokenRes);
    if (Object.keys(dbxTokenRes).includes("error")) {
      msg = `${dbxTokenRes.error}: ${dbxTokenRes.error_description}`;
    } else {
      fs.writeFileSync(dbx_token_file, JSON.stringify(dbxTokenRes));
      status = "success";
      msg = "Tokens Generated and Stored";
    }
  } catch (err) {
    console.log("ERROR:");
    console.error(err, err.stack);
    msg = `${err}: ${err.stack}`;
  } finally {
    console.log("FINALLY:");
    console.log({ status, msg });
    return { status, msg };
  }
};

const getValidAccessToken = async () => {
  console.log(`1. Attempting to get VALID access token`);
  try {
    let accessToken = JSON.parse(
      fs.readFileSync(dbx_token_file, "utf8")
    ).access_token;
    console.log(`1a. Read Stored Access Token: ${accessToken}`);

    // (1) Check if Access Token is still valid (by making a call to any dbxapi endpoint)
    const reqUrl = "https://api.dropboxapi.com/2/users/get_current_account";
    const reqOptions = {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      redirect: "follow",
    };
    const dbxRes = await fetch(reqUrl, reqOptions);
    if (dbxRes.status === 401) {
      console.log(
        `1b. Stored Access Token is INVALID or has EXPIRED. Getting new one.`
      );
      accessToken = await getFreshAccessToken();
      console.log(`1c. New Access Token: ${accessToken}`);
    }
    return accessToken;
  } catch (err) {
    console.log(err);
  }
};

const getFreshAccessToken = async () => {
  let accessToken = "";
  console.log("2. Attempting to refresh access token");
  try {
    const grantType = "refresh_token";
    const tokenJson = JSON.parse(fs.readFileSync(dbx_token_file, "utf8"));
    const refreshToken = tokenJson.refresh_token;
    const reqUrl = "https://api.dropbox.com/oauth2/token";
    const reqOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=${grantType}&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`,
    };
    const dbxTokenRes = await (await fetch(reqUrl, reqOptions)).json();
    console.log(`2a. Refreshed access token: ${JSON.stringify(dbxTokenRes)}`);

    const updatedTokenJson = { ...tokenJson, ...dbxTokenRes };
    console.log(
      `2b. \tOriginal Token File: ${JSON.stringify(
        tokenJson
      )}\n\tUpdated Token JSON: ${JSON.stringify(updatedTokenJson)}`
    );

    fs.writeFileSync(tokenFile, JSON.stringify(updatedTokenJson));
    console.log(`2c. Token File Saved`);

    accessToken = updatedTokenJson.access_token;
  } catch (err) {
    console.log(err);
  }
  return accessToken;
};
