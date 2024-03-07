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

rust: export RUSTUP_UPDATE_ROOT = https://mirrors4.tuna.tsinghua.edu.cn/rustup/rustup

rust:
	curl -s https://sh.rustup.rs | \
		sed -e 's/dist/archive\/1.26.0/g' | \
		sh /dev/stdin -vy --default-toolchain=stable --profile=complete --no-modify-path

proxy:
	sudo ansible-playbook proxy.yml

addon:
	sudo ansible-playbook addon.yml

etherpad:
	docker run -d -p 172.17.0.1:3030:9001 --restart always --name etherpad etherpad/etherpad

excalidraw:
	docker run -d -p 172.17.0.1:6060:80 --restart always --name excalidraw excalidraw/excalidraw

vim/kotlin:
	git submodule update dotfiles/kotlin-vim
	mkdir -p ~/.vim/syntax ~/.vim/indent ~/.vim/ftdetect ~/.vim/ftplugin
	cp dotfiles/kotlin-vim/syntax/kotlin.vim ~/.vim/syntax/kotlin.vim
	cp dotfiles/kotlin-vim/indent/kotlin.vim ~/.vim/indent/kotlin.vim
	cp dotfiles/kotlin-vim/ftdetect/kotlin.vim ~/.vim/ftdetect/kotlin.vim
	cp dotfiles/kotlin-vim/ftplugin/kotlin.vim ~/.vim/ftplugin/kotlin.vim
