var config = require('./appconfig');
var logger = require('./logger');
var queue = require('./queue');
var messageStore = require('./messageStore');

queue.initialize();

// wireup between queue and logger to keep them abstracted
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
    clearInterval(interval);
    queue.close();
    messageStore.close();
    logger.close();
    process.exit();
});

// main loop that wires up the queue and data store end points
var interval = setInterval(function() {

    var message = queue.getMessage();

    if(message) {
        // this is where we map the specific value to the message store
        messageStore.send(message.value);

        // do this verify that the message is handled in case of responseAgent failure
        queue.acknowledge();
    }

}, config.pollTime);
