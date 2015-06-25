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
    var url = 'amqp://' + config.user + ':' + config.password + '@' + config.server + ':' + config.port;
    console.log('attempt to connect to queue: ' + url);
    amqp.connect(url).then( function(conn){
        this.connection = conn;

        this.connection.createChannel().then(function(ch){
            this.channel = ch;
            this.channel.assertQueue('attributes');
        }).then(function() {
            console.log('create channel failed');
        }).then(function() {
            console.log('create connection failed');
        })
    });
};

exports.sendMessage = function(exchange, messageObject) {
    if(this.channel){
        this.channel.publish(exchange, messageObject);
    }
};

exports.getMessage = function() {
    if (channel) {

        var stringMessage = this.channel.consume('attributes', function (msg) {
            return msg.content.toString();
        });

        var jsonObj = JSON.parse(stringMessage);

        return jsonObj;
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