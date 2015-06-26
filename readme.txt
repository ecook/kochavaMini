Kochava Miniproject :: "Postback Delivery"

architectural design: https://docs.google.com/drawings/d/1YFBGV5UFNv2AfbGh4b-sYHtJ-1LDSFiqmqLBPAvH3Z8/edit?usp=sharing
git repo: https://github.com/ecook/kochavaMini.git

to run a responseAgent cd to /home/ed/kochavaMini/responseAgent and type nodejs index.js
to change the stathat account just edit the messageStoreConfig.json file



how to setup server:

install node and npm
	sudo apt-get install nodejs
	sudo apt-get install npm

install rabbitMQ
	sudo apt-get install rabbitmq-server
	sudo rabbitmq-plugins enable rabbitmq_management
	stop and restart the server
	invoke-rc.d rabbitmq-server stop
	invoke-rc.d rabbitmq-server start

	url to management panel: http://<server IP>:15672/#/
	user: guest
	pwd: guest

	using the management panel, you can import the rabbit.json file to setup the queues and exchanges
	->overview tab
		bottom of the page, import, choose file. then click on upload broker definitions

create directory for response agent and initialize node project
    // don't need to create new project, instead pull from git repo and skip this section
    // NOTE: you will have to do an npm install from the responseAgent directory and install composer for the
    //       requestAgent.

        mkdir responseAgent
        cd responseAgent
        npm init
        npm install amqplib --save
        npm install stathat --save

install NGINX from: https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-on-ubuntu-12-04
	sudo apt-get install nginx
	sudo apt-get install php5-fpm
	sudo apt-get install php5-cli

	sudo nano /etc/php5/fpm/php.ini
	   change cgi.fix_pathinfo=1 to 0
	sudo service php5-fpm restart
	test nginx : http://104.131.128.106/
	sudo nano /etc/nginx/sites-available/default
	from: http://stackoverflow.com/questions/25591040/nginx-serves-php-files-as-downloads-instead-of-executing-them
	  // need to uncomment the error sections
	  // need to set the root path to the requestAgent folder
	  // add index.php to the index line
	  // uncomment only the last three lines of the location block
		  location ~ \.php$ {
								# fastcgi_split_path_info ^(.+\.php)(/.+)$;
								# # NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
								#
								# # With php5-cgi alone:
								# fastcgi_pass 127.0.0.1:9000;
								# With php5-fpm:
								fastcgi_pass unix:/var/run/php5-fpm.sock;
								fastcgi_index index.php;
								include fastcgi_params;
								}
	sudo nano /usr/share/nginx/html/info.php
		add the following and save the file:
			<?php
				phpinfo();
			?>
	sudo service nginx restart
	test the php page: http://<server IP>/info.php

	install composer to enable the amqp lib for php  // NOTE: do this from the requestAgent folder
	https://getcomposer.org/doc/00-intro.md
	curl -sS https://getcomposer.org/installer | php
	create a file named composer.json and add the following to it:
		{
			"require":  {
				"videlalvara/php-amqplib": "2.2.*"
			}
		}
	then run: php composer.phar install
