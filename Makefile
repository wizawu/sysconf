install:
	ansible-playbook -b -e user=wizawu install.yml

cron:
	ansible-playbook cron.yml

proxy:
	sudo ansible-playbook proxy.yml

mysql:
	docker rm -f mysql
	sudo ansible-playbook mysql.yml

etherpad:
	docker rm -f etherpad
	docker run -d -p 172.17.0.1:3030:9001 --restart always --name etherpad etherpad/etherpad

excalidraw:
	docker rm -f excalidraw
	docker run -d -p 172.17.0.1:6060:80 --restart always --name excalidraw excalidraw/excalidraw
	docker exec excalidraw sed -i -e 's/https:\/\/excalidraw.nyc3.cdn.digitaloceanspaces.com/http:\/\/172.17.0.1/g' /usr/share/nginx/html/index.html
