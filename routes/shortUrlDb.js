var redis = require('redis');
var randomstring = require('randomstring');
var client = redis.createClient();
client.on('error', function(err) {
	console.log(err);
});

exports.expandUrl = function(shortUrlStr, callback) {
	var redisQuery = 'surl:' + shortUrlStr;
	var client = redis.createClient();
	client.get(redisQuery, function(err, replies) {
		if (err) {
			callback(err, null);
			return;
		}
		if (replies !== null) {
			var expandurl = replies.toString()
			callback(null, expandurl);
		} else {
			callback(null, null);
		}
	});
};

exports.createShortUrl = function(url, callback) {
	var redisQuery = 'url:' + url;
	client.get(redisQuery, function(err, replies) {
		if (err) {
			callback(err, null);
			return;
		}
		if (replies !== null) {
			var shortUrl = replies.toString()
			callback(null, shortUrl);
		} else {
			// DBに無ければ生成
			var shortUrl = randomstring.generate(7);
			callback(null, shortUrl);

			// DB登録処理
			client.set(redisQuery, shortUrl);
			client.set('surl:' + shortUrl, url);
		}
	});
};
