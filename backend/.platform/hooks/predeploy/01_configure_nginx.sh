#!/bin/bash

# Remove all existing nginx configurations
rm -f /etc/nginx/conf.d/00_elastic_beanstalk.conf
rm -f /etc/nginx/conf.d/00_custom.conf

# Create new nginx configuration
cat > /etc/nginx/conf.d/00_custom.conf << 'EOF'
upstream my_app {
    server 127.0.0.1:5000;
    keepalive 32;
}

server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass          http://my_app;
        proxy_http_version  1.1;
        proxy_set_header    Connection          $connection_upgrade;
        proxy_set_header    Upgrade             $http_upgrade;
        proxy_set_header    Host                $host;
        proxy_set_header    X-Real-IP           $remote_addr;
        proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto   $scheme;
        proxy_connect_timeout   60s;
        proxy_send_timeout      60s;
        proxy_read_timeout      60s;
    }
}
EOF

# Test nginx configuration
nginx -t

# Restart nginx
service nginx restart
