default: install clean
all: apt ssh install clean

apt:
	echo "deb http://mirrors.ustc.edu.cn/debian stretch main" > /etc/apt/sources.list
	apt update
	apt install -y ansible openssh-client openssh-server sudo

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
	dd if=/dev/zero of=/var/swap bs=4M count=512
	chmod 600 /var/swap && mkswap /var/swap
	swapon /var/swap && swapon -s
