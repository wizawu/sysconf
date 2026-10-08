# Agent Guidelines

## docker/agent/Dockerfile Update Check Workflow

This Dockerfile installs three external tools. Here is the complete workflow for checking and updating them.

### Tools (with version-source URL)

- pi — `https://github.com/earendil-works/pi/releases`
- codex — `https://github.com/openai/codex/releases`
- kimi-cli — `https://github.com/MoonshotAI/kimi-code/releases`

### Update Logic

1. Read the comment URL above each tool's install command in the Dockerfile
2. Find the latest version from that URL — read the latest stable version on the webpage. Trust the number shown; if a new version exists, the package is available
3. Use only stable releases — skip alpha, beta, rc, and other pre-release tags even if they have a higher version number
4. Update the version number in the Dockerfile install command — do not use wget or npm to verify download/install URLs, just update the version string directly

### Browser Command with Proxy

Always use the browser skill with SOCKS proxy `socks5://127.0.0.1:1081` and output the page as markdown (`--format md`). Do not redirect the output to a temp `.md` file — read the version directly from the command's stdout. See the browser skill's `SKILL.md` for full usage.

For URLs ending in `.json`, use `curl` directly instead of the browser skill.
