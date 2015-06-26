var config = require('./appconfig');
var logger = require('./logger');
var queue = require('./queue');
var messageStore = require('./messageStore');

// wireup between queue and logger to keep them abstracted
// so we could write directly to a file, but message queue is more efficient
// TODO: need to flesh out the logging, or rather implement existing logging lib
var logMessage = function(message) {
    if(queue.isConnected()){
        queue.sendMessage( 'log', message);
    } else {
        console.log(message);
    }

};

logger.initialize(config.instanceName, logMessage);

// this is to capture Ctrl-C key press or process stop event
process.once('SIGINT', function() {
    queue.close();
    messageStore.close();
    logger.close();
    process.exit();
});

// this is where we map the specific value to the message store
var processMessage = function(message) {
    if(message) {

        try {

            var jsonObj = JSON.parse(message);

            return messageStore.sendAttribute(jsonObj.value);

        } catch(err) {
            return false;
        }
    }

    return false;
};

// this is where we hand off polling the queue
queue.initialize(processMessage, logger.log);

