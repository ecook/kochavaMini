<?php

function myErrorHandler($errno, $errstr, $errfile, $errline)
{
        echo " [$errno] $errstr \n";

        return true;
}

$old_error_handler = set_error_handler("myErrorHandler");

echo " starting injest process... \n";

//require_once__DIR__.'/vendor/autoload.php';
require_once('/home/ed/requestAgent/vendor/autoload.php');

use PhpAmqpLib\Connection\AMQPConnection;
use PhpAmqpLib\Message\AMQPMessage;

$json = file_get_contents('php://input');
echo " json string \n";
var_dump($json);
$obj = json_decode($json, TRUE);
echo " json object \n";
var_dump($obj);
echo " REQUEST object \n";
var_dump($_REQUEST);

$bytes = 150;

echo " opening connection... \n";
$connection = new AMQPConnection('localhost', 5672, 'guest', 'guest');
//if($connection->isConnected() == false) { echo " no connection established\n"; };

echo " getting channel... \n";
$ch = $connection->channel();
if($ch->is_open !== true) { echo " no channel object"; };

$ch->exchange_declare('attributeExchange', $type = "direct", false, false, $auto_delete = true);
$ch->queue_bind('attributes', 'attributeExchange', 'attribute');

echo " setting up new message... \n";
$body = "place holder";
$properties = array('content_type' => 'text/plain', 'delivery_mode' => 2);
$msg = new AMQPMessage($body, $properties);
//$msg->setBodySizeLimit($bytes);

foreach($obj['data'] as $array) {

        $body = '{"key":"' . $array['key'] . '", "value":"' . $array['value'] . '"}';
        $msg->setBody($body);
        echo " sending message\n";
        $ch->basic_publish($msg, 'attributeExchange', 'attribute');
}

//echo " closing channel and connection.\n";
//$ch->close();
//$connection->close();

?>

