# UK Small Business Toolkit — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

UK Small Business Toolkit is a free platform of 18 tools for UK limited company directors, sole traders, freelancers, and small business owners. Fourth site in the portfolio, monetised via Google AdSense.

**Tech stack:** Self-contained static HTML files. No framework. Chart.js from jsDelivr on chart pages. Deployed via GitHub -> Cloudflare Pages.

**Repository:** `https://github.com/jwfalc-coder/UK-Small-Business-Toolkit` (private)

**Live URL:** https://smallbusinesstoolkit.uk -- deployed via Cloudflare Pages (April 2026). DNS managed by Cloudflare.

---

## 2. Current Status (as of 18 April 2026)

- All 23 HTML pages live at smallbusinesstoolkit.uk
- Cloudflare Pages auto-deploys on push to main
- Google Analytics 4 (G-MR0P3D6N1W) installed -- gated behind custom cookie consent banner (key: sbt-cookie)
- Custom cookie consent banner active -- Accept/Decline, gates GA
- Formspree contact form live (xwvaovlg)
- Email routing: hello@smallbusinesstoolkit.uk -> personal inbox via Cloudflare
- AdSense: NOT YET APPLIED -- pending ClearCost approval first
- Search Console: submit sitemap https://smallbusinesstoolkit.uk/sitemap.xml once property verified

---

## 3. Design System (Confirmed: Option C -- Modern B2B Product)

Do not change without explicit instruction.

| Token | Value |
|-------|-------|
| Accent | `#d97706` (amber) |
| Page background | `#f0f4f8` (grey-blue) |
| Card background | `#ffffff` |
| Slate (secondary) | `#1e3a5f` |
| Text primary | `#0f172a` |
| Heading font | Outfit |
| Body font | Inter |

**Font loading:** Loaded via non-blocking `media="print"` link tags with preconnect. @import removed from styles.css.

**PROHIBITED:** gradient text, gradient logos, emoji icons, em dashes, lorem ipsum, TODO comments

---

## 4. SEO Status (completed April 2026)

- [x] Canonical tags -- all 23 pages (https://smallbusinesstoolkit.uk/...)
- [x] OG tags -- all pages
- [x] Meta descriptions trimmed
- [x] Em dashes removed
- [x] FAQPage schema -- all 18 tool pages (5 questions each, written from scratch)
- [x] BreadcrumbList schema -- all 18 tool pages
- [x] WebSite/WebPage/WebApplication schema
- [x] FAQ CSS added to styles.css
- [x] sitemap.xml -- lastmod 2026-04-17
- [x] robots.txt -- clean
- [x] llms.txt
- [x] Google Fonts render blocking fixed (media=print swap)

---

## 5. Tool Inventory (18 tools across 5 categories)

### Tax & Compliance
- corporation-tax-calculator.html
- vat-calculator.html
- vat-return-calculator.html
- flat-rate-scheme-calculator.html
- capital-allowances-calculator.html

### Business Structure
- sole-trader-vs-ltd.html
- ltd-company-cost-calculator.html
- business-structure-guide.html

### Finance & Cashflow
- profit-margin-calculator.html
- break-even-calculator.html
- invoice-generator.html
- director-loan-calculator.html

### Payroll & HR
- business-mileage-calculator.html
- statutory-pay-calculator.html
- national-living-wage-checker.html
- mtd-checker.html

### Deadlines & Compliance
- companies-house-deadlines.html
- late-filing-penalty-calculator.html

---

## 6. Tax Year Rates (2026/27 -- updated April 2026)

Key rates in utils.js:
- NLW (21+): £12.71/hour
- NMW 18-20: £10.85/hour
- NMW 16-17 and apprentices: £8.00/hour
- SSP: £123.25/week -- day one entitlement, no waiting days, LEL removed
- SMP/SPP/SAP: £194.32/week
- Dividend tax: 10.75% basic, 35.75% higher, 39.35% additional

---

## 7. What Still Needs Doing

- [ ] AdSense application -- pending ClearCost approval first
- [ ] ads.txt -- add once publisher ID issued
- [ ] Privacy policy update -- update once AdSense approved
- [ ] Replace cookie banner with Google CMP once AdSense approved
- [ ] mtd-checker.html -- verify content is complete and accurate for April 2026 MTD rules

---

## 8. Deployment

```
Edit -> git commit -> git push origin main -> Cloudflare auto-deploys
```

Build command: `exit 0` | Output directory: root `/`

---

## 9. Annual Rate Updates (each April)

Update in utils.js first, then individual pages:
- Corporation tax rates and marginal relief thresholds
- Employer NI rate and secondary threshold
- Employment Allowance
- NLW/NMW rates
- SSP/SMP/SPP rates (check Employment Rights Act changes)
- VAT registration threshold
- Business mileage HMRC rates
- Capital allowances AIA limit
- All year label references

---

## 10. File Writing Conventions

Use Python `open()`/`write()` -- never shell heredocs.
Scan before every push: no em dashes, no lorem ipsum, no TODO, no YOURDOMAIN.

```python
import re
with open('filename.html') as f: src = f.read()
assert '\u2014' not in src, 'Em dash found'
assert 'lorem ipsum' not in src.lower(), 'Lorem ipsum found'
assert 'YOURDOMAIN' not in src, 'Placeholder domain found'
```
