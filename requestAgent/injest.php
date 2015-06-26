<?php

// TODO: this error handler doesn't seem to be working need to do more research
function myErrorHandler($errno, $errstr, $errfile, $errline)
{
        echo " [$errno] $errstr \n";

        return true;
}

$old_error_handler = set_error_handler("myErrorHandler");

echo " starting injest process... \n";

//require_once__DIR__.'/vendor/autoload.php';
require_once('/home/ed/requestAgent/vendor/autoload.php');

// load the Rabbit client classes
use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

// retrieve the request data and parse to json
$json = file_get_contents('php://input');
echo " json string \n";
var_dump($json);
$obj = json_decode($json, TRUE);
echo " json object \n";
var_dump($obj);
echo " REQUEST object \n";
var_dump($_REQUEST);

// connect to rabbitMQ
echo " opening connection... \n";
$connection = new AMQPConnection('localhost', 5672, 'guest', 'guest');
//if($connection->isConnected() == false) { echo " no connection established\n"; };

echo " getting channel... \n";
$ch = $connection->channel();
if($ch->is_open !== true) { echo " no channel object"; };

// create the exchange and bind to the attributes queue
// TODO: need to have the exchange name come from rabbit
$ch->exchange_declare('attributeExchange', $type = "direct", false, false, $auto_delete = true);
$ch->queue_bind('attributes', 'attributeExchange', 'attribute');

// create a new message that we will reuse for all the values in the request
echo " setting up new message... \n";
$body = "place holder";
$properties = array('content_type' => 'text/plain', 'delivery_mode' => 2);
$msg = new AMQPMessage($body, $properties);

// todo: would like to set data limit here, more research needed
//$bytes = 150;
//$msg->setBodySizeLimit($bytes);

// loop through each json object and publish the value to rabbit
foreach($obj['data'] as $array) {

        $body = '{"key":"' . $array['key'] . '", "value":"' . $array['value'] . '"}';
        $msg->setBody($body);
        echo " sending message\n";
        $ch->basic_publish($msg, 'attributeExchange', 'attribute');
}

// todo: need to find out why connection closing was failing, and try to modularize the connection, possibly pooling?
//echo " closing channel and connection.\n";
//$ch->close();
//$connection->close();

?>

