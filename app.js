/* Initalizie Express */
var express = require('express');
var app = express();
var fs = require("fs");


/* Load Modules */
var fs = require('fs');
var fileinfo = require('./lib/ppFile');
var nconf = require('nconf');
nconf.file('./config.js');

/* Setup Templating Engine */
app.set('views', './views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);


/* Setting some Global Variables */
var serverURL = 'http://' + nconf.get('server:host') +':'+ nconf.get('server:port') + '/';
var feedURL = serverURL + 'feed/';

/* ROUTING */

/* Index */
app.get('/', function(req, res) {
	res.render('index', { serverURL:serverURL,feedURL:feedURL, feeds: nconf.get('feeds')});
});

/* Feeds */
app.get('/feed/:slug', function(req, res) {
	var slug = req.params.slug;
	var feed = nconf.get('feeds:'+slug);
	var fileExt = nconf.get('allowed_file_pattern');

	if(typeof(feed) === "undefined"){
		res.status('404').render('404');
	}

	var items = fileinfo.getFileInfo(feed.src, fileExt);
	res.render('feed-atom', { serverURL:serverURL,meta:feed, items:items, slug:slug});
});

/* Files*/
app.get('/file/:slug/:filename', function(req, res) {
	// TODO: remove dublication between files and Feeds
	var filename = req.params.filename;
	var slug = req.params.slug;
	var feed = nconf.get('feeds:'+slug);
	var fileExt = nconf.get('allowed_file_pattern');
	if(typeof(feed) === "undefined"){
		res.status('404').render('404');
	}
	var items = fileinfo.getFileInfo(feed.src, fileExt);
	for(i=0; i<items.length; i++){
		console.log(items[i].file);
		if (filename === items[i].file){
			var fileData = items[i];
			var fileContents = fs.readFileSync(feed.src + fileData.file);

			res.setHeader("Content-Type",fileData.type);
			res.setHeader("Content-Disposition","attachment; "+fileData.name);
			res.write(fileContents);
			res.end();
			return; // Exit the File as wi
		}
	}
	res.render("404", {});
});


/* Run the Server */
var server = app.listen(nconf.get('server:port'), nconf.get('server:host'), function() {
 console.log('Personal Podcast Server Started! \nlistening at: %s',serverURL);
});