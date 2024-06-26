### Install

```bash
# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlan0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# run as root
ifup wlan0
echo "deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu noble main restricted universe multiverse" > /etc/apt/sources.list
apt-get update
apt-get install git make ansible openssh-client openssh-server sudo
echo > /etc/apt/sources.list

# git clone this repository to /home/wizawu/.sysconf
cd /home/wizawu/.sysconf
make install clean
```

### Disable GUI

```bash
# edit /etc/default/grub
GRUB_CMDLINE_LINUX="text"

update-grub
systemctl set-default multi-user.target
```

### Enable more cpufreq governors (than powersave and performance)

```bash
# modify the following line in /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="... intel_pstate=disable"

update-grub
```
