var amqp = require('amqplib');
var config = require('./queueConfig.json');

var connection = null;
var channel = null;

exports.isConnected = function() {
    if(this.channel) {
        return this.channel.isConnected();
    } else {
        return false;
    }

};

exports.initialize = function(processMessage){
    //var url = 'amqp://' + config.user + ':' + config.password + '@' + config.server + ':' + config.port + '/';
    var url = 'amqp://' + config.server + ':' + config.port;
    console.log('attempt to connect to queue: ' + url);
    this.connection = amqp.connect(url);

    this.connection.then(function(conn){
        return conn.createChannel().then(function(ch) {
            ch.assertQueue(config.queueName, {durable: true, autoDelete: false, exclusive: false});
            console.log('channel confirmed');
            ch.consume(config.queueName, function(message) {
                console.log(message.content.toString());
                var success = processMessage(message.content.toString());
                // TODO: have to cache the messages to verify delivery because stathat is asynchronous
                //if (success) {
                //    ch.ack(message);
                //    console.log('ack message');
                //}
                //else {
                //    ch.nack(message);
                //    console.log('noack message');
                //}
            }, {noAck: true});
        })
    });

};

exports.sendMessage = function(exchange, messageObject) {
    if(this.channel){
        this.channel.publish(exchange, messageObject);
    }
};

exports.close = function() {
    if(connection){
        connection.close();
    }
};