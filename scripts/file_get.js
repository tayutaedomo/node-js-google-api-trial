const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file'
];
const TOKEN_PATH = '../token.json';

fs.readFile('../credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), listFiles);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// See: https://stackoverflow.com/questions/50373224/node-js-google-drive-api-download-file-error
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  const fileId = '1u5ccZ2GqJvkM5nDVF-MLsb5EbbBk2Nwv';
  const dest = fs.createWriteStream('img.jpg');

  drive.files.get({fileId: fileId, alt: 'media'}, {responseType: 'stream'},
    function(err, res){
      res.data
        .on('end', () => {
          console.log('Done');
        })
        .on('error', err => {
          console.log('Error', err);
        })
        .pipe(dest);
    }
  );
  // drive.files.get({
  //   fileId: fileId,
  //   alt: 'media'
  // }).on('end', function () {
  //   console.log('Done');
  // }).on('error', function (err) {
  //   console.log('Error during download', err);
  // }).pipe(dest);
}

