---
name: browser
description: >
  Visit a URL or search Bing with Playwright + Chromium, wait for dynamic/SPA
  content to load, then report page title, text length, and HTML/CSS/JS resource
  sizes. Supports SOCKS proxy, configurable timeout, optional browser locale,
  and page content output (plain text or markdown). Use this whenever the user wants to open a URL, read
  an article or docs page, check if a site is accessible, search the web, or
  when curl/requests/wget returned empty content. Not for multi-page crawling,
  form interaction, login, or screenshots.
---

# Browser Skill

Visit a single URL with Playwright + Chromium, wait for dynamic content to
settle, and report structured information about the page.

## Usage

```bash
# Visit a URL
python3 browse.py "https://example.com"

# Search using Bing (auto-detected when input is not a URL)
python3 browse.py "python tutorial"

# With SOCKS proxy
python3 browse.py "https://example.com" --proxy "socks5://127.0.0.1:1081"

# With custom timeout (default 30 s)
python3 browse.py "https://example.com" --timeout 60000

# With optional browser locale
python3 browse.py "https://example.com" --locale en-US
python3 browse.py "https://example.com" --locale zh-CN

# Output page content as plain text or markdown
python3 browse.py "https://example.com" --format txt
python3 browse.py "https://example.com" --format md
```

### CLI Arguments

| Argument     | Default    | Description                                 |
|--------------|------------|---------------------------------------------|
| `url`        | (required) | URL to visit, or search keywords            |
| `--proxy`    | None       | SOCKS proxy, e.g. `socks5://127.0.0.1:1081` |
| `--timeout`  | `30000`    | Page load timeout in milliseconds            |
| `--locale`   | None       | Optional browser locale, e.g. `en-US` or `zh-CN`; if omitted, Playwright default is used |
| `--format`   | `md`       | Output page content: `txt` or `md`          |

The default output format is `md`; use `--format txt` to get plain text instead.

## Output

```
Opening: https://example.com
...
Page Title: Example Domain
InnerText Characters: 1,234

Resource Sizes:
  HTML: 1,234 bytes
  CSS:  5,678 bytes
  JS:   9,012 bytes
  Total (HTML+CSS+JS): 15,924 bytes
```

## Requirements

- Python 3 with `playwright` installed
- Chromium is pre-installed — **do not** run `playwright install chromium`
- For `--format md`: `pip install markdownify`
