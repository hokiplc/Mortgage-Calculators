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

  jQuery.getJSON(`${document.location.origin}/wp-content/plugins/mortgage-calculator/js/bestrate.cleaned.json`, function (data) {
    let metadata = null;
    let rates = data;

    // Check if data has metadata
    if (Array.isArray(data) && data.length > 0 && data[0]._metadata === 'timestamp') {
      metadata = data[0];
      rates = data.slice(1);
    }

    const sortedByRate = rates.map(m => ({
      ...m,
      numericRate: parseFloat(m.Rate)
    })).filter(m => m.Company !== "AIB" && m.Company !== "EBS");

    const sorted = sortedByRate.sort((a, b) => a.numericRate - b.numericRate);

    const seenRates = new Set();
    const removeRepetition = sorted.filter(item => {
      if (!seenRates.has(item.Company)) {
        seenRates.add(item.Company);
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

    top3.forEach((m) => {
      const monthly = calculateMonthlyPayment(principal, m.numericRate, term);
      parnt.insertAdjacentHTML('beforeend',
        `<div class="wmcCol">
          <div class="boItem">
            <div class="boItemImg">
              <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.Company}.webp" alt="">
            </div>
            <ul class="boItemtxt">
              <li class="set_monthly_payment">€<span>${monthly.toFixed(0)}</span> Monthly</li>
              <li class="set_int_rate"> <span>${m.Rate}</span>% Interest Rate </li>
            </ul>
            <div class="boIFooter">
              <a target="_blank" href="https://whichmortgage.ie/start-an-application-2/" data-url="https://whichmortgage.ie/start-an-application-2/" class="wmcBtn btnGit target_url_link">
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
      footerContent = `Rates last updated: ${formattedDate} | `;
    }
    footerContent += '<a href="https://broker360.ie/plugins/" target="_blank" style="color: #0066cc; text-decoration: none;">Powered by Broker360 Plugins</a>';

    footer.innerHTML = footerContent;
    document.querySelector('#best3wrap').appendChild(footer);
  });
}

// Expose globally
window.showBest3 = showBest3;
