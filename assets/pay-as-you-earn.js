'use strict';

(function () {
  function bootPayeCalculator() {
  (function ensurePayeEmbedStyles() {
    try {
      const isLocalPreview =
        window.location.protocol === 'file:' ||
        window.location.origin === 'null' ||
        window.location.hostname === '';

      if (!isLocalPreview) return;

      const existing = document.querySelector('link[href$="paye-embed.css"]');
      if (existing) return;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'paye-embed.css';
      document.head.appendChild(link);
    } catch (e) {
      // ignore
    }
  })();

  (function ensureFooterAssets() {
    try {
      const isLocalPreview =
        window.location.protocol === 'file:' ||
        window.location.origin === 'null' ||
        window.location.hostname === '';

      if (!isLocalPreview) return;

      const footer = document.querySelector('.financity-footer-wrapper');
      if (!footer) return;

      function normalizeImageSrc(src) {
        if (!src) return src;

        // Fix PageSpeed rewritten filenames in saved/viewsource HTML, e.g.
        // /wp-content/.../xFoo.jpg.pagespeed.ic.ABC.webp -> /wp-content/.../Foo.jpg
        src = src.replace(/\.pagespeed\.ic\.[^.]+\.webp$/i, '');

        // Convert root-relative WP URLs to absolute so they load in file:// context.
        if (src.charAt(0) === '/') return 'https://gra.gov.gh' + src;

        return src;
      }

      const imgs = footer.querySelectorAll('img[src]');
      for (let i = 0; i < imgs.length; i++) {
        const img = imgs[i];
        const src = img.getAttribute('src');
        const next = normalizeImageSrc(src);
        if (next && next !== src) img.setAttribute('src', next);
      }
    } catch (e) {
      // ignore
    }
  })();

  (function ensurePayeHeroTitle() {
    try {
      const titleEl = document.querySelector('.financity-page-title');
      if (!titleEl) return;
      titleEl.textContent = 'Pay As You Earn (PAYE)';
    } catch (e) {
      // ignore
    }
  })();

  (function ensurePayeEmbedMarkup() {
    try {
      const mount = document.getElementById('gra-paye-calculator');
      if (!mount) return;

      try {
        const hasGoodlayersLayout = !!(
          document.getElementById('gdlr-core-column-paye') ||
          document.querySelector('.gdlr-core-pbf-sidebar-wrapper') ||
          document.querySelector('.gdlr-core-page-builder-body')
        );

        if (!hasGoodlayersLayout) {
          mount.classList.add('gra-paye-standalone');
        } else {
          mount.classList.remove('gra-paye-standalone');
        }
      } catch (e) {
        // ignore
      }

      // If the calculator is already present, do nothing.
      if (document.getElementById('paye-form')) return;

      mount.innerHTML = `
        <div class="gra-main-panel paye-vat-shell">
          <div class="paye-vat-header">
            <h5>PAY AS YOU EARN Calculator</h5>
          </div>
          <div class="paye-vat-body">
            <div class="paye-vat-grid" style="display: block;">
              <div class="paye-vat-col" style="margin: 0 auto 40px;">
                <div class="paye-vat-card">
                  <div class="paye-vat-section-title">Income and reliefs</div>
                  <form id="paye-form" novalidate>
                    <div class="gra-field">
                      <label class="gra-label">PAYE type</label>
                      <div class="paye-type-toggle" style="margin-top: 6px;">
                        <label>
                          <input type="radio" name="payeType" id="payeTypeEmployeeMonthly" value="monthly" checked />
                          <span class="paye-type-option">Employee (Monthly)</span>
                        </label>
                        <label>
                          <input type="radio" name="payeType" id="payeTypeEmployeeAnnual" value="annual" />
                          <span class="paye-type-option">Employee (Annual)</span>
                        </label>
                      </div>
                    </div>

                    <div class="paye-field-divider"></div>

                    <div class="gra-field">
                      <label id="incomeLabel" for="monthlyIncome" class="gra-label">Monthly chargeable income <span aria-hidden="true" style="color: #b91c1c;">*</span></label>
                      <div class="gra-input-wrap" style="margin-top: 6px;">
                        <span class="gra-input-prefix">GH¢</span>
                        <input id="monthlyIncome" class="gra-input" inputmode="decimal" placeholder="e.g. 7,500.00" autocomplete="off" required />
                      </div>
                      <p id="incomeError" class="gra-error" role="alert"><span id="incomeErrorText">Enter the monthly chargeable income.</span></p>
                      <span id="payeBasisHint" class="gra-hint" style="margin-top: 6px;">Enter chargeable income after SSNIT (5.5% of basic), provident fund (up to 16.5% of basic), qualifying mortgage interest, and donations.</span>
                    </div>

                    <div class="paye-field-divider"></div>

                    <div class="gra-field">
                      <label class="gra-label">Tax reliefs</label>
                      <span class="gra-hint" style="margin-top: 6px;">Select applicable reliefs (annual amounts prorated monthly).</span>
                      <div style="margin-top: 10px; display: grid; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                          <input id="reliefMarriage" type="checkbox" />
                          <span style="font-size: 17px; color: #374151; line-height: 1.6;">Marriage / Responsibility relief (GH¢1,200 per year)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                          <input id="reliefOldAge" type="checkbox" />
                          <span style="font-size: 17px; color: #374151; line-height: 1.6;">Old age relief (GH¢1,500 per year)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                          <input id="reliefEducation" type="checkbox" />
                          <span style="font-size: 17px; color: #374151; line-height: 1.6;">Educational relief (GH¢2,000 per year)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 12px; cursor: pointer;">
                          <input id="reliefDisability" type="checkbox" />
                          <span style="font-size: 17px; color: #374151; line-height: 1.6;">Disability relief (25% of income)</span>
                        </label>

                        <div class="gra-field" style="gap: 6px; margin-top: 14px;">
                          <label class="gra-label" for="reliefChildrenCount" style="font-weight: 500;">Child education relief</label>
                          <span class="gra-hint">GH¢600 per child per year (max 3)</span>
                          <div class="gra-input-wrap" style="margin-top: 6px;">
                            <span class="gra-input-prefix">No.</span>
                            <input id="reliefChildrenCount" class="gra-input" inputmode="numeric" autocomplete="off" value="0" />
                          </div>
                        </div>

                        <div class="gra-field" style="gap: 6px;">
                          <label class="gra-label" for="reliefDependentsCount" style="font-weight: 500;">Aged dependent relative relief</label>
                          <span class="gra-hint">GH¢1,000 per relative per year (max 2)</span>
                          <div class="gra-input-wrap" style="margin-top: 6px;">
                            <span class="gra-input-prefix">No.</span>
                            <input id="reliefDependentsCount" class="gra-input" inputmode="numeric" autocomplete="off" value="0" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="gra-actions paye-vat-actions" style="flex-direction: column; align-items: stretch;">
                      <button type="submit" class="gra-btn-primary paye-vat-btn">Calculate</button>
                      <button type="button" id="resetBtn" class="gra-btn-secondary paye-vat-btn-secondary" style="width: 100%;">Clear</button>
                    </div>
                  </form>

                  <section id="paye-results" class="gra-results is-hidden" aria-live="polite">
                    <div class="paye-results-simple">
                      <div class="paye-result-line"><span id="resultReliefLabel" class="paye-result-label">TOTAL RELIEF:</span><span id="resultRelief" class="paye-result-value"></span></div>
                      <div class="paye-result-line"><span id="resultTaxableLabel" class="paye-result-label">TAXABLE INCOME:</span><span id="resultTaxable" class="paye-result-value"></span></div>
                      <div class="paye-result-line"><span id="resultTaxLabel" class="paye-result-label">PAYE PAYABLE:</span><span id="resultTax" class="paye-result-value"></span></div>
                      <div class="paye-result-line"><span class="paye-result-label">EFFECTIVE RATE:</span><span id="resultRate" class="paye-result-value"></span></div>
                      <div class="paye-result-line"><span id="resultNetLabel" class="paye-result-label">NET MONTHLY:</span><span id="resultNet" class="paye-result-value"></span></div>
                      <div id="resultTaxMonthlyRow" class="paye-result-line is-hidden"><span class="paye-result-label">PAYE PAYABLE (MONTHLY EQUIV.):</span><span id="resultTaxMonthly" class="paye-result-value"></span></div>
                      <div id="resultNetMonthlyRow" class="paye-result-line is-hidden"><span class="paye-result-label">NET MONTHLY (EQUIV.):</span><span id="resultNetMonthly" class="paye-result-value"></span></div>
                    </div>

                    <button type="button" id="breakdownToggleBtn" class="gra-btn-secondary is-hidden" style="width: 100%; margin-top: 10px;">View breakdown</button>

                    <div id="payeBreakdown" class="is-hidden" aria-label="PAYE breakdown">
                      <div class="table-wrapper">
                        <table class="fl-table">
                          <thead>
                            <tr>
                              <th><strong id="breakdownCaption">Band (monthly)</strong></th>
                              <th><strong>Rate (%)</strong></th>
                              <th><strong>Tax on band (GH¢)</strong></th>
                              <th><strong>Taxable amount (GH¢)</strong></th>
                              <th><strong>Cumulative tax (GH¢)</strong></th>
                            </tr>
                          </thead>
                          <tbody id="breakdownBody"></tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

              <div class="paye-vat-col" style="margin: 0 auto 20px;">
                <div class="paye-vat-card">
                  <div class="paye-vat-section-title">PAYE Bands</div>
                  <div class="table-wrapper">
                    <table class="fl-table" aria-label="PAYE 2026 tax bands">
                      <thead>
                        <tr>
                          <th><strong id="bandsCaption">Year of Assessment 2026</strong></th>
                          <th><strong>Chargeable Income GH¢</strong></th>
                          <th><strong>Rate %</strong></th>
                          <th><strong>Tax Payable GH¢</strong></th>
                          <th><strong>Cumulative Income GH¢</strong></th>
                          <th><strong>Cumulative Tax GH¢</strong></th>
                        </tr>
                      </thead>
                      <tbody id="bandsTableBody"></tbody>
                    </table>
                  </div>
                  <p class="gra-hint" id="bandsEffectiveNote" style="margin-top: 10px;">These rates took effect 1 September 2026 under the Income Tax (Amendment) Act, 2026 (Act 1178).</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;

      try {
        const existingPanel = document.getElementById('paye-explainer-panel');
        if (!existingPanel) {
          const panel = document.createElement('div');
          panel.id = 'paye-explainer-panel';
          panel.style.marginTop = '18px';

          panel.innerHTML =
            '<div style="font-weight:700; color:#3e4494; margin-bottom:6px;">PAYE explained</div>' +
            '<div class="gra-hint" style="margin-top: 0;">' +
            'Understand PAYE, who must pay, how it works, and the latest guidance. ' +
            '<a href="https://gra.gov.gh/domestic-tax/tax-types/paye/">Open PAYE information page</a>' +
            '</div>' +
            '<div style="font-weight:700; color:#3e4494; margin-bottom:6px; margin-top:18px;">Personal tax reliefs</div>' +
            '<div class="gra-hint" style="margin-top: 0;">' +
            'Learn about available personal tax reliefs and how to claim them. ' +
            '<a href="https://gra.gov.gh/domestic-tax/personal-tax-relief/">Open personal tax reliefs page</a>' +
            '</div>' +
            '<div style="font-weight:700; color:#3e4494; margin-bottom:6px; margin-top:18px;">File and Pay taxes</div>' +
            '<div class="gra-hint" style="margin-top: 0;">' +
            'Register, file your returns, and pay your taxes online through the GRA portal. ' +
            '<a href="https://taxpayersportal.com/auth">Open File and Pay portal</a>' +
            '</div>';

          const payeCards = mount.querySelectorAll('.paye-vat-col .paye-vat-card');
          const payeBandsCard = payeCards && payeCards.length > 1 ? payeCards[1] : null;
          if (payeBandsCard && payeBandsCard.parentNode) {
            if (payeBandsCard.nextSibling) {
              payeBandsCard.parentNode.insertBefore(panel, payeBandsCard.nextSibling);
            } else {
              payeBandsCard.parentNode.appendChild(panel);
            }
          }
        }
      } catch (e) {
        // ignore
      }

    } catch (e) {
      // ignore
    }
  })();

  if (!document.getElementById('paye-form')) return;

  const monthlyIncomeInput = document.getElementById('monthlyIncome');
  const incomeLabelEl = document.getElementById('incomeLabel');
  const incomeError = document.getElementById('incomeError');
  const incomeErrorTextEl = document.getElementById('incomeErrorText');
  const form = document.getElementById('paye-form');
  const resetBtn = document.getElementById('resetBtn');

  if (!monthlyIncomeInput || !form) {
    return;
  }

  const resultsSection = document.getElementById('paye-results');
  const resultTaxLabelEl = document.getElementById('resultTaxLabel');
  const resultTaxEl = document.getElementById('resultTax');
  const resultRateEl = document.getElementById('resultRate');
  const resultNetLabelEl = document.getElementById('resultNetLabel');
  const resultNetEl = document.getElementById('resultNet');

  const resultReliefLabelEl = document.getElementById('resultReliefLabel');
  const resultReliefEl = document.getElementById('resultRelief');
  const resultTaxableLabelEl = document.getElementById('resultTaxableLabel');
  const resultTaxableEl = document.getElementById('resultTaxable');

  const resultTaxMonthlyRowEl = document.getElementById('resultTaxMonthlyRow');
  const resultTaxMonthlyEl = document.getElementById('resultTaxMonthly');
  const resultNetMonthlyRowEl = document.getElementById('resultNetMonthlyRow');
  const resultNetMonthlyEl = document.getElementById('resultNetMonthly');

  const breakdownWrap = document.getElementById('payeBreakdown');
  const breakdownCaptionEl = document.getElementById('breakdownCaption');
  const breakdownBodyEl = document.getElementById('breakdownBody');
  const breakdownToggleBtn = document.getElementById('breakdownToggleBtn');

  const payeTypeEmployeeMonthlyRadio = document.getElementById('payeTypeEmployeeMonthly');
  const payeTypeEmployeeAnnualRadio = document.getElementById('payeTypeEmployeeAnnual');

  const payeBasisHintEl = document.getElementById('payeBasisHint');

  const reliefMarriageEl = document.getElementById('reliefMarriage');
  const reliefOldAgeEl = document.getElementById('reliefOldAge');
  const reliefEducationEl = document.getElementById('reliefEducation');
  const reliefDisabilityEl = document.getElementById('reliefDisability');
  const reliefChildrenCountEl = document.getElementById('reliefChildrenCount');
  const reliefDependentsCountEl = document.getElementById('reliefDependentsCount');

  const bandsCaptionEl = document.getElementById('bandsCaption');
  const bandsTableBodyEl = document.getElementById('bandsTableBody');

  // Resident individual bands, Year of Assessment 2026.
  // Published on https://gra.gov.gh/domestic-tax/tax-types/paye/
  // Effective 1 September 2026 (Income Tax (Amendment) Act, 2026, Act 1178).
  const EMPLOYEE_PAYE_BANDS_2026 = [
    { amount: 588, rate: 0 },
    { amount: 80, rate: 5 },
    { amount: 100, rate: 10 },
    { amount: 2900, rate: 17.5 },
    { amount: 16000, rate: 25 },
    { amount: 30332, rate: 30 },
  ];

  const EMPLOYEE_PAYE_BANDS_2026_ANNUAL = [
    { amount: 7056, rate: 0 },
    { amount: 960, rate: 5 },
    { amount: 1200, rate: 10 },
    { amount: 34800, rate: 17.5 },
    { amount: 192000, rate: 25 },
    { amount: 363984, rate: 30 },
  ];

  const EMPLOYEE_EXCEEDING_THRESHOLD_2026 = 50000;
  const EMPLOYEE_EXCEEDING_THRESHOLD_2026_ANNUAL = 600000;

  const RELIEF_MARRIAGE_ANNUAL = 1200;
  const RELIEF_CHILD_EDU_PER_CHILD_ANNUAL = 600;
  const RELIEF_OLD_AGE_ANNUAL = 1500;
  const RELIEF_AGED_DEPENDENT_PER_RELATIVE_ANNUAL = 1000;
  const RELIEF_EDUCATIONAL_ANNUAL = 2000;

  function toCents(value) {
    if (!isFinite(value)) return 0;
    return Math.round(Number(value) * 100);
  }

  function fromCents(cents) {
    return cents / 100;
  }

  function sliceTaxCents(amountCents, ratePercent) {
    const rateBp = Math.round(ratePercent * 100);
    return Math.round((amountCents * rateBp) / 10000);
  }

  function calculateTaxCents(chargeableIncomeCents, bands, topRatePercent) {
    if (chargeableIncomeCents <= 0 || !isFinite(chargeableIncomeCents)) return 0;

    let remaining = chargeableIncomeCents;
    let taxCents = 0;

    for (let i = 0; i < bands.length; i++) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, toCents(bands[i].amount));
      taxCents += sliceTaxCents(take, bands[i].rate);
      remaining -= take;
    }

    if (remaining > 0) {
      taxCents += sliceTaxCents(remaining, topRatePercent);
    }

    return taxCents;
  }

  function buildPayeCumulativeTable(bands) {
    const table = [];
    let cumulativeIncomeCents = 0;
    let cumulativeTaxCents = 0;

    for (let i = 0; i < bands.length; i++) {
      const band = bands[i];
      const widthCents = toCents(band.amount);
      const taxCents = sliceTaxCents(widthCents, band.rate);

      cumulativeIncomeCents += widthCents;
      cumulativeTaxCents += taxCents;

      table.push({
        chargeableIncome: fromCents(widthCents),
        rate: band.rate,
        taxPayable: fromCents(taxCents),
        cumulativeIncome: fromCents(cumulativeIncomeCents),
        cumulativeTax: fromCents(cumulativeTaxCents),
      });
    }

    return table;
  }

  const EMPLOYEE_PAYE_BANDS_2026_CUMULATIVE = buildPayeCumulativeTable(
    EMPLOYEE_PAYE_BANDS_2026
  );

  const EMPLOYEE_PAYE_BANDS_2026_ANNUAL_CUMULATIVE = buildPayeCumulativeTable(
    EMPLOYEE_PAYE_BANDS_2026_ANNUAL
  );

  function resolvePayeMode() {
    const isEmployeeAnnual = !!(
      payeTypeEmployeeAnnualRadio && payeTypeEmployeeAnnualRadio.checked === true
    );

    const isEmployeeMonthly = !!(
      payeTypeEmployeeMonthlyRadio && payeTypeEmployeeMonthlyRadio.checked === true
    );

    if (isEmployeeAnnual) {
      return { kind: 'employee', basis: 'annual' };
    }

    if (isEmployeeMonthly) {
      return { kind: 'employee', basis: 'monthly' };
    }

    return { kind: 'employee', basis: 'monthly' };
  }

  function renderBandsTable(mode) {
    if (!bandsTableBodyEl || !bandsCaptionEl) return;

    const isAnnual = mode && mode.basis === 'annual';

    const bands = isAnnual
      ? EMPLOYEE_PAYE_BANDS_2026_ANNUAL_CUMULATIVE
      : EMPLOYEE_PAYE_BANDS_2026_CUMULATIVE;

    bandsCaptionEl.textContent = isAnnual
      ? 'Year of Assessment 2026 (Annual)'
      : 'Year of Assessment 2026 (Monthly)';

    bandsTableBodyEl.innerHTML = '';

    const formatter = new Intl.NumberFormat('en-GH', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    for (let i = 0; i < bands.length; i++) {
      const row = document.createElement('tr');

      const bandData = bands[i];

      const labelPrefix = i === 0 ? 'First' : 'Next';

      const colLabel = document.createElement('td');
      colLabel.innerHTML = '<strong>' + labelPrefix + '</strong>';

      const colBand = document.createElement('td');
      colBand.innerHTML = '<strong>' + formatter.format(bandData.chargeableIncome) + '</strong>';

      const colRate = document.createElement('td');
      colRate.innerHTML = '<strong>' + String(bandData.rate) + '</strong>';

      const colTax = document.createElement('td');
      colTax.innerHTML = '<strong>' + formatter.format(bandData.taxPayable) + '</strong>';

      const colCumIncome = document.createElement('td');
      colCumIncome.innerHTML = '<strong>' + formatter.format(bandData.cumulativeIncome) + '</strong>';

      const colCumTax = document.createElement('td');
      colCumTax.innerHTML = '<strong>' + formatter.format(bandData.cumulativeTax) + '</strong>';

      row.appendChild(colLabel);
      row.appendChild(colBand);
      row.appendChild(colRate);
      row.appendChild(colTax);
      row.appendChild(colCumIncome);
      row.appendChild(colCumTax);

      bandsTableBodyEl.appendChild(row);
    }

    // Add the exceeding row
    const exceedingRow = document.createElement('tr');

    const exceedingThreshold = isAnnual
      ? EMPLOYEE_EXCEEDING_THRESHOLD_2026_ANNUAL
      : EMPLOYEE_EXCEEDING_THRESHOLD_2026;

    const colLabelExc = document.createElement('td');
    colLabelExc.innerHTML = '<strong>Exceeding</strong>';

    const colBandExc = document.createElement('td');
    colBandExc.innerHTML = '<strong>' + formatter.format(exceedingThreshold) + '</strong>';

    const colRateExc = document.createElement('td');
    colRateExc.innerHTML = '<strong>35</strong>';

    const colTaxExc = document.createElement('td');
    colTaxExc.innerHTML = '<strong></strong>';

    const colCumIncomeExc = document.createElement('td');
    colCumIncomeExc.innerHTML = '<strong></strong>';

    const colCumTaxExc = document.createElement('td');
    colCumTaxExc.innerHTML = '<strong></strong>';

    exceedingRow.appendChild(colLabelExc);
    exceedingRow.appendChild(colBandExc);
    exceedingRow.appendChild(colRateExc);
    exceedingRow.appendChild(colTaxExc);
    exceedingRow.appendChild(colCumIncomeExc);
    exceedingRow.appendChild(colCumTaxExc);

    bandsTableBodyEl.appendChild(exceedingRow);
  }

  function formatCurrency(amount) {
    if (!isFinite(amount)) return '';
    return (
      'GH¢ ' +
      amount
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
  }

  function formatPercent(value) {
    if (!isFinite(value)) return '';
    return value.toFixed(2) + '%';
  }

  function updateBasisHint() {
    if (!payeBasisHintEl) return;
    payeBasisHintEl.textContent =
      'Enter chargeable income after SSNIT (5.5% of basic), provident fund (up to 16.5% of basic), qualifying mortgage interest, and donations.';
  }

  function setAnnualMonthlyEquivalentsVisible(isAnnual) {
    if (resultTaxMonthlyRowEl) {
      resultTaxMonthlyRowEl.classList.toggle('is-hidden', !isAnnual);
    }
    if (resultNetMonthlyRowEl) {
      resultNetMonthlyRowEl.classList.toggle('is-hidden', !isAnnual);
    }
    if (!isAnnual) {
      if (resultTaxMonthlyEl) resultTaxMonthlyEl.textContent = '';
      if (resultNetMonthlyEl) resultNetMonthlyEl.textContent = '';
    }
  }

  function updateIncomeUi(mode) {
    const isAnnual = mode && mode.basis === 'annual';
    if (incomeLabelEl) {
      incomeLabelEl.innerHTML = isAnnual
        ? 'Annual chargeable income <span aria-hidden="true" style="color: #b91c1c;">*</span>'
        : 'Monthly chargeable income <span aria-hidden="true" style="color: #b91c1c;">*</span>';
    }

    if (monthlyIncomeInput) {
      monthlyIncomeInput.placeholder = isAnnual ? 'e.g. 90,000.00' : 'e.g. 7,500.00';
    }

    if (incomeErrorTextEl && !incomeError.classList.contains('is-visible')) {
      incomeErrorTextEl.textContent = isAnnual
        ? 'Enter the annual chargeable income.'
        : 'Enter the monthly chargeable income.';
    }
  }

  function updateResultLabels(mode) {
    const isAnnual = mode && mode.basis === 'annual';

    if (resultReliefLabelEl) {
      resultReliefLabelEl.textContent = isAnnual ? 'TOTAL RELIEF (ANNUAL):' : 'TOTAL RELIEF:';
    }

    if (resultTaxableLabelEl) {
      resultTaxableLabelEl.textContent = isAnnual ? 'TAXABLE INCOME (ANNUAL):' : 'TAXABLE INCOME:';
    }

    if (resultTaxLabelEl) {
      resultTaxLabelEl.textContent = isAnnual ? 'PAYE PAYABLE (ANNUAL):' : 'PAYE PAYABLE:';
    }

    if (resultNetLabelEl) {
      resultNetLabelEl.textContent = isAnnual ? 'NET ANNUAL:' : 'NET MONTHLY:';
    }
  }

  function clampInt(value, min, max) {
    const n = Math.floor(Number(value) || 0);
    return Math.max(min, Math.min(max, n));
  }

  function wireClampedIntInput(el, min, max) {
    if (!el) return;

    function applyClamp(rawValue) {
      if (rawValue === '' || rawValue == null) return '';
      return String(clampInt(rawValue, min, max));
    }

    el.addEventListener('input', function () {
      const raw = String(this.value);
      if (raw === '') return;

      const next = applyClamp(raw);
      if (next !== raw) {
        this.value = next;
      }
    });

    el.addEventListener('blur', function () {
      const raw = String(this.value).trim();
      if (raw === '') {
        this.value = '0';
        return;
      }

      this.value = applyClamp(raw);
    });
  }

  function readReliefInputs(mode, chargeableIncome) {
    const isAnnual = mode && mode.basis === 'annual';
    const factor = isAnnual ? 1 : 1 / 12;

    let total = 0;

    if (reliefMarriageEl && reliefMarriageEl.checked) {
      total += RELIEF_MARRIAGE_ANNUAL * factor;
    }

    if (reliefOldAgeEl && reliefOldAgeEl.checked) {
      total += RELIEF_OLD_AGE_ANNUAL * factor;
    }

    if (reliefEducationEl && reliefEducationEl.checked) {
      total += RELIEF_EDUCATIONAL_ANNUAL * factor;
    }

    const childCount = clampInt(reliefChildrenCountEl ? reliefChildrenCountEl.value : 0, 0, 3);
    total += childCount * RELIEF_CHILD_EDU_PER_CHILD_ANNUAL * factor;

    const dependentCount = clampInt(reliefDependentsCountEl ? reliefDependentsCountEl.value : 0, 0, 2);
    total += dependentCount * RELIEF_AGED_DEPENDENT_PER_RELATIVE_ANNUAL * factor;

    if (reliefDisabilityEl && reliefDisabilityEl.checked) {
      total += 0.25 * (Number(chargeableIncome) || 0);
    }

    if (!isFinite(total) || total < 0) return 0;
    return total;
  }

  function calculateAnnualPaye(annualChargeableIncome, bands, topRatePercent) {
    return fromCents(calculateTaxCents(toCents(annualChargeableIncome), bands, topRatePercent));
  }

  function buildBreakdownRows(chargeableIncome, bands, topRatePercent) {
    const rows = [];
    let remaining = toCents(chargeableIncome);
    let cumulativeTaxCents = 0;

    for (let i = 0; i < bands.length; i++) {
      if (remaining <= 0) break;

      const band = bands[i];
      const take = Math.min(remaining, toCents(band.amount));
      const taxOnBandCents = sliceTaxCents(take, band.rate);

      cumulativeTaxCents += taxOnBandCents;
      remaining -= take;

      rows.push({
        index: i,
        taxableAmount: fromCents(take),
        rate: band.rate,
        taxOnBand: fromCents(taxOnBandCents),
        cumulativeTax: fromCents(cumulativeTaxCents),
      });
    }

    if (remaining > 0) {
      const taxOnBandCents = sliceTaxCents(remaining, topRatePercent);
      cumulativeTaxCents += taxOnBandCents;

      rows.push({
        index: bands.length,
        taxableAmount: fromCents(remaining),
        rate: topRatePercent,
        taxOnBand: fromCents(taxOnBandCents),
        cumulativeTax: fromCents(cumulativeTaxCents),
        isExcess: true,
      });
    }

    return rows;
  }

  function renderBreakdown(mode, chargeableBase, bands) {
    if (!breakdownWrap || !breakdownBodyEl || !breakdownCaptionEl) return;

    const isAnnual = mode && mode.basis === 'annual';

    breakdownCaptionEl.textContent = isAnnual ? 'Band (annual)' : 'Band (monthly)';

    breakdownBodyEl.innerHTML = '';

    const formatter = new Intl.NumberFormat('en-GH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const rows = buildBreakdownRows(chargeableBase, bands, 35);

    const cumulativeLimit = isAnnual
      ? EMPLOYEE_EXCEEDING_THRESHOLD_2026_ANNUAL
      : EMPLOYEE_EXCEEDING_THRESHOLD_2026;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const rowEl = document.createElement('tr');

      const colBand = document.createElement('td');
      if (r.isExcess) {
        colBand.innerHTML = '<strong>Exceeding ' + formatter.format(cumulativeLimit) + '</strong>';
      } else {
        const labelPrefix = r.index === 0 ? 'First ' : 'Next ';
        colBand.innerHTML = '<strong>' + labelPrefix + formatter.format(bands[r.index].amount) + '</strong>';
      }

      const colRate = document.createElement('td');
      colRate.innerHTML = '<strong>' + String(r.rate) + '</strong>';

      const colTax = document.createElement('td');
      colTax.innerHTML = '<strong>' + formatter.format(r.taxOnBand) + '</strong>';

      const colTaxable = document.createElement('td');
      colTaxable.innerHTML = '<strong>' + formatter.format(r.taxableAmount) + '</strong>';

      const colCumTax = document.createElement('td');
      colCumTax.innerHTML = '<strong>' + formatter.format(r.cumulativeTax) + '</strong>';

      rowEl.appendChild(colBand);
      rowEl.appendChild(colRate);
      rowEl.appendChild(colTax);
      rowEl.appendChild(colTaxable);
      rowEl.appendChild(colCumTax);

      breakdownBodyEl.appendChild(rowEl);
    }

    // In standard mode, breakdown starts hidden and is shown only when user toggles.
  }

  function resetBreakdownUi() {
    if (breakdownWrap) breakdownWrap.classList.add('is-hidden');
    if (breakdownToggleBtn) {
      breakdownToggleBtn.classList.add('is-hidden');
      breakdownToggleBtn.textContent = 'View breakdown';
    }
  }

  function showBreakdownToggle() {
    if (!breakdownToggleBtn) return;
    breakdownToggleBtn.classList.remove('is-hidden');
    breakdownToggleBtn.textContent = 'View breakdown';
    if (breakdownWrap) breakdownWrap.classList.add('is-hidden');
  }

  function toggleBreakdown() {
    if (!breakdownWrap || !breakdownToggleBtn) return;

    const isHidden = breakdownWrap.classList.contains('is-hidden');
    if (isHidden) {
      breakdownWrap.classList.remove('is-hidden');
      breakdownToggleBtn.textContent = 'Hide breakdown';
    } else {
      breakdownWrap.classList.add('is-hidden');
      breakdownToggleBtn.textContent = 'View breakdown';
    }
  }

  function showIncomeError(message) {
    if (incomeErrorTextEl) incomeErrorTextEl.textContent = message;
    incomeError.classList.add('is-visible');
    monthlyIncomeInput.setAttribute('aria-invalid', 'true');
    resultsSection.classList.add('is-hidden');
    resetBreakdownUi();
    setAnnualMonthlyEquivalentsVisible(false);
    monthlyIncomeInput.focus();
  }

  function clearIncomeError() {
    incomeError.classList.remove('is-visible');
    monthlyIncomeInput.removeAttribute('aria-invalid');
  }

  function handleCalculate(event) {
    event.preventDefault();

    const modeForError = resolvePayeMode();
    const isAnnualInput = modeForError.basis === 'annual';
    const rawIncome = String(monthlyIncomeInput.value == null ? '' : monthlyIncomeInput.value).replace(/,/g, '').trim();

    if (!rawIncome) {
      showIncomeError(isAnnualInput ? 'Enter the annual chargeable income.' : 'Enter the monthly chargeable income.');
      return;
    }

    const inputValue = parseFloat(rawIncome);

    if (!isFinite(inputValue)) {
      showIncomeError('Enter a number, such as 7500.00.');
      return;
    }

    if (inputValue <= 0) {
      showIncomeError('Enter an amount greater than zero.');
      return;
    }

    clearIncomeError();

    const mode = resolvePayeMode();
    const isAnnual = mode.basis === 'annual';

    const bands = isAnnual
      ? EMPLOYEE_PAYE_BANDS_2026_ANNUAL
      : EMPLOYEE_PAYE_BANDS_2026;

    const chargeableBase = inputValue;
    const reliefTotal = readReliefInputs(mode, chargeableBase);
    const taxableIncome = Math.max(0, chargeableBase - reliefTotal);

    const computedTax = calculateAnnualPaye(taxableIncome, bands, 35);
    const netValue = chargeableBase - computedTax;
    const effectiveRate = taxableIncome > 0 ? (computedTax / taxableIncome) * 100 : 0;

    const monthlyTaxEquiv = isAnnual ? computedTax / 12 : null;
    const monthlyNetEquiv = isAnnual ? netValue / 12 : null;

    if (resultReliefEl) resultReliefEl.textContent = formatCurrency(reliefTotal);
    if (resultTaxableEl) resultTaxableEl.textContent = formatCurrency(taxableIncome);

    resultTaxEl.textContent = formatCurrency(computedTax);
    resultRateEl.textContent = formatPercent(effectiveRate);
    resultNetEl.textContent = formatCurrency(netValue);

    setAnnualMonthlyEquivalentsVisible(isAnnual);
    if (isAnnual) {
      if (resultTaxMonthlyEl) resultTaxMonthlyEl.textContent = formatCurrency(monthlyTaxEquiv);
      if (resultNetMonthlyEl) resultNetMonthlyEl.textContent = formatCurrency(monthlyNetEquiv);
    }

    resultsSection.classList.remove('is-hidden');

    renderBreakdown(mode, taxableIncome, bands);
    showBreakdownToggle();
  }

  function handleReset() {
    monthlyIncomeInput.value = '';
    if (reliefMarriageEl) reliefMarriageEl.checked = false;
    if (reliefOldAgeEl) reliefOldAgeEl.checked = false;
    if (reliefEducationEl) reliefEducationEl.checked = false;
    if (reliefDisabilityEl) reliefDisabilityEl.checked = false;
    if (reliefChildrenCountEl) reliefChildrenCountEl.value = '0';
    if (reliefDependentsCountEl) reliefDependentsCountEl.value = '0';
    clearIncomeError();
    resultsSection.classList.add('is-hidden');
    resetBreakdownUi();
    setAnnualMonthlyEquivalentsVisible(false);

    if (resultReliefEl) resultReliefEl.textContent = '';
    if (resultTaxableEl) resultTaxableEl.textContent = '';
  }

  function runSelfTest() {
    if (!window || !window.location) return;
    const params = new URLSearchParams(window.location.search || '');
    if (params.get('selftest') !== '1') return;

    const approxEqual = function (a, b, eps) {
      return Math.abs(a - b) <= eps;
    };

    const cases = [];

    const monthlyChecks = [
      { income: 0, tax: 0 },
      { income: 588, tax: 0 },
      { income: 668, tax: 4 },
      { income: 768, tax: 14 },
      { income: 3668, tax: 521.5 },
      { income: 19668, tax: 4521.5 },
      { income: 50000, tax: 13621.1 },
      { income: 50001, tax: 13621.45 },
      { income: 7500, tax: 1479.5 },
    ];

    for (let i = 0; i < monthlyChecks.length; i++) {
      const check = monthlyChecks[i];
      cases.push({
        name: 'Monthly 2026: ' + check.income,
        actual: calculateAnnualPaye(check.income, EMPLOYEE_PAYE_BANDS_2026, 35),
        expected: check.tax,
      });
      cases.push({
        name: 'Annual 2026: ' + (check.income * 12),
        actual: calculateAnnualPaye(check.income * 12, EMPLOYEE_PAYE_BANDS_2026_ANNUAL, 35),
        expected: Math.round(check.tax * 12 * 100) / 100,
      });
    }

    cases.push({
      name: 'Monthly 588.30 rounds the 5% slice to 0.02',
      actual: calculateAnnualPaye(588.3, EMPLOYEE_PAYE_BANDS_2026, 35),
      expected: 0.02,
    });
    cases.push({
      name: 'Annual 7059.60 rounds the 5% slice to 0.18',
      actual: calculateAnnualPaye(7059.6, EMPLOYEE_PAYE_BANDS_2026_ANNUAL, 35),
      expected: 0.18,
    });

    let passed = 0;
    let failed = 0;
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      const ok = approxEqual(c.actual, c.expected, 0.001);
      if (ok) {
        passed += 1;
      } else {
        failed += 1;
        console.error('[PAYE selftest] FAIL:', c.name, { actual: c.actual, expected: c.expected });
      }
    }

    const note = document.createElement('p');
    note.id = 'paye-selftest';
    note.textContent = failed === 0 ? 'PAYE selftest PASS ' + passed : 'PAYE selftest FAIL ' + failed;
    if (document.body) document.body.appendChild(note);
  }

  if (form) {
    form.addEventListener('submit', handleCalculate);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }

  if (monthlyIncomeInput) {
    monthlyIncomeInput.addEventListener('input', function () {
      const raw = String(this.value).replace(/,/g, '');
      if (raw !== String(this.value)) this.value = raw;
      if (!raw.includes('.')) return;

      const parts = raw.split('.');
      const integerPart = parts[0];
      const fracPart = parts.slice(1).join('');

      const limitedFrac = fracPart.slice(0, 2);
      const next = limitedFrac.length > 0 ? integerPart + '.' + limitedFrac : integerPart + '.';

      if (next !== raw) {
        this.value = next;
      }
    });

    monthlyIncomeInput.addEventListener('blur', function () {
      const raw = String(this.value).replace(/,/g, '').trim();
      if (raw === '') return;
      const num = Number(raw);
      if (!isFinite(num)) return;
      this.value = num.toFixed(2);
    });
  }

  wireClampedIntInput(reliefChildrenCountEl, 0, 3);
  wireClampedIntInput(reliefDependentsCountEl, 0, 2);

  if (breakdownToggleBtn) {
    breakdownToggleBtn.addEventListener('click', toggleBreakdown);
  }

  function applyMode(mode) {
    renderBandsTable(mode);
    updateBasisHint();
    updateIncomeUi(mode);
    updateResultLabels(mode);
    setAnnualMonthlyEquivalentsVisible(mode && mode.basis === 'annual');
    resetBreakdownUi();
  }

  const initialMode = resolvePayeMode();
  applyMode(initialMode);
  runSelfTest();

  function wireModeRadio(radio) {
    if (!radio) return;
    radio.addEventListener('change', function () {
      if (!this.checked) return;
      monthlyIncomeInput.value = '';
      clearIncomeError();
      if (resultsSection) resultsSection.classList.add('is-hidden');
      applyMode(resolvePayeMode());
    });
  }

  wireModeRadio(payeTypeEmployeeMonthlyRadio);
  wireModeRadio(payeTypeEmployeeAnnualRadio);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPayeCalculator);
  } else {
    bootPayeCalculator();
  }
})();
