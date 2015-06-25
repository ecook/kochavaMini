var stathat = require('stathat');
var config = require('./messageStoreConfig.json');

exports.sendAtribute = function(atrib){
    stathat.trackEZCount(config.user, atrib, 1, function(status, json){});
};

exports.close = function() {
    // any clean up code would go here for the message store
};