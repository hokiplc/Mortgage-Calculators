function calculateMonthlyPayment(principal, rate, termYears) {
  const monthlyRate = rate / 100 / 12;
  const numPayments = termYears * 12;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
}

function showBest3() {
  if (typeof jQuery === "undefined") {
    console.error("jQuery not loaded. Cannot run showBest3.");
    return;
  }

  jQuery.ajax({
    url: mortgageCalcAjax.ajaxUrl,
    type: 'POST',
    data: {
      action: 'get_mortgage_rates'
    },
    dataType: 'json',
    success: function(data) {
    let metadata = null;
    let rates = data;

    // Check if data has metadata
    if (Array.isArray(data) && data.length > 0 && data[0]._metadata === 'timestamp') {
      metadata = data[0];
      rates = data.slice(1);
    }

    const sortedByRate = rates.map(m => ({
      ...m,
      lenderName: m.lender || m.Company,
      rateValue: parseFloat(m.ratePercent || m.Rate || m.rate || 0),
      numericRate: parseFloat(m.ratePercent || m.Rate || m.rate || 0)
    })).filter(m =>
      m.lenderName !== "AIB" &&
      m.lenderName !== "EBS" &&
      !isNaN(m.numericRate) &&
      m.numericRate > 0
    );

    const sorted = sortedByRate.sort((a, b) => a.numericRate - b.numericRate);

    const seenRates = new Set();
    const removeRepetition = sorted.filter(item => {
      if (!seenRates.has(item.lenderName)) {
        seenRates.add(item.lenderName);
        return true;
      }
      return false;
    });

    const top3 = removeRepetition.slice(0, 3);
    const parnt = document.querySelector('#best3wrap .wmcRow');
    if (!parnt) return;

    parnt.innerHTML = "";

    const principal = parseFloat(document.getElementById("wmcMortgageAmount")?.value.replace(/[^\d.]/g, '')) || 0;
    const term = parseInt(document.getElementById("loanTermRangeSlide")?.value) || 30;

    const getInTouchUrl = mortgageCalcAjax.getInTouchUrl || 'https://whichmortgage.ie/start-an-application-2/';

    top3.forEach((m) => {
      const monthly = calculateMonthlyPayment(principal, m.numericRate, term);
      const rateValue = m.rateValue;
      parnt.insertAdjacentHTML('beforeend',
        `<div class="wmcCol">
          <div class="boItem">
            <div class="boItemImg">
              <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.lenderName}.webp" alt="">
            </div>
            <ul class="boItemtxt">
              <li class="set_monthly_payment">€<span>${monthly.toFixed(0)}</span> Monthly</li>
              <li class="set_int_rate"> <span>${parseFloat(rateValue).toFixed(2)}</span>% Interest Rate </li>
            </ul>
            <div class="boIFooter">
              <a target="_blank" href="${getInTouchUrl}" data-url="${getInTouchUrl}" class="wmcBtn btnGit target_url_link">
                Get in touch
              </a>
            </div>
          </div>
        </div>`
      );
    });

    // Add footer with timestamp and link
    const footer = document.createElement('div');
    footer.className = 'wmcTableFooter';
    footer.style.cssText = 'text-align: center; padding: 15px 10px; font-size: 12px; color: #666; border-top: 1px solid #e0e0e0; margin-top: 20px;';

    let footerContent = '';
    if (metadata && metadata.last_updated) {
      const updateDate = new Date(metadata.last_updated);
      const formattedDate = updateDate.toLocaleDateString('en-IE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      footerContent += `<p>Rates last updated: ${formattedDate}</p>`;
    }
    footerContent += '<p>Powered by <a href="https://broker360.ai/plugins" target="_blank" rel="noopener">Broker 360 Plugins</a></p>';

    footer.innerHTML = footerContent;
    const best3wrap = document.querySelector('#best3wrap');
    if (best3wrap) {
      best3wrap.appendChild(footer);
    }
    },
    error: function(xhr, status, error) {
      console.error('Failed to fetch mortgage rates:', error);
    }
  });
}

// Expose globally
window.showBest3 = showBest3;
