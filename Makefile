default: install clean
all: apt ssh install clean

apt:
	echo "deb http://mirrors.ustc.edu.cn/debian/ sid main" > /etc/apt/sources.list
	apt update
	apt install -y ansible dirmngr openssh-client openssh-server python-minimal sudo

ssh:
	rm -f ~/.ssh/id_rsa
	ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
	cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
	ssh -o "StrictHostKeyChecking=no" root@127.0.0.1 echo ok

install:
	git fetch origin
	git reset --hard origin/master
	ansible-playbook install.yml -b -e user=wizawu -v

clean:
	apt autoremove --purge -y
	apt autoclean -y
	apt clean -y
	yarn cache clean

swap:
	echo 60 >> /proc/sys/vm/swappiness
	dd if=/dev/zero of=/var/swap bs=4M count=512
	chmod 600 /var/swap && mkswap /var/swap
	swapon /var/swap && swapon -s
