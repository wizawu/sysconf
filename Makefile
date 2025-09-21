install:
	ansible-playbook -b -e user=wizawu install.yml

cron:
	ansible localhost -b -m cron -a "name=updatedb special_time=daily job='updatedb --prunepaths=/run/user'"

mysql:
	sudo mkdir -p /var/lib/mysql
	sudo chown -R $(USER) /var/lib/mysql
	docker rm -f mysql
	docker run -d \
		--name mysql \
		--restart always \
		--network host \
		--log-opt max-file=10 --log-opt max-size=100m \
		-v /var/lib/mysql:/var/lib/mysql \
		-v $(PWD)/etc/mysql/conf.d:/etc/mysql/conf.d \
		-e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
		docker.io/library/mysql:8.0.22

etherpad:
	docker rm -f etherpad
	docker run -d -p 172.17.0.1:3030:9001 --restart always --name etherpad etherpad/etherpad

excalidraw:
	docker rm -f excalidraw
	docker run -d -p 172.17.0.1:6060:80 --restart always --name excalidraw excalidraw/excalidraw
	docker exec excalidraw sed -i -e 's/https:\/\/excalidraw.nyc3.cdn.digitaloceanspaces.com/http:\/\/172.17.0.1/g' /usr/share/nginx/html/index.html

brook:
	docker rm -f brook
	docker run -d \
		--name brook \
		--restart always \
		--network host \
		--dns 1.2.4.8 --dns 8.8.8.8 \
		--log-opt max-file=10 --log-opt max-size=100m \
		--entrypoint /bin/sh \
		docker.io/wizawu/proxy:latest \
		-c "brook socks5 -i 127.0.0.1 -l 127.0.0.1:1080 & \
		   brook ssclient -i 127.0.0.1 -l 127.0.0.1:1081 \
		   -p $$(jq -r .password /etc/shadowsocks/config.json) \
		   -s $$(jq -r .server /etc/shadowsocks/config.json):$$(jq -r .server_port /etc/shadowsocks/config.json)"

socks:
	docker rm -f socks
	docker run -d \
		--name socks \
		--restart always \
		--network host \
		--dns 1.2.4.8 --dns 8.8.8.8 \
		--log-opt max-file=10 --log-opt max-size=100m \
		-v $(PWD)/roles/socks/files:/opt/proxy -w /opt/proxy \
		--entrypoint /usr/local/bin/npm \
		docker.io/wizawu/proxy:latest \
		run start
