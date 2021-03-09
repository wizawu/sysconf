FROM xxxx.mirror.aliyuncs.com/library/haproxy:2.2.4

RUN touch /etc/haproxy.cfg
RUN echo "defaults" >> /etc/haproxy.cfg
RUN echo "    timeout connect 10s" >> /etc/haproxy.cfg
RUN echo "    timeout client  60s" >> /etc/haproxy.cfg
RUN echo "    timeout server  60s" >> /etc/haproxy.cfg
RUN echo "userlist basic" >> /etc/haproxy.cfg
RUN echo "    user %USER password %PASSWORD" >> /etc/haproxy.cfg
RUN echo "listen auth\n    mode http\n    bind *:80" >> /etc/haproxy.cfg
RUN echo "    server backend %SERVER check" >> /etc/haproxy.cfg
RUN echo "    acl basic_user http_auth(basic)" >> /etc/haproxy.cfg
RUN echo "    http-request auth if !basic_user" >> /etc/haproxy.cfg

RUN echo "#!/bin/sh" >> /entrypoint.sh
RUN echo "sed -i -e s/%USER/\$USER/g /etc/haproxy.cfg" >> /entrypoint.sh
RUN echo "sed -i -e s/%PASSWORD/\$PASSWORD/g /etc/haproxy.cfg" >> /entrypoint.sh
RUN echo "sed -i -e s/%SERVER/\$SERVER/g /etc/haproxy.cfg" >> /entrypoint.sh
RUN echo "haproxy -f /etc/haproxy.cfg" >> /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
