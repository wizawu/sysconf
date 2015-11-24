#!/bin/sh

export LC_CTYPE="zh_CN.UTF-8"
export XMODIFIERS="@im=xsunpinyin"
export GTK_IM_MODULE=xim
export QT_IM_MODULE=xim

xsunpinyin -d
xset -b
startxfce4 &
(sleep 2 && synclient TapButton2=3) &
(sleep 2 && hsetroot -full /usr/share/awesome/themes/default/background.png) &
awesome
