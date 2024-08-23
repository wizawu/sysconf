install:
	ansible-playbook -b -e user=wizawu install.yml

cron:
	ansible-playbook cron.yml

proxy:
	sudo ansible-playbook proxy.yml

addon:
	sudo ansible-playbook addon.yml

etherpad:
	docker rm -f etherpad
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
