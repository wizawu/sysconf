# Agent Guidelines

## docker/agent/Dockerfile Update Check Workflow

This Dockerfile installs three external tools. Here is the complete workflow for checking and updating them.

### Tools

- kimi-cli
- pi
- qoder
- codex

### Update Logic

1. Read the comment URL above each tool's install command in the Dockerfile
2. Visit the URL to find the latest version — trust the version number on the webpage; if it says a new version exists, the install package is available
3. Use only stable releases — skip alpha, beta, rc, and other pre-release tags even if they have a higher version number
4. Update the version number in the Dockerfile install command — do not use wget to verify download URLs, just update the version string directly

### Browser Command with Proxy

Always use the browser skill with SOCKS proxy `socks5://127.0.0.1:1081` and output the page as markdown (`--format md`). Do not redirect the output to a temp `.md` file — read the version directly from the command's stdout. See the browser skill's `SKILL.md` for full usage.
