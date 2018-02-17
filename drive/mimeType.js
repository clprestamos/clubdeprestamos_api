function mimeType() {
	const availables = {
		csv: 'text/csv',
		html: 'text/html',
		txt: 'text/plain',
		png: 'image/png',
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		svg: 'image/svg+xml',
		rtf: 'application/rtf',
		pdf: 'application/pdf',
		json: 'application/vnd.google-apps.script+json',
		xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	};

	const validate = (ext) => {
		const key = ext.toLowerCase();
		const mimeType = availables[key];
		return !!mimeType ? mimeType : false;
	};

	return {
		validate,
		availables,
	};
}

module.exports = mimeType();
