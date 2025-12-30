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

  jQuery.getJSON(`${document.location.origin}/wp-content/plugins/mortgage-calculator/js/bestrate360.json`, function (data) {
    const sortedByRate = data.map(m => ({
      ...m,
      numericRate: parseFloat(m.ratePercent)
    })).filter(m => m.lender !== "AIB" && m.lender !== "EBS");

    const sorted = sortedByRate.sort((a, b) => a.numericRate - b.numericRate);

    const seenRates = new Set();
    const removeRepetition = sorted.filter(item => {
      if (!seenRates.has(item.lender)) {
        seenRates.add(item.lender);
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
              <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.lender}.webp" alt="">
            </div>
            <ul class="boItemtxt">
              <li class="set_monthly_payment">€<span>${monthly.toFixed(0)}</span> Monthly</li>
              <li class="set_int_rate"> <span>${m.ratePercent.toFixed(2)}</span>% Interest Rate </li>
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
  });
}

// Expose globally
window.showBest3 = showBest3;
