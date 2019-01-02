install:
	git fetch origin
	git reset --hard origin/master
	ansible-playbook install.yml -i inventory -e user=wizawu
	update-grub2

apt:
	echo "deb http://mirrors.ustc.edu.cn/debian/ sid main" > /etc/apt/sources.list
	apt-key adv --recv-key 8B48AD6246925553
	apt update
	apt install -y ansible apt-transport-https dirmngr openssh-client openssh-server sudo

ssh:
	rm -f ~/.ssh/id_rsa
	ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
	cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
	ssh -o "StrictHostKeyChecking=no" root@127.0.0.1 echo ok

clean:
	apt autoremove --purge -y
	apt autoclean -y
	apt clean -y

all: apt ssh install clean

####
# DPI: 118
# Font: Sans 10
# Hint: Grayscale|Slight|RGB
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
