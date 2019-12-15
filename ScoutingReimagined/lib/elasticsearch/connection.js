var es = require('elasticsearch');

var client = new es.Client({
    host: 'http://elasticsearch:9200',
    log: 'trace'
});

module.exports = client;
