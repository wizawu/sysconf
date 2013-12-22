#!/bin/sh

export IM="fcitx"
export GTK_IM_MODULE=$IM
export QT_IM_MODULE=$IM
export XMODIFIERS="@im=$IM"

dconf write /org/gnome/settings-daemon/plugins/cursor/active false
exec gnome-session --session=awesome &
awesome
