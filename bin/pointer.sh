#!/bin/sh

set -x
sudo modprobe -r elan_i2c hid_multitouch
sudo modprobe elan_i2c hid_multitouch
xinput set-prop 'pointer:Razer Razer DeathAdder' 'libinput Accel Speed' -0.8
xinput set-prop 'pointer:Razer Razer DeathAdder V2' 'libinput Accel Speed' -0.4
