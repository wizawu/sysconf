#!/usr/bin/env python3
"""
Browser script using Playwright + Chromium.
- 30 s page-load timeout
- Optional SOCKS proxy
- Waits for domcontentloaded, then polls innerText length every 1 s
- Considers the page loaded when innerText growth < 10 % for 5 consecutive checks
- Prints page title, innerText character count, and total size of HTML+CSS+JS
"""

import argparse
from playwright.sync_api import sync_playwright


def browse(url: str, proxy: str | None = None, timeout: int = 30000, output_format: str | None = None):
    proxy_config = {"server": proxy} if proxy else None
    resource_info = []  # (url, mime_type, size)
    pending_bodies = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, proxy=proxy_config)
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/135.0.0.0 Safari/537.36"
            ),
            locale="zh-CN",
            timezone_id="Asia/Shanghai",
        )
        page = context.new_page()

        # Anti-detection: hide webdriver and fake plugins
        page.add_init_script(
            """
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
            Object.defineProperty(navigator, 'plugins', {
                get: () => [1, 2, 3, 4, 5]
            });
            """
        )

        def on_response(response):
            url = response.url
            mime = response.headers.get("content-type", "")
            cl = response.headers.get("content-length")
            size = 0
            if cl:
                try:
                    size = int(cl)
                except ValueError:
                    size = 0
            if size > 0:
                resource_info.append((url, mime, size))
            else:
                pending_bodies.append(response)

        page.on("response", on_response)

        print(f"Opening: {url}")
        if proxy:
            print(f"Using proxy: {proxy}")

        page.goto(url, wait_until="domcontentloaded", timeout=timeout)

        # Poll innerText length until stable
        prev_length = 0
        stable_count = 0
        check_count = 0
        max_checks = 60  # 60 s safety cap

        while stable_count < 5 and check_count < max_checks:
            page.wait_for_timeout(1000)
            try:
                text = page.evaluate(
                    "() => document.body ? document.body.innerText : ''"
                )
            except Exception:
                text = ""
            curr_length = len(text) if text else 0

            if check_count > 0:
                growth = (
                    0.0
                    if curr_length == 0
                    else (curr_length - prev_length) / curr_length
                )
                if growth < 0.10:
                    stable_count += 1
                else:
                    stable_count = 0
                print(
                    f"  Check {check_count}: innerText={curr_length}, "
                    f"growth={growth:.2%}, stable={stable_count}/5"
                )
            else:
                print(f"  Check {check_count}: innerText={curr_length}")

            prev_length = curr_length
            check_count += 1

        # Fetch bodies for responses without content-length
        print(
            f"\nFetching body sizes for {len(pending_bodies)} "
            f"resources without content-length..."
        )
        for response in pending_bodies:
            url = response.url
            mime = response.headers.get("content-type", "")
            try:
                body = response.body()
                size = len(body)
                if size > 0:
                    resource_info.append((url, mime, size))
            except Exception:
                pass

        # Performance API fallback for anything missed
        try:
            perf_entries = page.evaluate(
                """
                () => performance.getEntriesByType('resource').map(r => ({
                    name: r.name,
                    transferSize: r.transferSize,
                    encodedBodySize: r.encodedBodySize
                }));
                """
            )
            have_urls = {u for u, _, _ in resource_info}
            for entry in perf_entries:
                name = entry.get("name", "")
                if name and name not in have_urls:
                    size = entry.get("transferSize", 0) or entry.get(
                        "encodedBodySize", 0
                    )
                    if size > 0:
                        mime = ""
                        if name.endswith(".css"):
                            mime = "text/css"
                        elif name.endswith(".js"):
                            mime = "application/javascript"
                        elif name.endswith((".html", ".htm")):
                            mime = "text/html"
                        resource_info.append((name, mime, size))
        except Exception:
            pass

        title = page.title()
        final_text = page.evaluate(
            "() => document.body ? document.body.innerText : ''"
        )
        char_count = len(final_text) if final_text else 0
        print(f"\nPage Title: {title}")
        print(f"InnerText Characters: {char_count:,}")

        if output_format == "txt":
            print("\n--- Page Text ---\n")
            print(final_text)
            print("\n--- End Page Text ---")
        elif output_format == "md":
            try:
                import markdownify
            except ImportError as exc:
                raise SystemExit(
                    "The 'markdownify' package is required for --format md. "
                    "Install it with: pip install markdownify"
                ) from exc
            html = page.content()
            md_text = markdownify.markdownify(html, heading_style="ATX")
            print("\n--- Markdown ---\n")
            print(md_text)
            print("\n--- End Markdown ---")

        html_size = css_size = js_size = 0
        for _, mime, size in resource_info:
            m = mime.lower()
            if "text/html" in m:
                html_size += size
            elif "text/css" in m:
                css_size += size
            elif (
                "javascript" in m
                or "application/x-javascript" in m
                or "text/javascript" in m
            ):
                js_size += size

        print("\nResource Sizes:")
        print(f"  HTML: {html_size:,} bytes")
        print(f"  CSS:  {css_size:,} bytes")
        print(f"  JS:   {js_size:,} bytes")
        print(f"  Total (HTML+CSS+JS): {html_size + css_size + js_size:,} bytes")

        browser.close()
        return {
            "title": title,
            "char_count": char_count,
            "html_size": html_size,
            "css_size": css_size,
            "js_size": js_size,
        }


if __name__ == "__main__":
    import urllib.parse

    parser = argparse.ArgumentParser(description="Browse a URL or search with Playwright")
    parser.add_argument("url", help="URL to open or keywords to search")
    parser.add_argument(
        "--proxy",
        default=None,
        help="SOCKS proxy, e.g. socks5://127.0.0.1:1081",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=30000,
        help="Page load timeout in ms (default 30000)",
    )
    parser.add_argument(
        "--format",
        choices=["txt", "md"],
        default=None,
        help="Output page content as plain text (txt) or markdown (md). "
             "Requires 'markdownify' for md.",
    )
    args = parser.parse_args()

    url = args.url.strip()
    if not url.startswith(("http://", "https://")):
        query = urllib.parse.quote(url)
        url = f"https://cn.bing.com/search?q={query}"
        print(f"Search mode: {url}")

    browse(url, proxy=args.proxy, timeout=args.timeout, output_format=args.format)
