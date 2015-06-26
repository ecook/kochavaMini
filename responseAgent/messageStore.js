var stathat = require('stathat');
var config = require('./messageStoreConfig.json');

exports.sendAttribute = function(atrib){
    return stathat.trackEZCount(config.user, atrib, 1, function(status, json){
        console.log(status);

        if(status == 200){
            return true;
        } else {
            return false;
        }
    });
};

exports.close = function() {
    // any clean up code would go here for the message store
};