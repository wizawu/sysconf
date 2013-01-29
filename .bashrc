
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

complete -cf sudo
xrdb /home/wiza/.Xresources
.wizacfg/motto.sh

alias ls='ls --color=auto'
alias vi='vim'
alias viR='vim -R'
alias gor='go run'
alias gob='go build'
alias timef='/usr/bin/time -f "%E\n%M\n"'
alias gcc='gcc -std=c11 -fms-extensions'

PS1='${debian_chroot:+($debian_chroot)}\[\033[01;35m\]\u\[\033[01;30m\]@\[\033[01;32m\]\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '

export XIM="SCIM"
export XMODIFIERS=@im=SCIM
export GTK_IM_MODULE=scim
export QT_IM_MODULE=scim
export XIM_PROGRAM="scim -d"

export JAVA_HOME=/usr/lib/jvm/jdk1.7.0_05
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$PATH:$JAVA_HOME/bin

export HADOOP_HOME=/home/wiza/basement/hadoop-1.0.3
export HADOOP_HOME_WARN_SUPPRESS=1
export PATH=$PATH:$HADOOP_HOME/bin

export HBASE_HOME=/home/wiza/basement/hbase-0.94.1
export PATH=$PATH:$HBASE_HOME/bin

export ZOOKEEPER_HOME=/home/wiza/basement/zookeeper-3.4.3
export PATH=$PATH:$ZOOKEEPER_HOME/bin

export REDIS_HOME=/home/wiza/basement/redis-2.4.16
export PATH=$PATH:$REDIS_HOME/src

export GOROOT=/usr/lib/go
export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOBIN

