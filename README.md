# UK Small Business Toolkit — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions, and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

UK Small Business Toolkit is a free multi-page platform of tools for UK limited company directors, sole traders, freelancers, and small business owners. 18 tools across 5 categories, monetised via Google AdSense. It is the fourth site in a portfolio of AdSense-monetised UK tool sites.

**Goal:** Generate passive ad revenue as part of the wider passive income system (AdSense revenue -> trading account -> Stocks and Shares ISA -> Ltd company incorporation at ~year 2.5).

**Tech stack:** Self-contained static HTML files. No framework. No build step. Chart.js loaded from jsDelivr CDN on pages that need charts. Deployed via GitHub -> Cloudflare Pages.

**Repository:** `https://github.com/jwfalc-coder/UK-Small-Business-Toolkit` (private)

**Live URL:** https://smallbusinesstoolkit.uk — deployed via Cloudflare Pages (April 2026). DNS managed by Cloudflare.

---

## 2. Portfolio Context

| Site | Domain | Repo | Status |
|------|--------|------|--------|
| ClearCost UK | clearcost.uk | `jwfalc-coder/clear-cost-uk` | Live (Cloudflare Pages) |
| Tax Toolkit UK | taxtoolkit.uk | `jwfalc-coder/tax-toolkit-uk` | Live (Cloudflare Pages) |
| Pension Planner UK | pension-planner.co.uk | `jwfalc-coder/Pension-Planner` | Live (Cloudflare Pages) |
| UK Small Business Toolkit | smallbusinesstoolkit.uk | `jwfalc-coder/UK-Small-Business-Toolkit` | Live (Cloudflare Pages) |

---

## 3. Design System (Confirmed: Option C - Modern B2B Product)

Do not change the design without explicit instruction from the site owner.

| Token | Value |
|-------|-------|
| Accent | `#d97706` (amber) |
| Accent hover | `#b45309` |
| Accent light | `#fffbeb` |
| Page background | `#f0f4f8` (grey-blue) |
| Card background | `#ffffff` |
| Slate (secondary) | `#1e3a5f` |
| Text primary | `#0f172a` |
| Text secondary | `#334155` |
| Text muted | `#64748b` |
| Heading font | Outfit (Google Fonts) |
| Body font | Inter (Google Fonts) |
| Success | `#15803d` on `#f0fdf4` |
| Warning | `#d97706` on `#fffbeb` |
| Error | `#dc2626` on `#fef2f2` |

**Prohibited patterns (apply to all sites in the portfolio):**
- No gradient text or gradient logo marks
- No card or panel gradient overlays
- No emoji used as icons (SVG inline only)
- No em dashes in any visible text (commas or hyphens)
- No lorem ipsum, no placeholder text, no TODO comments in production files

---

## 4. Repository Structure

```
UK-Small-Business-Toolkit/
├── index.html                              # Homepage, 18 tool cards across 5 categories
├── about.html
├── privacy.html
├── contact.html                            # Formspree endpoint: replace YOUR_FORM_ID
├── 404.html
├── styles.css                              # Full design system (Option C)
├── utils.js                                # Shared JS: CT, IT, VAT, Mileage, Statutory Pay, NMW, CHDeadlines, LFP, CapAllowances, BreakEven, Margin, MTD, LatePayment
├── _template.html                          # Blank tool page scaffold
├── _redirects
├── robots.txt
├── sitemap.xml
├── .nojekyll
│
├── corporation-tax-calculator.html         # Tax & Compliance (5 tools)
├── vat-calculator.html
├── vat-return-calculator.html
├── flat-rate-scheme-calculator.html
├── capital-allowances-calculator.html
│
├── sole-trader-vs-ltd.html                 # Business Structure (3 tools)
├── ltd-company-cost-calculator.html
├── business-structure-guide.html
│
├── profit-margin-calculator.html           # Finance & Cashflow (4 tools)
├── break-even-calculator.html
├── invoice-generator.html
├── director-loan-calculator.html
│
├── business-mileage-calculator.html        # Payroll & HR (4 tools)
├── statutory-pay-calculator.html
├── national-living-wage-checker.html
├── employer-cost-calculator.html (if present)
│
├── companies-house-deadlines.html          # Deadlines & Compliance (2 tools)
└── late-filing-penalty-calculator.html
```

---

## 5. SEO Status (April 2026)

- [x] Canonical tags on all pages (https://smallbusinesstoolkit.uk/...)
- [x] OG tags on all pages
- [x] Meta descriptions trimmed to under 160 chars
- [x] Em dashes removed from all pages
- [x] WebSite schema on index.html
- [x] WebPage schema on supporting pages
- [x] WebApplication schema on all tool pages (applicationCategory: BusinessApplication)
- [x] Domain set to smallbusinesstoolkit.uk throughout
- [x] FAQPage schema -- all 18 tool pages (5 questions each)
- [x] BreadcrumbList schema -- all 18 tool pages
- [x] `llms.txt` file in root
- [x] FAQ CSS added to `styles.css`

---

## 6. What Still Needs Doing

### Before AdSense application
- [ ] Cookie consent banner (needs GA4 measurement ID + AdSense publisher ID)
- [ ] GA4 tracking script on all pages (gated behind consent)
- [ ] `ads.txt` in root (needs AdSense publisher ID)
- [ ] Formspree endpoint in contact.html (replace YOUR_FORM_ID)
- [ ] Privacy policy update once AdSense publisher ID confirmed

### Content
- [x] FAQPage schema -- all 18 tool pages (5 questions each)
- [x] BreadcrumbList schema -- all 18 tool pages
- [x] `llms.txt` file in root
- [ ] `mtd-checker.html` — verify content is complete

---

## 7. Deployment

### Cloudflare Pages (live April 2026)
- Repo: `jwfalc-coder/UK-Small-Business-Toolkit` connected to Cloudflare Pages
- Build command: `exit 0`
- Build output directory: root `/`
- Custom domain: `smallbusinesstoolkit.uk` - DNS managed by Cloudflare
- Auto-deploys on every push to `main`

```
Edit -> git commit -> git push origin main -> Cloudflare auto-deploys
```

---

## 8. File Naming Conventions

- Tool pages: `[descriptor]-calculator.html`, `[descriptor]-checker.html`, `[descriptor]-guide.html` (kebab-case)
- Supporting pages: `about.html`, `privacy.html`, `contact.html`, `404.html`
- No spaces. No uppercase. No underscores.

---

## 9. Modifying Existing Pages

Use Python `open()`/`write()` for all HTML edits. Never shell heredocs.

```python
with open('filename.html', 'r') as f: src = f.read()
new_src = src.replace('unique_string_to_find', 'replacement_string')
with open('filename.html', 'w') as f: f.write(new_src)
```

Sanity checks before every push:
```python
import re
with open('filename.html') as f: src = f.read()
assert '\u2014' not in src, 'Em dash found'
assert 'lorem ipsum' not in src.lower(), 'Lorem ipsum found'
assert 'TODO' not in src, 'TODO found'
assert 'YOURDOMAIN' not in src, 'Placeholder domain found'
```

---

## 10. Known Issues & Placeholders

| Item | Status |
|------|--------|
| contact.html Formspree endpoint | Replace YOUR_FORM_ID before go-live |
| Cookie consent banner | Pending - needs GA + AdSense IDs |
| GA4 tracking script | Pending - needs measurement ID |
| `ads.txt` | Pending - needs AdSense publisher ID |
| Privacy policy | Update once AdSense publisher ID confirmed |
| FAQPage schema | Not yet added - high SEO priority |
| BreadcrumbList schema | Not yet added |
| `llms.txt` | Not yet created |

---

## 11. Annual Rate Updates (each April)

Update in `utils.js` first, then individual pages:
- Corporation tax rates and marginal relief thresholds
- Employer NI rate and secondary threshold
- Employment Allowance
- Auto-enrolment qualifying earnings band
- National Living Wage / National Minimum Wage rates
- Statutory pay rates (SMP, SSP, SPP)
- VAT registration and deregistration thresholds
- Business mileage HMRC rates (45p/25p/24p)
- Capital allowances AIA limit

**Sources:** gov.uk, hmrc.gov.uk, thepensionsregulator.gov.uk

---

## 12. Rate Sources

| Data type | Source |
|-----------|--------|
| Corporation tax | https://www.gov.uk/corporation-tax-rates |
| Employer NI | https://www.gov.uk/employers-national-insurance |
| Employment Allowance | https://www.gov.uk/claim-employment-allowance |
| VAT threshold | https://www.gov.uk/vat-registration/when-to-register |
| National Living Wage | https://www.gov.uk/national-minimum-wage-rates |
| Mileage rates | https://www.gov.uk/expenses-and-benefits-business-travel-mileage |
| Statutory pay | https://www.gov.uk/maternity-pay-leave/pay |
| Capital allowances | https://www.gov.uk/capital-allowances |
| Companies House deadlines | https://www.gov.uk/file-your-company-annual-accounts |
| Late filing penalties | https://www.gov.uk/annual-accounts/penalties |
