# UK Small Business Toolkit — Claude Code Handover Document

> **For Claude Code sessions:** Read this document fully before touching any file. All conventions, decisions, and pending tasks are documented here. Do not deviate from established patterns without updating this file.

---

## 1. Project Overview

UK Small Business Toolkit is a free multi-page platform of tools for UK limited company directors, sole traders, freelancers, and small business owners. 18 tools across 5 categories, each on its own dedicated HTML page, monetised via Google AdSense.

**Goal:** Generate passive ad revenue as part of the wider passive income system (AdSense revenue -> savings fund -> trading account -> Stocks and Shares ISA -> Ltd company incorporation at ~year 2.5).

**Tech stack:** Self-contained static HTML files. No framework. No build step. Chart.js loaded from jsDelivr CDN on pages that need charts. Pure HTML/CSS/JS. Deployed via GitHub Pages, then Netlify once a domain is acquired.

**Repository:** `https://github.com/jwfalc-coder/UK-Small-Business-Toolkit` (public, required for GitHub Pages free tier)

**Live URL:** `https://jwfalc-coder.github.io/UK-Small-Business-Toolkit/` (GitHub Pages, pending custom domain)

**Git auth for sessions:**
```bash
git clone https://YOUR_PAT@github.com/jwfalc-coder/UK-Small-Business-Toolkit.git
git config user.email "claude@anthropic.com"
git config user.name "Claude"
```

**Portfolio context:** This is Site 4 in Josh's AdSense portfolio.

| Site | Repo | Status |
|------|------|--------|
| ClearCost UK | `jwfalc-coder/clear-cost-uk` | Built, awaiting Netlify deploy |
| Tax Toolkit UK | `jwfalc-coder/tax-toolkit-uk` | Built, awaiting Netlify deploy |
| Pension Planner UK | `jwfalc-coder/Pension-Planner` | Partially built |
| UK Small Business Toolkit | `jwfalc-coder/UK-Small-Business-Toolkit` | Session 1 complete (see below) |

---

## 2. Design System (Confirmed: Option C)

Design was confirmed as **Option C: Modern B2B Product** before build began. Do not change the design without explicit instruction from Josh.

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
- No em dashes in any visible text (use commas or hyphens)
- No lorem ipsum, no placeholder text, no TODO comments in production files

---

## 3. Repository Structure

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
├── _redirects                              # Netlify redirect rules
├── robots.txt
├── sitemap.xml                             # YOURDOMAIN placeholder -- update when domain purchased
├── .nojekyll                               # Required for GitHub Pages
│
├── corporation-tax-calculator.html         # BUILT - Session 1
├── ltd-company-cost-calculator.html        # BUILT - Session 1
├── sole-trader-vs-ltd.html                 # BUILT - Session 1
├── vat-calculator.html                     # BUILT - Session 1
├── invoice-generator.html                  # BUILT - Session 1
├── companies-house-deadlines.html          # BUILT - Session 1
├── mtd-checker.html                        # BUILT - Session 1
├── break-even-calculator.html              # BUILT - Session 1
├── profit-margin-calculator.html           # BUILT - Session 1
│
├── business-mileage-calculator.html        # NOT YET BUILT (Session 2)
├── capital-allowances-calculator.html      # NOT YET BUILT (Session 2)
├── vat-return-calculator.html              # NOT YET BUILT (Session 2)
├── flat-rate-scheme-calculator.html        # NOT YET BUILT (Session 2)
├── late-filing-penalty-calculator.html     # NOT YET BUILT (Session 2)
├── business-structure-guide.html           # NOT YET BUILT (Session 2)
├── statutory-pay-calculator.html           # NOT YET BUILT (Session 2)
├── national-living-wage-checker.html       # NOT YET BUILT (Session 2)
└── director-loan-calculator.html           # NOT YET BUILT (Session 2)
```

**Session 1 total: 9 tool pages + 4 supporting pages + 5 config/asset files = 18 files.**

---

## 4. Tools Status

### Session 1 complete (9 MVP tools)

| # | Tool | File | Status |
|---|------|------|--------|
| 1 | Corporation Tax Calculator | `corporation-tax-calculator.html` | BUILT |
| 2 | Ltd Company Cost Calculator | `ltd-company-cost-calculator.html` | BUILT |
| 3 | Sole Trader vs Ltd Company | `sole-trader-vs-ltd.html` | BUILT |
| 4 | VAT Calculator | `vat-calculator.html` | BUILT |
| 5 | Invoice Generator | `invoice-generator.html` | BUILT |
| 6 | Companies House Deadline Tracker | `companies-house-deadlines.html` | BUILT |
| 7 | Making Tax Digital Checker | `mtd-checker.html` | BUILT |
| 8 | Break-Even Calculator | `break-even-calculator.html` | BUILT |
| 9 | Profit Margin Calculator | `profit-margin-calculator.html` | BUILT |

### Session 2 to build (9 remaining tools)

| # | Tool | File | Group |
|---|------|------|-------|
| 10 | Business Mileage Calculator | `business-mileage-calculator.html` | 10 |
| 11 | Capital Allowances Calculator | `capital-allowances-calculator.html` | 10 |
| 12 | VAT Return Calculator | `vat-return-calculator.html` | 11 |
| 13 | Flat Rate Scheme Calculator | `flat-rate-scheme-calculator.html` | 11 |
| 14 | Late Filing Penalty Calculator | `late-filing-penalty-calculator.html` | 12 |
| 15 | Business Structure Guide | `business-structure-guide.html` | 12 |
| 16 | Statutory Pay Calculator | `statutory-pay-calculator.html` | 13 |
| 17 | National Living Wage Checker | `national-living-wage-checker.html` | 13 |
| 18 | Director Loan Account Calculator | `director-loan-calculator.html` | 13 |

---

## 5. Key Technical Patterns

**Writing files:** Always use Python `open()`/`write()` rather than shell heredocs. Heredocs are unreliable for HTML/CSS containing single quotes and special characters.

```python
with open('filename.html', 'r') as f: src = f.read()
new_src = src.replace('old_string', 'new_string')
with open('filename.html', 'w') as f: f.write(new_src)
```

**Em dash check before every push:**
```python
import re
src = open('file.html').read()
print(len(re.findall(r' \u2014 ', src)))  # Must be 0
```

**Git push pattern:**
```bash
git config user.email "claude@anthropic.com"
git config user.name "Claude"
git add <files>
git commit -m "message"
git pull --rebase origin main  # if remote may have diverged
git push origin main
```

**api.github.com is blocked** in Claude Code sessions. Use git clone/push with PAT embedded in remote URL only.

**Chart.js CDN:** `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`

**.nojekyll is mandatory** in the repo root for GitHub Pages to serve static HTML without Jekyll processing.

---

## 6. utils.js — What Is Available

All helpers are available globally on every tool page via `<script src="utils.js"></script>`.

| Object | Key methods / properties |
|--------|--------------------------|
| `fmt` | `currency(n)`, `pct(n)`, `number(n)`, `round2(n)` |
| `CT` | `calculate(profit, associatedCompanies)`, `chartData(maxProfit, steps)` |
| `IT` | `calculateIT(income)`, `calculateNI4(profit)`, `employerNI(salary)` |
| `StructureCalc` | `soleTrader(profit)`, `limitedCompany(profit, salary)`, `breakeven()` |
| `Mileage` | `calculate(miles, vehicle)`, `taxRelief(amount, marginalRate)` |
| `VAT` | `addVAT(net, rate)`, `removeVAT(gross, rate)`, `FRS_RATES{}`, `compareFRS(...)` |
| `StatutoryPay` | `calculateSSP(daysOff, daysPerWeek)`, `calculateSMP(weeklyAWE)` |
| `NMW` | `getRate(age, isApprentice)`, `check(hourlyRate, age, isApprentice)` |
| `CHDeadlines` | `calculate(incorporationDate, yearEndDate)` |
| `LFP` | `calculate(daysLate, consecutiveLate)` |
| `CapAllowances` | `calculate(cost, assetType)`, `ASSET_TYPES{}`, `AIA_LIMIT` |
| `BreakEven` | `calculate(fixed, variable, price)`, `chartData(...)` |
| `Margin` | `calculate(revenue, cogs, opex)`, `INDUSTRY_BENCHMARKS{}` |
| `MTD` | `checkITSA(totalIncome)`, `ITSA_THRESHOLDS[]` |
| `LatePayment` | `calculate(amount, daysLate)`, `BOE_BASE_RATE` |
| `UI` | `setText(id, val)`, `setHTML(id, html)`, `show(id)`, `hide(id)`, `numVal(id)`, `strVal(id)`, `initTabs()`, `deadlineBadge(days)` |

---

## 7. Pending Tasks (Pre Go-Live)

| Item | Status |
|------|--------|
| Session 2 tools (9 remaining) | Not yet built |
| Custom domain | Pending purchase |
| Canonical tags | Commented out on all pages -- update once domain confirmed |
| Formspree endpoint | Replace YOUR_FORM_ID in contact.html |
| Cookie consent banner | Build once AdSense publisher ID confirmed |
| ads.txt | Add once publisher ID issued |
| Favicon | Not yet created |
| FAQPage schema on all tool pages | Session 3 |
| BreadcrumbList schema on all tool pages | Session 3 |
| GA4 tracking script | Add once cookie consent built |
| llms.txt | Add in Session 3 |
| WebSite schema on index.html | Session 3 |
| Sitemap YOURDOMAIN replaced | Update when domain purchased |
| Make repo public | Required for GitHub Pages (check: Settings, Danger Zone) |
| Enable GitHub Pages | Settings, Pages, main, root, Save |

---

## 8. Rate Sources and Annual Maintenance

Update each April when new rates are announced:

| File | What to check |
|------|---------------|
| `utils.js` | All rate constants at top of each section |
| `corporation-tax-calculator.html` | CT rates and thresholds (stable until further notice) |
| `business-mileage-calculator.html` | HMRC approved mileage rates |
| `vat-calculator.html` | VAT registration threshold (currently 90,000) |
| `flat-rate-scheme-calculator.html` | FRS percentages by sector |
| `statutory-pay-calculator.html` | SSP, SMP, SPP weekly rates |
| `national-living-wage-checker.html` | NLW/NMW rates (April each year) |
| `director-loan-calculator.html` | HMRC official interest rate (check quarterly) |
| `mtd-checker.html` | MTD income thresholds (expanding 2026, 2027, 2028) |
| `companies-house-deadlines.html` | Companies House filing fees |
| `utils.js: LatePayment.BOE_BASE_RATE` | Bank of England base rate (check quarterly) |

---

## 9. Calculation Verification

Run these checks to confirm accuracy before any deployment:

**Corporation tax**
- Profit 40,000 -> CT = 7,600 (19%)
- Profit 100,000 -> CT = approx 22,750 (marginal relief)
- Profit 300,000 -> CT = 75,000 (25%)

**Mileage**
- 12,000 miles car -> (10,000 x 0.45) + (2,000 x 0.25) = 5,000

**VAT**
- 1,200 inc VAT at 20% -> net 1,000, VAT 200
- 1,000 exc VAT at 20% -> gross 1,200, VAT 200

**Companies House deadlines**
- Incorporated 1 Jan 2024, year-end 31 Jan 2025 -> first accounts due 1 Oct 2025

**Break-even**
- Fixed costs 10,000, variable cost 15, selling price 40 -> contribution 25, break-even 400 units, revenue 16,000

---

## 10. AdSense Notes

- B2B/SME advertisers are the highest RPM bracket in UK digital advertising
- Target RPM: 15 to 40 GBP per thousand impressions
- Invoice generator and Companies House tools especially attractive to business banking and accountancy software advertisers
- Apply for AdSense immediately after MVP is live and indexed
- Never click your own ads. A ban is permanent.
- Note: Publishers are reporting RPM pressure in early 2026 from Google AI Overviews. Monitor but proceed.

---

## 11. Session History

| Session | Date | What was done |
|---------|------|---------------|
| Session 1 (laptop) | April 2025 | Design confirmed (Option C), global files, homepage, Groups 3 and 4 (CT, Ltd costs, sole trader vs Ltd, VAT calculator, invoice generator) |
| Session 1 (continued, phone) | April 2025 | Groups 5 and 6 (CH deadlines, MTD checker, break-even, profit margin), supporting pages, config files, README |
