### Install
```bash
# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlan0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# run scripts
ifup wlan0
apt install git make
git clone --depth 1 https://github.com/wizawu/sysconf.git /home/wizawu/.sysconf
cd /home/wizawu/.sysconf
make all
```

### Disable GUI
```bash
# edit /etc/default/grub
GRUB_CMDLINE_LINUX="text"

update-grub
systemctl set-default multi-user.target
```

### Fix Intel Iris Xe graphics
```bash
# change the following line in /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="splash quiet nomodeset"
# to
GRUB_CMDLINE_LINUX_DEFAULT="splash quiet i915.enable_psr=0"

update-grub
```

### Enable more cpufreq governors (than powersave and performance)
```bash
# modify the following line in /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="... intel_pstate=disable"

update-grub
```
