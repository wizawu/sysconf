default: install clean
all: apt ssh install clean

apt:
	apt-key adv --keyserver keyserver.ubuntu.com --recv 04EE7237B7D453EC
	echo "deb http://mirrors.tuna.tsinghua.edu.cn/debian buster main" > /etc/apt/sources.list
	apt update
	apt install -y ansible openssh-client openssh-server sudo
	echo > /etc/apt/sources.list

ssh:
	rm -f ~/.ssh/id_rsa
	ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
	cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
	ssh -o "StrictHostKeyChecking=no" root@127.0.0.1 echo ok

install:
	ansible-playbook install.yml -b -e user=wizawu -v

clean:
	apt autoremove --purge -y
	apt clean -y

swap:
	echo 60 >> /proc/sys/vm/swappiness
	dd if=/dev/zero of=/swap bs=4M count=1024
	chmod 600 /swap && mkswap /swap
	swapon /swap && swapon -s

proxy:
	sudo ansible-playbook proxy.yml

samba:
	ansible-playbook samba.yml

cron:
	ansible-playbook cron.yml
