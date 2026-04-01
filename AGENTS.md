# AGENTS.md

## Project Overview

This is a personal system configuration repository (`~/.sysconf`) for managing Ubuntu-based Linux workstations using Ansible. It provides automated system provisioning, dotfiles management, and development environment setup.

The repository is designed to be cloned to `/home/wizawu/.sysconf` and manages:
- System packages and configurations
- User dotfiles (bash, vim, tmux, git, etc.)
- Desktop environment (Awesome WM)
- Docker containers for various services
- Development tools (VSCode, Python, Node.js)

## Technology Stack

- **Configuration Management**: Ansible
- **Target OS**: Ubuntu (Plucky/Noble)
- **Desktop Environment**: Awesome WM with MATE components
- **Shell**: Bash
- **Container Runtime**: Docker
- **Languages**: Python 3, Node.js
- **CI/CD**: GitHub Actions (Docker image builds)

## Project Structure

```
~/.sysconf/
├── ansible.cfg          # Ansible configuration
├── Makefile             # Common tasks and shortcuts
├── install.yml          # Main Ansible playbook for system setup
├── tasks/               # Ansible task files
│   ├── command.yml      # CLI tools installation
│   ├── desktop.yml      # Desktop environment setup
│   ├── vscode.yml       # VSCode installation and extensions
│   ├── pip.yml          # Python packages
│   ├── npm.yml          # Node.js packages
│   └── cleanup.yml      # Service cleanup and package removal
├── dotfiles/            # User configuration files
│   ├── bashrc           # Shell configuration
│   ├── gitconfig        # Git configuration
│   ├── vimrc            # Vim configuration
│   ├── tmux.conf        # Tmux configuration
│   ├── config/          # Application configs (VSCode, etc.)
│   └── ...
├── bin/                 # Custom scripts (added to PATH)
├── etc/                 # System configuration files (symlinked to /etc)
├── docker/              # Docker image definitions
│   ├── agent/           # AI agent container (kimi-cli)
│   └── proxy/           # Proxy tools container
├── roles/               # Ansible roles
│   └── socks/           # SOCKS proxy service
└── .github/             # GitHub Actions workflows
```

## Build and Run Commands

### Initial System Provisioning

```bash
# From a fresh Ubuntu installation
make install
# Or directly:
ansible-playbook -b -e user=wizawu install.yml
```

### Common Makefile Targets

```bash
make install    # Run full system setup
make upgrade    # Upgrade VSCode and Chrome
make cron       # Setup cron jobs
make mysql      # Start MySQL Docker container
make etherpad   # Start Etherpad container
make excalidraw # Start Excalidraw container
make brook      # Start Brook proxy container
make socks      # Start SOCKS proxy container
```

### Docker Agent

The `bin/agent` script runs kimi-cli in a Docker container:

```bash
agent /path/to/workspace [kimi-cli arguments]
```

#### Docker Agent Environment Variables

The agent image includes the following environment variables:
- `PLAYWRIGHT_BROWSERS_PATH=/var/playwright` - Playwright browsers installation directory
- `CHROME_EXECUTABLE_PATH=/var/playwright/chrome` - Stable path to Chromium executable
- `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple` - PyPI mirror for Python packages
- `PIP_BREAK_SYSTEM_PACKAGES=1` - Allow pip to install system packages

## Configuration Files

### System Configurations (symlinked to /etc)

Files in `etc/` are symlinked to system directories during installation:
- `etc/apt/sources.list.d/` - APT repository configurations
- `etc/X11/xorg.conf.d/` - X11 configurations
- `etc/fonts/conf.d/` - Font configurations
- `etc/xdg/awesome/rc.lua` - Awesome WM configuration
- `etc/proxychains1.conf` - ProxyChains config for local SOCKS (1081)
- `etc/proxychains2.conf` - ProxyChains config for VM SOCKS (192.168.56.2:1080)

### User Dotfiles (symlinked to ~/.*)

Files in `dotfiles/` are symlinked to the user's home directory:
- `.bashrc`, `.gitconfig`, `.vimrc`, `.tmux.conf`, `.xinitrc`, etc.
- `.ssh/config`, `.gradle/gradle.properties`, `.sqliterc`

## Code Style Guidelines

### Bash

- Use `#!/bin/bash` shebang
- Use `set -e` for error handling in scripts
- Aliases defined in `.bashrc` for common operations

### Vim

- 4-space indentation
- Auto-trim trailing whitespace on save
- UTF-8 encoding with fallback encodings for Chinese files

### Python

- Line length: 120 characters
- Formatter: Black
- Import sorter: isort
- Use `pyfmt` alias to format: `pyfmt <files>`

### TypeScript/JavaScript

- 2-space indentation
- Formatter: Prettier
- Use `tsfmt` alias for formatting

### Git

- Custom `bin/git` wrapper handles different identities based on directory:
  - `/home/wizawu/repos/*` → work identity
  - `/home/wizawu/github/*` → personal identity (wizawu@gmail.com)
- Pull with rebase enabled by default
- Diff algorithm: histogram

## Testing

No automated tests in this repository. The project is tested manually through:
1. Fresh system installation validation
2. Docker container functionality verification

## Deployment

### Docker Images

Built automatically via GitHub Actions on push to main branch:
- `wizawu/agent:latest` - AI agent image with kimi-cli, Playwright (Chromium), and various Python tools
  - Playwright Chromium installed to `/var/playwright` with stable symlink at `/var/playwright/chrome`

### Manual Deployment

1. Run `make install` for initial setup
2. System configurations are applied via symlinks
3. Docker containers are started individually via Makefile targets

## Development Conventions

### Adding New Packages

- **APT packages**: Add to `tasks/command.yml` or `tasks/desktop.yml`
- **Python packages**: Add to `tasks/pip.yml`
- **Node.js packages**: Add to `tasks/npm.yml`
- **VSCode extensions**: Add to `tasks/vscode.yml`

### Adding New Dotfiles

1. Create file in `dotfiles/`
2. Add symlink task in `install.yml` under "create symbolic link to user config"

### Adding New System Configs

1. Create file in `etc/` with correct path structure
2. Add symlink task in `install.yml` under "create symbolic link to global config"

## Key Environment Variables

Defined in `.bashrc`:
- `EDITOR=vim`
- `JAVA_HOME=/usr/lib/jvm/default-jdk`
- `VCPKG_ROOT=$HOME/local/vcpkg`
- `CMAKE_TOOLCHAIN_FILE=$VCPKG_ROOT/scripts/buildsystems/vcpkg.cmake`
- `PIP_INDEX_URL=https://mirrors.aliyun.com/pypi/simple`
- `PIP_BREAK_SYSTEM_PACKAGES=1`

## Custom Bin Scripts

The `bin/` directory contains custom utility scripts:
- `git` - Git wrapper with directory-based identity
- `agent` - Run kimi-cli in Docker
- `chrome`, `edge` - Browser launchers
- `screenshot` - Screenshot utility
- `brightness`, `touchpad` - Hardware controls
- `compress-pdf` - PDF compression
- See `bin/` directory for more

### Bash Aliases

Key aliases defined in `.bashrc`:
- `pc1`, `pc2` - ProxyChains with different configs (local/VM)
- `pyfmt` - Format Python with isort + black
- `tsfmt` - Format TypeScript with prettier
- `psync` - Rsync with progress
- `myip` - Show public IP address

## Mirror Configuration

The project uses Chinese mirrors for faster downloads:
- APT: mirrors.tencent.com, mirrors.aliyun.com
- PyPI: mirrors.aliyun.com/pypi/simple (was mirrors.tencent.com)
- Node.js: npmmirror.com/mirrors/node

## Notes

- The installation requires root/sudo privileges (via Ansible become)
- User is added to `docker`, `root`, and `video` groups
- Bluetooth is blocked by default via `/etc/rc.local`
- GUI can be disabled for server use (see README.md)