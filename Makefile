install:
	ansible-playbook -b -e user=wizawu install.yml

cron:
	ansible-playbook cron.yml

proxy:
	sudo ansible-playbook proxy.yml

addon:
	docker rm -f redis mysql phpmyadmin
	sudo ansible-playbook addon.yml

etherpad:
	docker rm -f etherpad
	docker run -d -p 172.17.0.1:3030:9001 --restart always --name etherpad etherpad/etherpad

excalidraw:
	docker run -d -p 172.17.0.1:6060:80 --restart always --name excalidraw excalidraw/excalidraw

rustup:
	rustup default stable
