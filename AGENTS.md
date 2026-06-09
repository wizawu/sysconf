# Agent Guidelines

## docker/agent/Dockerfile Update Check Workflow

This Dockerfile installs three external tools. Here is the complete workflow for checking and updating them.

### Tools

- kimi-cli
- pi
- qoder

### Update Logic

1. Read the comment URL above each tool's install command in the Dockerfile
2. Visit the URL to find the latest version — trust the version number on the webpage; if it says a new version exists, the install package is available
3. Update the version number in the Dockerfile install command — do not use wget to verify download URLs, just update the version string directly

### Browser Command with Proxy

Always use the browser skill with SOCKS proxy. See the browser skill's `SKILL.md` for usage.
