```bash
# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlp1s0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# install
ifup wlp1s0
apt install git make
git clone --depth 1 https://github.com/wizawu/sysconf.git
cd sysconf
make all
```
