```bash
# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlan0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# install
ifup wlan0
apt install git make
git clone --depth 1 https://github.com/wizawu/sysconf.git /home/wizawu/.sysconf
cd /home/wizawu/.sysconf
make all
```
