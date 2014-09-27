
var fs = require("fs");
var sha1 = require('sha1');


getMimeTypeFromFilename = function(filename){
	extension = filename.substr(filename.length-4);
	mimeType = "x-unknown/x-unknown";
	switch(extension.toLowerCase() ){
		case ".mp3":
		 	mimeType = "audio/mpeg";
			break;
			case ".mp4":
			mimeType = "audio/mp4";
			break;
			case ".pdf":
			mimeType = "application/pdf";
			break;
	}
	return mimeType;
};

createMetaDataObject = function(path, filename){
	var curStat = fs.statSync(path + filename);
	var timestamp = curStat.mtime.getTime();
	var hash = sha1(timestamp + curStat);
	return {
		id: hash,
		file: filename,
		size: curStat.size,
		type: getMimeTypeFromFilename(filename),
		title: generateTitle(filename),
		description: generateDescription(filename),
	};
};


isAllowedFile = function(filename, matchPattern){
	return filename.match(matchPattern);
};

generateTitle = function(filename){
	return filename
	.replace(/ \.[^\.]+$/, "")
	.replace(/[_\.]/, " ");
};

generateDescription = function(filename){
	// TODO: geerate a better Descritption
	return generateTitle(filename);
};

/**
 * Generaates the File information
 * @param  {string} path         the Path to the Folder
 * @param  {pattern} matchPattern pattern matching allowed files
 * @return {object}              the meta data object
 */
 exports.getFileInfo = function(path, matchPattern) {
	// Fixme use Async module here 
	metaInfo = [];
	var directoryContents = fs.readdirSync(path);
	for(i=0; i<directoryContents.length; i++){
		curFilename =  directoryContents[i];
		if( isAllowedFile(curFilename, matchPattern)){
			metaInfo.push(createMetaDataObject(path, curFilename));
		}
	}
	return metaInfo;
};