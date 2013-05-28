
# If not running interactively, don't do anything
[[ $- != *i* ]] && return

complete -cf sudo
xrdb /home/wiza/.Xresources
/home/wiza/.wizacfg/motto.sh

alias ls='ls --color=auto'
alias vi='vim'
alias vr='vim -R'
alias timef='/usr/bin/time -f "TIME:\t%E\nMEM:\t%M KB\n"'
alias gcc='gcc -std=c11 -fms-extensions'
alias g++='g++ -std=c++11'
alias clang='clang -std=c11 -W'
alias clang++='clang++ -std=c++11 -W'
alias cythonc='clang -I/usr/include/python3.3m -lpython3.3m'

PS1='${debian_chroot:+($debian_chroot)}\[\033[01;35m\]\u\[\033[01;30m\]@\[\033[01;32m\]\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
eval `dircolors /home/wiza/.dircolors`

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

export HUGS_HOME=/home/wiza/workspace/hugs98-Sep2006
alias runhugs='HUGSDIR='${HUGS_HOME}'/hugsdir '${HUGS_HOME}'/src/runhugs'
alias hugs='HUGSDIR='${HUGS_HOME}'/hugsdir '${HUGS_HOME}'/src/hugs'
