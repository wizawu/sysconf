#!/bin/bash

# switch to dvorak
# setxkbmap dvorak

# retrieve keycode with xev

# swap Home and Delete 
# xmodmap -e "keycode 119 = Home"
# xmodmap -e "keycode 110 = Delete"

# set right Alt to Esc
xmodmap -e "keycode 108 = Escape"

# set Pause to Insert
# xmodmap -e "keycode 127 = Insert"

# swap CapsLock and Ctrl
# xmodmap -e "remove Lock = Caps_Lock"
# xmodmap -e "remove Control = Control_L"
# xmodmap -e "keycode 66 = Control_L"
# xmodmap -e "keycode 37 = Caps_Lock"
# xmodmap -e "add Lock = Caps_Lock"
# xmodmap -e "add Control = Control_L"
