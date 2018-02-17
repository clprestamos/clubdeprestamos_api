const Promise = require('bluebird');
const fs = require('fs');
const readFile = Promise.promisify(fs.readFile);

const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const logger = require('../logger.js');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_DIR = `${__dirname}/credentials/`;
const TOKEN_PATH = `${TOKEN_DIR}drive-token.json`;

module.exports = {
	getAuth,
	getFolderId: () => {
		return readFile(TOKEN_PATH).then(success => {
			return JSON.parse(success).folder_id;
		}).catch(err => {
			return getAuth();
		});
	},
};

function getAuth() {
	return readFile(`${TOKEN_DIR}client_secret.json`).then(content => {
		return authorize(JSON.parse(content));
	}).catch(err => {
		logger.error(`Error loading client secret file: ${err}`);
		throw err;
	});
}

function authorize(credentials, callback) {
	const clientSecret = credentials.installed.client_secret;
	const clientId = credentials.installed.client_id;
	const redirectUrl = credentials.installed.redirect_uris[0];
	const auth = new googleAuth();
	const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	return readFile(TOKEN_PATH).then(token => {
		oauth2Client.credentials = JSON.parse(token);
		return oauth2Client;
	}).catch(err => {
		return getNewToken(oauth2Client);
	});
}

function getNewToken(oauth2Client) {
	const authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});

  logger.info('Authorize this app by visiting this url: ', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('Enter the code from that page here: ', code => {
		rl.close();
		oauth2Client.getToken(code, (err, token) => {
			if (err) {
				logger.error('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.credentials = token;
			getFolderId(oauth2Client, token);
			return oauth2Client;
		});
	});
}

function getFolderId(auth, token) {
	const service = google.drive('v3');

	service.files.create({
		auth,
		resource: {
			name: 'clubdeprestamoscr',
			mimeType: 'application/vnd.google-apps.folder',
		},
		fields: 'id',
	}, (err, file) => {
		if (err) {
			logger.error(err);
		} else {
			token.folder_id = file.id;
			storeToken(token);
		}
	});
}

function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code !== 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token, '', 2));
	logger.info(`Token stored to ${TOKEN_PATH}`);
}
