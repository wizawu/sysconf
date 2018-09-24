```
# install wireless driver
wget http://mirrors.kernel.org/ubuntu/pool/main/l/linux-firmware/linux-firmware_1.164_all.deb
dpkg -i linux-firmware*.deb
modprobe -r ath10k_pci
modprobe ath10k_pci

# install wpasupplicant
wget http://ftp.cn.debian.org/debian/pool/main/p/pcsc-lite/libpcsclite1_1.8.20-1_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/libn/libnl3/libnl-genl-3-200_3.2.27-2_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/libn/libnl3/libnl-3-200_3.2.27-2_amd64.deb
wget http://ftp.cn.debian.org/debian/pool/main/w/wpa/wpasupplicant_2.4-1+deb9u1_amd64.deb
dpkg -i *.deb

# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlp1s0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# install apt packages
echo "deb http://mirrors.ustc.edu.cn/debian/ sid main" > /etc/apt/sources.list
apt update
apt install -y ansible apt-transport-https git openssh-client openssh-server

# run ansible playbook
ssh-keygen -t rsa
cp /root/.ssh/id_rsa.pub /root/.ssh/authorized_keys
ssh root@127.0.0.1 echo ok
git clone -b master --depth 1 https://github.com/wizawu/wizacfg.git
cd wizacfg && ansible-playbook install.yml -i inventory -e user=wizawu
```
