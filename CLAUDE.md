# InPursuit Health — Project Rules

## Data Room Documents

Every HTML file added to `data-room/` must include a fixed "Return to Data Room" button before `</body>`. Use this exact snippet:

```html
<div id="ip-return-btn" style="position:fixed;top:16px;left:16px;z-index:9999;"><a href="../investor-portal.html" style="display:inline-flex;align-items:center;gap:8px;background:#0a1628;color:#C5A44E;border:1px solid rgba(197,164,78,.35);border-radius:8px;padding:9px 16px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;letter-spacing:.3px;text-decoration:none;box-shadow:0 4px 16px rgba(0,0,0,.35);transition:background .2s,border-color .2s;" onmouseover="this.style.background='#132040';this.style.borderColor='rgba(197,164,78,.7)'" onmouseout="this.style.background='#0a1628';this.style.borderColor='rgba(197,164,78,.35)'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C5A44E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Return to Data Room</a></div>
```

- The button links to `../investor-portal.html` (one level up from `data-room/`).
- The investor portal uses `localStorage` key `ip_portal_unlocked` to remember authenticated sessions — returning investors skip the gate automatically.
- Never add this button to files outside of `data-room/`.

## Investor Portal Auth

- Auth state is persisted in `localStorage` under `ip_portal_unlocked` (value `'1'`) and `ip_portal_contact` (JSON of `{first, last, email}`).
- Set both keys in `openDataRoom()` on successful login.
- The auto-unlock block at the bottom of the portal script checks these keys on page load and skips the gate if present.
- Do NOT clear these keys on page load — only clear them on explicit logout.

## Stat Cards (for-providers.html)

- All four stat cards in `#gap` are `<a class="stat-card linked">` elements linking to their source.
- Source line styling uses hex values `#9a7a30` (default) and `#C5A44E` (hover), not CSS variables.
