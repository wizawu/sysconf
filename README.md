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

# run scripts
update-grub
systemctl set-default multi-user.target
```
