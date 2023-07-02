default: install clean
all: apt ssh install clean

apt:
	apt-key adv --keyserver keyserver.ubuntu.com --recv 04EE7237B7D453EC
	echo "deb https://mirrors.cloud.tencent.com/debian bookworm main" > /etc/apt/sources.list
	apt update
	apt install -y ansible openssh-client openssh-server sudo
	echo > /etc/apt/sources.list

ssh:
	rm -f ~/.ssh/id_rsa
	ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
	cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
	ssh -o "StrictHostKeyChecking=no" root@127.0.0.1 echo ok

install:
	ansible-playbook -b -e user=wizawu -v install.yml

debug:
	ansible-playbook -b -e user=wizawu -v debug.yml

clean:
	apt autoremove --purge -y
	apt clean -y

swap:
	echo 60 >> /proc/sys/vm/swappiness
	dd if=/dev/zero of=/swap bs=4M count=1024
	chmod 600 /swap && mkswap /swap
	swapon /swap && swapon -s

cron:
	ansible-playbook cron.yml

proxy:
	sudo ansible-playbook proxy.yml

addon:
	sudo ansible-playbook addon.yml

rustpad:
	docker run --rm -d -p 172.17.0.1:3030:3030 --name rustpad ekzhang/rustpad
