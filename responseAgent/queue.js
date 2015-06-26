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

exports.initialize = function(){
    var url = 'amqp://' + config.user + ':' + config.password + '@' + config.server + ':' + config.port + '/';
    console.log('attempt to connect to queue: ' + url);
    this.connection = amqp.connect(url);

    this.connection.then(function(conn){
        return conn.createChannel().then(function(ch) {
            ch.assertQueue('attributes', {durable: true, autoDelete: false, exclusive: false});
            console.log('channel confirmed');
            this.channel = ch;
        })
    });

};

exports.sendMessage = function(exchange, messageObject) {
    if(this.channel){
        this.channel.publish(exchange, messageObject);
    }
};

exports.getMessage = function() {
    if (this.channel) {

        return this.channel.consume('attributes', function (msg) {

            var jsonObj = JSON.parse(msg.content.toString());

            return jsonObj;
        });

    } else {
        console.log('getMessage: channel not available');
        return null;
    }
};

exports.acknowledge = function() {
  this.channel.ack();
};

exports.close = function() {
    if(connection){
        connection.close();
    }
};