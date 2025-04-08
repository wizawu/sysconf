### Provision New System

```bash
# edit /etc/network/interfaces
auto lo
iface lo inet loopback
iface wlan0 inet dhcp
    wpa-ssid ssid
    wpa-psk password

# run as root
ifup wlan0
echo "deb https://mirrors.tencent.com/ubuntu plucky main restricted universe multiverse" > /etc/apt/sources.list
apt-get update
apt-get install git make ansible curl openssh-client openssh-server sudo
echo > /etc/apt/sources.list

# git clone this repository to /home/wizawu/.sysconf
cd /home/wizawu/.sysconf
make install
```

### Disable GUI

```bash
# edit /etc/default/grub
GRUB_CMDLINE_LINUX="text"

update-grub
systemctl set-default multi-user.target
```

### Install oneAPI for NVIDIA GPUs

```bash
# edit /etc/modprobe.d/nvidia-installer-disable-nouveau.conf and reboot
blacklist nouveau
options nouveau modeset=0

# run as root
./cuda_12.8..._linux.run --tmpdir ./tmp --no-drm --no-opengl-libs --run-nvidia-xconfig
apt-get install intel-deep-learning-essentials
./oneapi-for-nvidia-gpus-2025.1.0-linux.sh
```

The `--run-nvidia-xconfig` flag enables xserver to detect outputs (DP, HDMI).
