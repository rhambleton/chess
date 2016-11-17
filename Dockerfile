FROM php:7.0-apache
#COPY src/ /var/www/html
COPY .htaccess /var/www/
COPY apache2.conf /etc/apache2/
RUN a2enmod rewrite
RUN service apache2 restart
RUN docker-php-ext-install mysqli