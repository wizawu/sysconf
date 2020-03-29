# basic
set -Ux EDITOR vim
set -Ux GRADLE_HOME /opt/gradle
set -Ux JAVA_HOME /usr/lib/jvm/default-java
set -Ux LANG en_US.UTF-8
set -Ux LC_ALL en_US.UTF-8
set -Ux NPM_CONFIG_REGISTRY http://registry.npm.taobao.org
set -Ux PATH $HOME/.sysconf/bin:$GRADLE_HOME/bin:/usr/sbin:/sbin:$PATH
set -Ux TERM rxvt
set -Ux TRASH_DIR $HOME/.local/share/Trash

# alias
alias ansible-hostvars='ansible -m debug -a var=hostvars -i'
alias apt-find='apt-cache search'
alias apt='sudo apt'
alias clangfmt='clang-format -style="{IndentWidth: 2, ColumnLimit: 120}"'
alias cmemchk='valgrind --tool=memcheck --leak-check=full'
alias datev='date +%Y%m%d%H%M%S'
alias df='df -T'
alias dnstest='fping -c5 1.0.0.1 8.8.8.8 223.6.6.6'
alias dpkg-select='bash -c "dpkg --get-selections *\$0*"'
alias ffunix='vi -c ":set ff=unix" -c ":wq"'
alias g++='g++ -std=c++11'
alias gcc='gcc -std=c11 -fms-extensions'
alias gerrit-push-branch='bash -c "git push origin HEAD:refs/for/\$0"'
alias gerrit-push-topic='bash -c "git push origin HEAD:refs/for/master/\$0"'
alias gerrit-push='git push origin HEAD:refs/for/master'
alias git-amend='git commit --amend --no-edit'
alias la='ls -A'
alias lh='ls -lh'
alias ll='ls -l'
alias ls='ls --color=auto'
alias psync='rsync -Pz --info=progress2'
alias restart-proxy='supervisorctl restart shadowsocks'
alias rm='rm -I'
alias sar-dp='sar -dp'
alias tar-strip='bash -c "tar xf \$0 --strip-components=\$1"'
alias tgit="tsocks git"
alias timev="/usr/bin/time -v"
alias tree='tree -C'
alias vi='vim'
alias vr='vim -R'
alias winzip='unzip -O cp936'
alias wmount='sudo mount -o rw,uid=$UID,iocharset=utf8'
alias xcp='xsel -b <'
