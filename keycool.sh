#!/bin/bash
# xev

# Use this two commands to swap Home and Delete 
# xmodmap -e "keycode 119 = Home"
# xmodmap -e "keycode 110 = Delete"

xmodmap -e "keycode 108 = Escape"
xmodmap -e "keycode 127 = Insert"

# Use this six commands to swap CapsLock and Ctrl
# xmodmap -e "remove Lock = Caps_Lock"
# xmodmap -e "remove Control = Control_L"
# xmodmap -e "keycode 66 = Control_L"
# xmodmap -e "keycode 37 = Caps_Lock"
# xmodmap -e "add Lock = Caps_Lock"
# xmodmap -e "add Control = Control_L"
