var instanceName = 'instance name';
var callback = null;

exports.initialize = function(instanceName, callback) {
    this.instanceName = instanceName;
    this.callback = callback;

    exports.log(exports.level.information, 'initializing log for ' + this.instanceName);
};

exports.level = {};
exports.level.error = 'error';
exports.level.warning = 'warning';
exports.level.information = 'info';

exports.log = function( level, message ) {

    var logMessage = {};

    logMessage.time = new Date();
    logMessage.level = level;
    logMessage.message = message;

    try {
        this.callback(logMessage);
    } catch( err ) {
        console.log('failed logger callback, ' + err.message);
        console.log(logMessage);
    }

};

exports.close = function() {
    this.log(this.level.information, 'closing log for ' + this.instanceName)
};
