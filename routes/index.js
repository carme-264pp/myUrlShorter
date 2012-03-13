
/*
 * GET home page.
 */
var urlReg = /(^https?:\/\/.+)$/;
var surlReg = /(^http?:\/\/.+\/)(\w{7})\/?$/;
var shortUrlDb = require('./shortUrlDb');

exports.index = function(req, res){
  res.render('index', { title: 'my url shorter' })
};

exports.shorturl = function(req, res) {
	console.log(req.params);
	shortUrlDb.expandUrl(req.params[0], function(err, url) {
		if (err) {
			res.render('error', { status: 500, message: 'Internal Server Error' });
		} else {
			if (url) {
				res.redirect(url);
			} else {
				res.render('error', { status: 404, message: 'Not Found' });
			}
		}
	});
};

exports.expandUrlApi = function(req, res){
	var requestUrl = String(req.query['url']);
	var regUrl = surlReg.exec(requestUrl);
	if (!regUrl) {
		res.json({'status': 'Invalid URL'});
		return;
	}
	console.log(regUrl);
	shortUrlDb.expandUrl(regUrl[2], function(err, url) {
		if (err) {
			res.json({'status': 'Server Error'});
			return;
		} else {
			if (url) {
				res.json({'status': 'success', 'url': url});
			} else {
				res.json({'status': 'NotFound'});
			}
		}
	});
};

exports.createShortUrl = function(req, res) {
	console.log('create');
	var query = req.query;
	var requestUrl = String(query['url']);
	var regUrl = urlReg.exec(requestUrl);

	if (regUrl === null) {
		res.json({'status': 'url error'});
		return;
	}
	console.log(regUrl[1]);
	// 既にDBにあるかどうかチェック
	shortUrlDb.createShortUrl(regUrl[1], function(err, shortUrl) {
		if (err) {
			res.json({'status': 'database error'});
			return;
		}
		res.json({'status': 'success', 'shortUrl': shortUrl});
	});
};
