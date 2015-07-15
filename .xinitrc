#!/bin/sh

export LC_CTYPE="zh_CN.UTF-8"
export GTK_IM_MODULE="scim"
export QT_IM_MODULE="scim-bridge"
export XMODIFIERS="@im=SCIM"

xset -b
scim -d
startxfce4 &
(sleep 2 && hsetroot -full /usr/share/awesome/themes/default/background.png) &
awesome
