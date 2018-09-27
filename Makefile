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
	git fetch origin
	git reset --hard origin/master
	ansible-playbook install.yml -i inventory -e user=wizawu
	apt autoremove --purge -y
	apt autoclean -y
	apt clean -y

####
# DPI: 118
####
# How to hide mate-panel?
# 1. Right-click top panel, 'Delete This Panel'
# 2. Right-click bottom panel, 'New Panel'
# 3. Right-click bottom panel, 'Delete This Panel'
# 4. Right-click top panel (new), 'Properties':
#    * Expand = false
#    * Autohide = true
#    * Show hide buttons = true
#    * Arrows on hide buttons = true
#    * Solid color -> Style = Transparent
# 5. Click left hide button
####
