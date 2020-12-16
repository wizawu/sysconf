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
	dd if=/dev/zero of=/var/swap bs=4M count=512
	chmod 600 /var/swap && mkswap /var/swap
	swapon /var/swap && swapon -s

jdk:
	tsocks wget -c 'https://github.com/graalvm/graalvm-ce-builds/releases/download/vm-20.3.0/graalvm-ce-java11-linux-amd64-20.3.0.tar.gz' -O ~/tmp/graalvm-ce-java11-linux-amd64.tgz
	sudo mkdir -p /usr/lib/jvm/graalvm-ce-java11-linux-amd64
	sudo tar xf ~/tmp/graalvm-ce-java11-linux-amd64.tgz -C /usr/lib/jvm/graalvm-ce-java11-linux-amd64 --strip-components=1
	sudo rm -f /usr/lib/jvm/default-jdk
	sudo ln -s /usr/lib/jvm/graalvm-ce-java11-linux-amd64 /usr/lib/jvm/default-jdk
	sudo bash -c "rm /usr/lib/jvm/default-jdk/bin/{node,npm,npx}"
