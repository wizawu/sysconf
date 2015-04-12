#!/bin/sh

export IM="fcitx"
export GTK_IM_MODULE=$IM
export QT_IM_MODULE=$IM
export XMODIFIERS="@im=$IM"

startxfce4 &
awesome
