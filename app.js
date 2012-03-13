
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

// 短縮URLでのアクセス
app.get(/^\/(\w{7})$/, routes.shorturl);

// 短縮URLの生成API
app.get('/create', routes.createShortUrl);

// 短縮URLの解決API
app.get('/expand', routes.expandUrlApi);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
