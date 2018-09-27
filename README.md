```bash
# install wireless driver
wget http://mirrors.kernel.org/ubuntu/pool/main/l/linux-firmware/linux-firmware_1.169_all.deb
dpkg -i linux-*.deb
modprobe -r ath10k_pci
modprobe ath10k_pci

# install wpasupplicant
wget http://ftp.cn.debian.org/debian/pool/main/p/pcsc-lite/libpcsclite1_1.8.20-1_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/libn/libnl3/libnl-genl-3-200_3.2.27-2_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/libn/libnl3/libnl-3-200_3.2.27-2_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/w/wpa/wpasupplicant_2.4-1+deb9u1_amd64.deb
dpkg -i *_amd64.deb

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
make
```
