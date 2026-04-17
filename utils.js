/* UK Small Business Toolkit — Shared Utilities
   UK business tax helpers: corporation tax, mileage, statutory pay, NLW, VAT
*/

/* ============================================================
   NUMBER FORMATTING
   ============================================================ */
const fmt = {
  currency: (n, dp = 2) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return '£' + Math.abs(n).toLocaleString('en-GB', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp
    });
  },
  currencySign: (n, dp = 2) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const sign = n < 0 ? '-' : '';
    return sign + '£' + Math.abs(n).toLocaleString('en-GB', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp
    });
  },
  pct: (n, dp = 1) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return n.toFixed(dp) + '%';
  },
  number: (n, dp = 0) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    return n.toLocaleString('en-GB', {
      minimumFractionDigits: dp,
      maximumFractionDigits: dp
    });
  },
  round2: n => Math.round(n * 100) / 100,
};

/* ============================================================
   CORPORATION TAX (2023/24 onwards)
   Small profits rate: 19% on profits <= £50,000
   Main rate: 25% on profits >= £250,000
   Marginal relief: £50,001 - £249,999
   ============================================================ */
const CT = {
  SMALL_RATE: 0.19,
  MAIN_RATE: 0.25,
  SMALL_THRESHOLD: 50000,
  UPPER_THRESHOLD: 250000,
  MARGINAL_RELIEF_FRACTION: 3 / 200,  // standard fraction

  /**
   * Calculate corporation tax for a given profit.
   * Returns { tax, effectiveRate, method, marginalRelief }
   */
  calculate(profit, associatedCompanies = 0) {
    if (profit <= 0) return { tax: 0, effectiveRate: 0, method: 'none', marginalRelief: 0 };

    // Adjust thresholds for associated companies
    const divisor = associatedCompanies + 1;
    const smallThreshold = CT.SMALL_THRESHOLD / divisor;
    const upperThreshold = CT.UPPER_THRESHOLD / divisor;

    if (profit <= smallThreshold) {
      return {
        tax: fmt.round2(profit * CT.SMALL_RATE),
        effectiveRate: CT.SMALL_RATE * 100,
        method: 'small_profits',
        marginalRelief: 0
      };
    }

    if (profit >= upperThreshold) {
      return {
        tax: fmt.round2(profit * CT.MAIN_RATE),
        effectiveRate: CT.MAIN_RATE * 100,
        method: 'main_rate',
        marginalRelief: 0
      };
    }

    // Marginal relief
    const grossTax = profit * CT.MAIN_RATE;
    const marginalRelief = CT.MARGINAL_RELIEF_FRACTION * (upperThreshold - profit);
    const tax = fmt.round2(grossTax - marginalRelief);
    const effectiveRate = (tax / profit) * 100;

    return { tax, effectiveRate, method: 'marginal_relief', marginalRelief: fmt.round2(marginalRelief) };
  },

  /**
   * Generate a range of CT bills for charting.
   * Returns array of { profit, tax, effectiveRate }
   */
  chartData(maxProfit = 400000, steps = 40) {
    const data = [];
    for (let i = 0; i <= steps; i++) {
      const profit = (maxProfit / steps) * i;
      const result = CT.calculate(profit);
      data.push({ profit: Math.round(profit), tax: result.tax, effectiveRate: fmt.round2(result.effectiveRate) });
    }
    return data;
  }
};

/* ============================================================
   INCOME TAX + NATIONAL INSURANCE (2024/25)
   ============================================================ */
const IT = {
  PERSONAL_ALLOWANCE: 20000,  // Note: tapers above £100k
  BASIC_RATE_BAND: 37700,     // £12,571 - £50,270
  HIGHER_RATE_BAND: 87440,    // £50,271 - £125,140
  BASIC_RATE: 0.20,
  HIGHER_RATE: 0.40,
  ADDITIONAL_RATE: 0.45,

  // Class 4 NI (self-employed)
  NI4_LOWER: 12570,
  NI4_UPPER: 50270,
  NI4_LOWER_RATE: 0.09,
  NI4_UPPER_RATE: 0.02,

  // Class 2 NI (self-employed) - abolished April 2024
  // Class 1 Employee NI
  NI1_LOWER: 12570,
  NI1_UPPER: 50270,
  NI1_LOWER_RATE: 0.08,    // 8% from Jan 2024
  NI1_UPPER_RATE: 0.02,

  // Employer NI (from April 2025)
  EMPLOYER_NI_THRESHOLD: 5000,   // reduced from £9,100
  EMPLOYER_NI_RATE: 0.15,        // increased from 13.8%

  /**
   * Calculate income tax for a given income (individual).
   */
  calculateIT(income) {
    if (income <= 0) return { tax: 0, effectiveRate: 0 };

    const pa = income > 125140 ? 0 :
               income > 100000 ? 20000 - Math.floor((income - 100000) / 2) :
               20000;

    const taxable = Math.max(0, income - pa);
    let tax = 0;

    if (taxable > 0) {
      const basicBand = 37700;
      const higherBand = 87440;
      if (taxable <= basicBand) {
        tax = taxable * IT.BASIC_RATE;
      } else if (taxable <= basicBand + higherBand) {
        tax = basicBand * IT.BASIC_RATE + (taxable - basicBand) * IT.HIGHER_RATE;
      } else {
        tax = basicBand * IT.BASIC_RATE + higherBand * IT.HIGHER_RATE + (taxable - basicBand - higherBand) * IT.ADDITIONAL_RATE;
      }
    }

    return { tax: fmt.round2(tax), effectiveRate: income > 0 ? fmt.round2((tax / income) * 100) : 0 };
  },

  /**
   * Calculate Class 4 NI for sole trader.
   */
  calculateNI4(profit) {
    if (profit <= IT.NI4_LOWER) return 0;
    const lower = Math.min(profit, IT.NI4_UPPER) - IT.NI4_LOWER;
    const upper = Math.max(0, profit - IT.NI4_UPPER);
    return fmt.round2(lower * IT.NI4_LOWER_RATE + upper * IT.NI4_UPPER_RATE);
  },

  /**
   * Employer NI cost on a salary (April 2025 rates).
   */
  employerNI(salary) {
    if (salary <= IT.EMPLOYER_NI_THRESHOLD) return 0;
    return fmt.round2((salary - IT.EMPLOYER_NI_THRESHOLD) * IT.EMPLOYER_NI_RATE);
  }
};

/* ============================================================
   SOLE TRADER VS LIMITED COMPANY COMPARISON
   ============================================================ */
const StructureCalc = {
  /**
   * Net take-home for sole trader at given profit.
   */
  soleTrader(profit) {
    const itResult = IT.calculateIT(profit);
    const ni4 = IT.calculateNI4(profit);
    const totalTax = itResult.tax + ni4;
    return {
      grossProfit: profit,
      incomeTax: itResult.tax,
      ni: ni4,
      totalTax,
      netTakeHome: fmt.round2(profit - totalTax),
      effectiveRate: fmt.round2((totalTax / profit) * 100)
    };
  },

  /**
   * Net take-home for ltd company director (optimal salary + dividends strategy).
   * Assumes director takes £12,570 salary (PT threshold, no employer NI) + remainder as dividends.
   */
  limitedCompany(profit, salary = 12570) {
    // Employer NI on salary above £5k (April 2025)
    const empNI = IT.employerNI(salary);
    const profitAfterSalary = profit - salary - empNI;

    // Corporation tax on remaining profit
    const ctResult = CT.calculate(Math.max(0, profitAfterSalary));
    const profitAfterCT = profitAfterSalary - ctResult.tax;

    // Dividend tax (2024/25: £500 allowance, then 10.75%/35.75%/39.35%)
    const divAllowance = 500;
    const dividends = profitAfterCT;
    const itOnSalary = IT.calculateIT(salary).tax;

    // Combined income for div tax banding
    const totalIncome = salary + dividends;
    const pa = 20000;
    const taxableDiv = Math.max(0, dividends - divAllowance);
    // Basic rate band remaining after salary
    const basicRemaining = Math.max(0, pa + 37700 - salary);
    let divTax = 0;
    if (taxableDiv > 0) {
      const basicDiv = Math.min(taxableDiv, basicRemaining);
      const higherDiv = Math.max(0, taxableDiv - basicRemaining);
      divTax = basicDiv * 0.0875 + higherDiv * 0.3375;
    }

    const totalTax = ctResult.tax + empNI + itOnSalary + fmt.round2(divTax);
    const netTakeHome = fmt.round2(profit - totalTax);

    return {
      grossProfit: profit,
      salary,
      employerNI: empNI,
      corporationTax: ctResult.tax,
      incomeTaxOnSalary: fmt.round2(itOnSalary),
      dividendTax: fmt.round2(divTax),
      dividends: fmt.round2(dividends),
      totalTax: fmt.round2(totalTax),
      netTakeHome,
      effectiveRate: fmt.round2((totalTax / profit) * 100)
    };
  },

  /**
   * Find breakeven profit where ltd becomes more tax-efficient.
   * Returns approximate profit level or null.
   */
  breakeven() {
    for (let p = 20000; p <= 300000; p += 500) {
      const st = StructureCalc.soleTrader(p);
      const ltd = StructureCalc.limitedCompany(p);
      if (ltd.netTakeHome >= st.netTakeHome) return p;
    }
    return null;
  }
};

/* ============================================================
   MILEAGE (HMRC approved rates 2024/25)
   ============================================================ */
const Mileage = {
  RATES: {
    car:        { first: 0.45, additional: 0.25, threshold: 10000 },
    van:        { first: 0.45, additional: 0.25, threshold: 10000 },
    motorcycle: { first: 0.24, additional: 0.24, threshold: Infinity },
    bicycle:    { first: 0.20, additional: 0.20, threshold: Infinity },
  },

  /**
   * Calculate total claimable mileage allowance.
   */
  calculate(miles, vehicle = 'car') {
    const rate = Mileage.RATES[vehicle];
    if (!rate) return { total: 0, firstBand: 0, secondBand: 0 };
    const first = Math.min(miles, rate.threshold);
    const additional = Math.max(0, miles - rate.threshold);
    const firstAmount = first * rate.first;
    const additionalAmount = additional * rate.additional;
    const total = fmt.round2(firstAmount + additionalAmount);
    return {
      total,
      firstBand: fmt.round2(firstAmount),
      secondBand: fmt.round2(additionalAmount),
      firstMiles: first,
      additionalMiles: additional
    };
  },

  /**
   * Tax relief on mileage allowance at marginal rate.
   */
  taxRelief(amount, marginalRate = 0.20) {
    return fmt.round2(amount * marginalRate);
  }
};

/* ============================================================
   VAT
   ============================================================ */
const VAT = {
  RATES: { standard: 0.20, reduced: 0.05, zero: 0 },
  THRESHOLD: 90000,
  REGISTRATION_THRESHOLD: 90000,

  addVAT(net, rate = 0.20) {
    const vat = fmt.round2(net * rate);
    return { net: fmt.round2(net), vat, gross: fmt.round2(net + vat) };
  },

  removeVAT(gross, rate = 0.20) {
    const net = fmt.round2(gross / (1 + rate));
    const vat = fmt.round2(gross - net);
    return { gross: fmt.round2(gross), vat, net };
  },

  /**
   * Flat Rate Scheme percentages by sector.
   * Source: HMRC. Updated for 2024/25.
   */
  FRS_RATES: {
    'Accountancy or book-keeping': 14.5,
    'Advertising': 11,
    'Agricultural services': 11,
    'Any other activity not listed elsewhere': 12,
    'Architect, civil and structural engineer or surveyor': 14.5,
    'Boarding or care of animals': 12,
    'Business services not listed elsewhere': 12,
    'Catering services including restaurants and takeaways': 12.5,
    'Cleaning or maintenance services': 10,
    'Computer and IT consultancy or data processing': 14.5,
    'Computer repair services': 10.5,
    'Entertainment or journalism': 12.5,
    'Estate agency or property management services': 12,
    'Farming or agriculture not listed elsewhere': 6.5,
    'Film, radio, television or video production': 13,
    'Financial services': 13.5,
    'Forestry or fishing': 10.5,
    'General building or construction services (where materials < 10% of turnover)': 14.5,
    'General building or construction services (where materials >= 10% of turnover)': 9.5,
    'Hairdressing or other beauty treatment services': 13,
    'Hiring or leasing goods': 9.5,
    'Hotel or accommodation': 10.5,
    'Investigation or security': 12,
    'Labour-only building or construction services': 14.5,
    'Laundry or dry-cleaning services': 12,
    'Lawyer or legal services': 14.5,
    'Library, archive, museum or other cultural activity': 9.5,
    'Management consultancy': 14,
    'Manufacturing fabricated metal products (not machinery/equipment)': 10.5,
    'Manufacturing food': 9,
    'Manufacturing not listed elsewhere': 9.5,
    'Manufacturing yarn, textiles or clothing': 9,
    'Membership organisation': 8,
    'Mining or quarrying': 10,
    'Packaging': 9,
    'Photography': 11,
    'Post offices': 5,
    'Printing': 8.5,
    'Publishing': 11,
    'Pubs': 6.5,
    'Real estate activity not listed elsewhere': 14,
    'Repairing personal or household goods': 10,
    'Repairing vehicles': 8.5,
    'Retailing food, confectionery, tobacco, newspapers or children's clothing': 4,
    'Retailing pharmaceuticals, medical goods, cosmetics or toiletries': 8,
    'Retailing not listed elsewhere': 7.5,
    'Retailing vehicles or fuel': 6.5,
    'Secretarial services': 13,
    'Social work': 11,
    'Sport or recreation': 8.5,
    'Transport or storage (including couriers, freight, removals, taxis)': 10,
    'Travel agency': 10.5,
    'Veterinary medicine': 11,
    'Wholesaling agricultural products': 8,
    'Wholesaling food': 7.5,
    'Wholesaling not listed elsewhere': 8.5,
  },

  /**
   * Compare FRS vs standard VAT.
   * Returns { frs, standard, saving, useFRS }
   */
  compareFRS(vatIncTurnover, sectorRate, inputVAT) {
    const frsVAT = fmt.round2(vatIncTurnover * (sectorRate / 100));
    const outputVAT = fmt.round2(vatIncTurnover * (20 / 120));
    const standardVAT = fmt.round2(outputVAT - inputVAT);
    const saving = fmt.round2(standardVAT - frsVAT);
    return {
      frs: frsVAT,
      standard: standardVAT,
      saving,
      useFRS: frsVAT < standardVAT,
      isLimitedCostTrader: (inputVAT / vatIncTurnover) < 0.02 || inputVAT < 1000
    };
  }
};

/* ============================================================
   STATUTORY PAY RATES (2024/25)
   ============================================================ */
const StatutoryPay = {
  SSP_RATE: 123.25,          // per week (from 6 April 2026)
  SSP_WAITING_DAYS: 3,
  SSP_QUALIFYING_DAYS: 7,    // minimum average working week qualifier
  SSP_MAX_WEEKS: 28,
  SSP_MIN_EARNINGS: 123,     // Lower earnings limit per week

  SMP_RATE_HIGHER: 0.90,     // first 6 weeks: 90% of AWE
  SMP_RATE_LOWER: 184.03,    // remaining 33 weeks: statutory rate or 90% AWE (whichever lower)
  SMP_DURATION_HIGH: 6,
  SMP_DURATION_TOTAL: 39,

  SPP_RATE: 184.03,          // per week (or 90% AWE if lower)
  SPP_DURATION: 2,

  /**
   * Calculate SSP.
   * qualifyingDays = days off minus waiting days (3).
   */
  calculateSSP(totalDaysOff, daysPerWeek = 5) {
    const waitingDays = StatutoryPay.SSP_WAITING_DAYS;
    const qualifyingDays = Math.max(0, totalDaysOff - waitingDays);
    const sspPerDay = StatutoryPay.SSP_RATE / daysPerWeek;
    return {
      qualifyingDays,
      sspPerDay: fmt.round2(sspPerDay),
      totalSSP: fmt.round2(qualifyingDays * sspPerDay),
      note: qualifyingDays <= 0 ? 'No SSP payable (within waiting period)' : null
    };
  },

  /**
   * Calculate SMP (statutory maternity pay).
   */
  calculateSMP(weeklyAWE) {
    const higher = Math.min(weeklyAWE * StatutoryPay.SMP_RATE_HIGHER, weeklyAWE * 0.9) * StatutoryPay.SMP_DURATION_HIGH;
    const lowerWeekly = Math.min(weeklyAWE * 0.9, StatutoryPay.SMP_RATE_LOWER);
    const lower = lowerWeekly * (StatutoryPay.SMP_DURATION_TOTAL - StatutoryPay.SMP_DURATION_HIGH);
    const total = fmt.round2(higher + lower);
    return {
      higherPeriodWeekly: fmt.round2(weeklyAWE * StatutoryPay.SMP_RATE_HIGHER),
      higherPeriodTotal: fmt.round2(higher),
      lowerPeriodWeekly: fmt.round2(lowerWeekly),
      lowerPeriodTotal: fmt.round2(lower),
      total,
      employerReclaim: fmt.round2(total * 1.03) // 103% for small employers
    };
  }
};

/* ============================================================
   NATIONAL LIVING / MINIMUM WAGE (April 2025)
   ============================================================ */
const NMW = {
  RATES: [
    { label: '21 and over (NLW)', minAge: 21, maxAge: null, rate: 12.71 },
    { label: '18 to 20',          minAge: 18, maxAge: 20,   rate: 10.85 },
    { label: 'Under 18',          minAge: 0,  maxAge: 17,   rate: 8.00  },
    { label: 'Apprentice',        minAge: 0,  maxAge: null,  rate: 8.00, apprentice: true },
  ],

  /**
   * Get applicable minimum wage rate for worker.
   */
  getRate(age, isApprentice = false) {
    if (isApprentice) return NMW.RATES.find(r => r.apprentice);
    return NMW.RATES.find(r => {
      if (r.apprentice) return false;
      if (r.maxAge === null) return age >= r.minAge;
      return age >= r.minAge && age <= r.maxAge;
    });
  },

  /**
   * Check if a given hourly rate is compliant.
   */
  check(hourlyRate, age, isApprentice = false) {
    const rateObj = NMW.getRate(age, isApprentice);
    if (!rateObj) return { compliant: false, minimumRate: 0, shortfall: 0 };
    const compliant = hourlyRate >= rateObj.rate;
    return {
      compliant,
      minimumRate: rateObj.rate,
      shortfall: compliant ? 0 : fmt.round2(rateObj.rate - hourlyRate),
      label: rateObj.label
    };
  }
};

/* ============================================================
   COMPANIES HOUSE DEADLINES
   ============================================================ */
const CHDeadlines = {
  /**
   * Calculate all key Companies House deadlines.
   * incorporationDate: Date object
   * yearEndDate: Date object (accounting year end)
   */
  calculate(incorporationDate, yearEndDate) {
    const addMonths = (d, m) => {
      const nd = new Date(d);
      nd.setMonth(nd.getMonth() + m);
      return nd;
    };
    const addDays = (d, days) => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + days);
      return nd;
    };
    const daysUntil = (d) => {
      const now = new Date(); now.setHours(0,0,0,0);
      const target = new Date(d); target.setHours(0,0,0,0);
      return Math.round((target - now) / (1000 * 60 * 60 * 24));
    };
    const fmtDate = d => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // First accounts: 21 months from incorporation
    const firstAccounts = addMonths(incorporationDate, 21);
    // Annual accounts: 9 months from year-end
    const annualAccounts = addMonths(yearEndDate, 9);
    // Confirmation statement: 12 months + 14 days from incorporation (annual)
    const confirmationStatement = addDays(addMonths(incorporationDate, 12), 14);
    // CT payment: 9 months + 1 day from year-end
    const ctPayment = addDays(addMonths(yearEndDate, 9), 1);
    // CT600 filing: 12 months from year-end
    const ct600 = addMonths(yearEndDate, 12);

    const statusClass = (days) => {
      if (days < 0) return 'red';
      if (days <= 30) return 'red';
      if (days <= 60) return 'amber';
      return 'green';
    };

    return [
      {
        name: 'First accounts (Companies House)',
        date: firstAccounts,
        dateStr: fmtDate(firstAccounts),
        daysUntil: daysUntil(firstAccounts),
        status: statusClass(daysUntil(firstAccounts)),
        note: '21 months from incorporation date'
      },
      {
        name: 'Annual accounts (Companies House)',
        date: annualAccounts,
        dateStr: fmtDate(annualAccounts),
        daysUntil: daysUntil(annualAccounts),
        status: statusClass(daysUntil(annualAccounts)),
        note: '9 months after accounting year-end'
      },
      {
        name: 'Confirmation statement',
        date: confirmationStatement,
        dateStr: fmtDate(confirmationStatement),
        daysUntil: daysUntil(confirmationStatement),
        status: statusClass(daysUntil(confirmationStatement)),
        note: '12 months + 14 days from last filing'
      },
      {
        name: 'Corporation tax payment',
        date: ctPayment,
        dateStr: fmtDate(ctPayment),
        daysUntil: daysUntil(ctPayment),
        status: statusClass(daysUntil(ctPayment)),
        note: '9 months and 1 day after year-end'
      },
      {
        name: 'CT600 filing (HMRC)',
        date: ct600,
        dateStr: fmtDate(ct600),
        daysUntil: daysUntil(ct600),
        status: statusClass(daysUntil(ct600)),
        note: '12 months after accounting year-end'
      }
    ];
  }
};

/* ============================================================
   LATE FILING PENALTIES (Companies House)
   ============================================================ */
const LFP = {
  // Annual accounts late filing penalties
  BANDS: [
    { maxDays: 30,  penalty: 150,  label: 'Up to 1 month' },
    { maxDays: 90,  penalty: 375,  label: '1 to 3 months' },
    { maxDays: 180, penalty: 750,  label: '3 to 6 months' },
    { maxDays: Infinity, penalty: 1500, label: 'Over 6 months' }
  ],

  /**
   * Calculate late filing penalty.
   * daysLate: number of days late
   * consecutiveLate: true if company was late previous year too (doubles penalty)
   */
  calculate(daysLate, consecutiveLate = false) {
    if (daysLate <= 0) return { penalty: 0, band: null };
    const band = LFP.BANDS.find(b => daysLate <= b.maxDays);
    const base = band.penalty;
    const penalty = consecutiveLate ? base * 2 : base;
    return { penalty, band: band.label, doubled: consecutiveLate };
  }
};

/* ============================================================
   CAPITAL ALLOWANCES
   ============================================================ */
const CapAllowances = {
  AIA_LIMIT: 1000000,          // Annual Investment Allowance
  WDA_MAIN: 0.18,              // Writing Down Allowance main pool
  WDA_SPECIAL: 0.06,           // Writing Down Allowance special rate pool

  ASSET_TYPES: {
    'Plant and machinery (main pool)': { pool: 'main', aia: true, fullExpensing: true },
    'Cars (0g/km CO2, from April 2021)': { pool: 'main', aia: false, fullExpensing: false, fya: true },
    'Cars (1-50g/km CO2)': { pool: 'main', aia: false, fullExpensing: false },
    'Cars (51g/km CO2 and above)': { pool: 'special', aia: false, fullExpensing: false },
    'Integral features (special rate)': { pool: 'special', aia: true, fullExpensing: false, fya50: true },
    'Long-life assets': { pool: 'special', aia: true, fullExpensing: false, fya50: true },
    'Structures and buildings': { pool: 'sba', aia: false, fullExpensing: false },
  },

  calculate(cost, assetType) {
    const def = CapAllowances.ASSET_TYPES[assetType];
    if (!def) return null;
    let relief = 0, method = '';

    if (def.aia && cost <= CapAllowances.AIA_LIMIT) {
      relief = cost;
      method = 'Annual Investment Allowance (100%)';
    } else if (def.fullExpensing) {
      relief = cost;
      method = 'Full expensing (100% first year)';
    } else if (def.fya) {
      relief = cost;
      method = 'First Year Allowance (100%)';
    } else if (def.fya50) {
      relief = cost * 0.5;
      method = '50% First Year Allowance';
    } else if (def.pool === 'sba') {
      relief = cost * 0.03;
      method = 'Structures and Buildings Allowance (3%/year)';
    } else {
      const rate = def.pool === 'special' ? CapAllowances.WDA_SPECIAL : CapAllowances.WDA_MAIN;
      relief = cost * rate;
      method = `Writing Down Allowance (${rate * 100}%)`;
    }

    return {
      cost,
      relief: fmt.round2(relief),
      taxSaving: fmt.round2(relief * 0.25),  // at main CT rate
      method,
      pool: def.pool
    };
  }
};

/* ============================================================
   BREAK-EVEN CALCULATOR
   ============================================================ */
const BreakEven = {
  /**
   * Calculate break-even point.
   */
  calculate(fixedCosts, variableCostPerUnit, sellingPricePerUnit) {
    const contribution = sellingPricePerUnit - variableCostPerUnit;
    if (contribution <= 0) return null;
    const beUnits = fixedCosts / contribution;
    const beRevenue = beUnits * sellingPricePerUnit;
    const margin = (contribution / sellingPricePerUnit) * 100;
    return {
      contributionPerUnit: fmt.round2(contribution),
      breakEvenUnits: Math.ceil(beUnits),
      breakEvenRevenue: fmt.round2(beRevenue),
      contributionMargin: fmt.round2(margin)
    };
  },

  /**
   * Generate profit/loss chart data.
   */
  chartData(fixedCosts, variableCostPerUnit, sellingPricePerUnit, maxUnits) {
    const data = [];
    for (let units = 0; units <= maxUnits; units += Math.max(1, Math.floor(maxUnits / 20))) {
      const revenue = units * sellingPricePerUnit;
      const totalCost = fixedCosts + (units * variableCostPerUnit);
      const profit = revenue - totalCost;
      data.push({ units, revenue: fmt.round2(revenue), totalCost: fmt.round2(totalCost), profit: fmt.round2(profit) });
    }
    return data;
  }
};

/* ============================================================
   PROFIT MARGIN
   ============================================================ */
const Margin = {
  INDUSTRY_BENCHMARKS: {
    'Retail': { gross: 35, net: 5 },
    'Professional services': { gross: 70, net: 20 },
    'IT / Software': { gross: 72, net: 18 },
    'Construction': { gross: 20, net: 5 },
    'Hospitality / Food & drink': { gross: 65, net: 6 },
    'Manufacturing': { gross: 35, net: 8 },
    'Healthcare': { gross: 45, net: 12 },
    'Financial services': { gross: 80, net: 25 },
    'Creative / Marketing': { gross: 65, net: 15 },
  },

  calculate(revenue, cogs, operatingExpenses) {
    const grossProfit = revenue - cogs;
    const netProfit = grossProfit - operatingExpenses;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;
    return {
      grossProfit: fmt.round2(grossProfit),
      netProfit: fmt.round2(netProfit),
      grossMargin: fmt.round2(grossMargin),
      netMargin: fmt.round2(netMargin),
      markup: fmt.round2(markup)
    };
  }
};

/* ============================================================
   DOM HELPERS
   ============================================================ */
const UI = {
  /** Set text content of an element */
  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  },

  /** Set HTML content */
  setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  /** Show/hide element */
  show(id) { const el = document.getElementById(id); if (el) el.classList.remove('hidden'); },
  hide(id) { const el = document.getElementById(id); if (el) el.classList.add('hidden'); },
  toggle(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.toggle('hidden', !show);
  },

  /** Get numeric input value */
  numVal(id, fallback = 0) {
    const el = document.getElementById(id);
    if (!el) return fallback;
    const v = parseFloat(el.value.replace(/,/g, ''));
    return isNaN(v) ? fallback : v;
  },

  /** Get string input value */
  strVal(id, fallback = '') {
    const el = document.getElementById(id);
    return el ? el.value.trim() : fallback;
  },

  /** Highlight a result row */
  highlightResult(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'background 0.3s';
    el.style.background = 'var(--accent-muted)';
    setTimeout(() => { el.style.background = ''; }, 800);
  },

  /** Tab switching */
  initTabs(tabsSelector = '.tabs') {
    document.querySelectorAll(tabsSelector).forEach(tabBar => {
      tabBar.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.id === target);
          });
        });
      });
    });
  },

  /** Badge status from days remaining */
  deadlineBadge(daysUntil) {
    if (daysUntil < 0) {
      return `<span class="badge badge--red">Overdue by ${Math.abs(daysUntil)} days</span>`;
    } else if (daysUntil <= 30) {
      return `<span class="badge badge--red">Due in ${daysUntil} days</span>`;
    } else if (daysUntil <= 60) {
      return `<span class="badge badge--amber">Due in ${daysUntil} days</span>`;
    } else {
      return `<span class="badge badge--green">Due in ${daysUntil} days</span>`;
    }
  }
};

/* ============================================================
   LATE PAYMENT INTEREST
   ============================================================ */
const LatePayment = {
  BOE_BASE_RATE: 4.75,    // Bank of England base rate (check quarterly)
  STATUTORY_ADDITIONAL: 8,

  statutoryRate() {
    return LatePayment.BOE_BASE_RATE + LatePayment.STATUTORY_ADDITIONAL;
  },

  calculate(amount, daysLate) {
    const dailyRate = LatePayment.statutoryRate() / 100 / 365;
    const interest = fmt.round2(amount * dailyRate * daysLate);
    return {
      rate: LatePayment.statutoryRate(),
      interest,
      total: fmt.round2(amount + interest)
    };
  }
};

/* ============================================================
   MTD INCOME TAX THRESHOLDS
   ============================================================ */
const MTD = {
  ITSA_THRESHOLDS: [
    { from: new Date('2026-04-06'), income: 50000, label: 'April 2026' },
    { from: new Date('2027-04-06'), income: 30000, label: 'April 2027' },
    { from: new Date('2028-04-06'), income: 20000, label: 'April 2028 (proposed)' },
  ],

  checkITSA(totalIncome) {
    const results = [];
    for (const t of MTD.ITSA_THRESHOLDS) {
      results.push({
        label: t.label,
        threshold: t.income,
        affected: totalIncome >= t.income,
        from: t.from.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
      });
    }
    return results;
  }
};

/* export for module-aware contexts */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fmt, CT, IT, StructureCalc, Mileage, VAT, StatutoryPay, NMW, CHDeadlines, LFP, CapAllowances, BreakEven, Margin, UI, LatePayment, MTD };
}
