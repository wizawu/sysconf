[program:shadowsocks]
autorestart=true
command=/home/{{user}}/.sysconf/bin/shadowsocks -c /home/{{user}}/repos/vpsconf/templates/shadowsocks.json
killasgroup=true
redirect_stderr=false
startretries=99
stderr_logfile=/var/log/shadowsocks.err
stdout_logfile=/var/log/shadowsocks.log
stopasgroup=true
stopsignal=KILL
