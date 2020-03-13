const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = 'token.json';

async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  try {
    const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
    oAuth2Client.setCredentials(JSON.parse(token));
    const value = await callback(oAuth2Client);
    return value;
  } catch (err) {
    return getNewToken(oAuth2Client, callback);
  }
}

async function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', code => {
    rl.close();
    oAuth2Client.getToken(code, async (err, token) => {
      if (err)
        return console.error(
          'Error while trying to retrieve access token',
          err
        );
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      return await callback(oAuth2Client);
    });
  });
}

async function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: '1t7i_AfSIu1dXwjyXZ_gwVTIqi9pCMVpHVqMlDjWONmo',
      range: '03/2020!H39'
    });
    const rows = res.data.values;
    return rows.join('');
  } catch (err) {
    return console.log('The API returned an error: ' + err);
  }
}

const getData = async () => {
  try {
    const content = fs.readFileSync('credentials.json', 'utf-8');
    const value = await authorize(JSON.parse(content), listMajors);
    return value;
  } catch (err) {
    return console.log('Error loading client secret file:', err);
  }
};

module.exports = getData;
