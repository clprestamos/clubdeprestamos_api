const google = require('googleapis');
const drive = require('./drive');
const fs = require('fs');
const logger = '../logger.js';
const Promise = require('bluebird');
const folderPromise = drive.getFolderId();
const mimeType = require('./mimeType');
function lib() {
	let auth = {}, folderId = '';

	folderPromise.then(response => {
		folderId = response;
	}).catch(err => {
		logger.error('Error while trying to get the folder: ', err);
	});

	drive.getAuth().then(response => {
		auth = response;
	}).catch(err => {
		logger.error('Error while trying to get the auth: ', err);
	});

	const upload = function (payload) {
		console.log('PAYLOAD', payload);
		const create = Promise.promisify(google.drive('v3').files.create),
					filename = payload.file.hapi.filename,
					ext = filename.split('.').pop(),
					resource = {
						name: `${payload.clientId}_${payload.clientName.replace(' ', '')}_${filename}`,
						parents: [folderId],
						type: 'anyone',
					},
					media = {
						mimeType: mimeType.validate(ext),
						body: payload.file,
					};

		return create({
			resource,
			media,
			auth,
			fields: 'id',
		});
	};

	const all = function() {
		const list = Promise.promisify(google.drive('v2').children.list);
		return list({
			folderId,
			auth,
			q: 'trashed = false',
		});
	};

	const update = function(payload) {
		return deleteFile(payload.fileId).then(() => {
			return upload(payload);
		}).catch(err => {
			logger.error(err);
			throw err;
		});
	};

	const deleteFile= function(fileId) {
		const deleteFile = Promise.promisify(google.drive('v3').files['delete']);
		return deleteFile({
			fileId,
			auth,
		});
	};

	return {
		all,
		upload,
		update,
		deleteFile,
	};
};

module.exports = lib();
