export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"

gnome-settings-daemon &
exec ck-launch-session dbus-launch gnome-session
