# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# basic
export LANG=en_US.UTF-8
export PATH=$PATH:/sbin:/usr/sbin:~/.wizacfg
complete -cf sudo
source /usr/share/bash-completion/completions/git

# alias
alias ls='ls --color=auto'
alias la='ls -A'
alias ll='ls -l'
alias vi='vim'
alias vr='vim -R'
alias timef='/usr/bin/time -f "TIME:\t%E\nMEM:\t%M KB\n"'
alias gcc='gcc -std=c11 -fms-extensions'
alias g++='g++ -std=c++11'
alias clang='clang -std=c11 -W'
alias clang++='clang++ -std=c++11 -W'
alias cmemchk='valgrind --tool=memcheck --leak-check=full'
alias tgp='tsocks git push'
alias apt='sudo aptitude'

# git
git config --global color.ui true
function parse_git_branch {
  git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/^\1/'
}

# color
PS1='${debian_chroot:+($debian_chroot)}\033[34m\u\033[90m@\033[33m\h\033[90m:\033[94m\w \033[90m$(parse_git_branch)\n\[\033[93m\]\$ \[\033[0m\]'
eval `dircolors /home/wiza/.dircolors`

# Java
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-amd64
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$PATH:$JAVA_HOME/bin

# Go
export GOPATH=$HOME/go
export GOROOT=/usr/lib/go
export PATH=$GOPATH/bin:$PATH
