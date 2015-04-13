#!/bin/sh

export LC_CTYPE="zh_CN.UTF-8"
export GTK_IM_MODULE="scim"
export QT_IM_MODULE="scim-bridge"
export XMODIFIERS="@im=SCIM"
scim -d

startxfce4 &
awesome
