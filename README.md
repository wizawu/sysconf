Install `firmware-iwlwifi`, `wpasupplicant` and their dependencies manually.

```
echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main" > /etc/apt/sources.list.d/ansible.list

apt-get update
apt-get install -y git aptitude ansible openssh-server openssh-client

git clone -b master --depth 1 https://github.com/wizawu/wizacfg.git

# For ansible ssh
ssh-keygen -t rsa
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

ansible-playbook install.yml -v -i inventory -e user=wiza
```
