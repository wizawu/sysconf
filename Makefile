all: apt ssh play

apt:
	echo "deb http://mirrors.ustc.edu.cn/debian/ sid main" > /etc/apt/sources.list
	apt update
	apt install -y ansible apt-transport-https dirmngr openssh-client openssh-server sudo

ssh:
	rm -f ~/.ssh/id_rsa
	ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
	cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
	ssh -o "StrictHostKeyChecking=no" root@127.0.0.1 echo ok

play:
	ansible-playbook install.yml -i inventory -e user=wizawu

dpi:
	echo 118