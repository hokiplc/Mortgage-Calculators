(function () {

  jQuery(document).ready(function () {

    var $ = jQuery;

    // Helper Functions
    function formatNumberWithCommas(val) {
      let value = val.toString().replace(/\D/g, '');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return value;
    }

    function convertInt(strn) {
      // const numStr = String(strn).replace(/,/g, '');
      const numStr = String(strn).replace(/[^\d]/g, '');
      const num = parseInt(numStr, 10);
      return isNaN(num) ? 0 : num;
    }

    // DOM Elements
    const btnToggle = jQuery('.wmcBtnTlg');
    const btnJoint = jQuery('.wmcbtnJoint');
    const jointElm = jQuery('#wmcJointElm');

    const age = jQuery('#wmcAge');
    const salary = jQuery('#wmcSalary');
    const partnerAge = jQuery('#wmcPartnerAge');
    const partnerIncome = jQuery('#wmcPartnerIncome');

    const currentValue = jQuery('#wmcCurrentValue');
    const currentMortgage = jQuery('#wmcCurrentMortgage');
    const newPropertyValue = jQuery('#wmcNewPropertyValue');
    const savingsAdded = jQuery('#wmcSavingsAdded');

    const btnCalculate = jQuery('#wmcBtnCalculate');
    const outputs = document.getElementById('wmcOutputs');
    const opMortgageAmount = document.getElementById('opMortgageAmount');
    const loanTerm = document.getElementById('opLoanTerm');
    const loanTermSlide = jQuery('#loanTermRangeSlide');

    outputs.style.display = 'none';
    jointElm.hide();

    // Toggle between Single/Joint
    for (let i = 0; i < btnToggle.length; i++) {
      btnToggle[i].addEventListener('click', function (e) {
        e.preventDefault();
        jQuery('.wmcBtnTlg.btnSelected').removeClass('btnSelected');
        $(this).addClass('btnSelected');
        if (btnJoint.hasClass('btnSelected')) {
          jointElm.slideDown('fast');
        } else {
          jointElm.slideUp('fast');
        }
      }, false);
    }

    // Format numbers as user types
    jQuery('input[type="text"]').on('input', function () {
      jQuery(this).val(formatNumberWithCommas(jQuery(this).val()));
    });

    // Calculate button
    btnCalculate.on('click', function (e) {
      e.preventDefault();

      const ageVal = convertInt(age.val());
      const salaryVal = convertInt(salary.val());
      const partnerIncomeVal = convertInt(partnerIncome.val());

      const currVal = convertInt(currentValue.val());
      const currMortgage = convertInt(currentMortgage.val());
      const newVal = convertInt(newPropertyValue.val());
      const savings = convertInt(savingsAdded.val());

      const totalIncome = salaryVal + partnerIncomeVal;
      let dyloanterm = 35;

      if (!ageVal || !salaryVal || !currVal || !currMortgage || !newVal) {
        alert('Please fill in all required fields.');
        return;
      }

      if (ageVal < 30) {
        dyloanterm = 35;
      } else if (ageVal <= 60) {
        dyloanterm = Math.min(35, 70 - ageVal);
      } else {
        dyloanterm = 5;
      }

      const equity = currVal - currMortgage;
      const mortgageNeeded = newVal - equity - savings;

      opMortgageAmount.textContent = `€${formatNumberWithCommas(mortgageNeeded)}`;
      loanTerm.textContent = `${dyloanterm}`;
      loanTermSlide.val(dyloanterm);
      outputs.style.display = 'block';

      // Calculate best options
      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let monthly_amount = calculateMonthlyPayment(mortgageNeeded, int_rate, dyloanterm);
        $(this).find('.set_monthly_payment span').html(monthly_amount);

        let targetURL = $(this).find('a.target_url_link').attr('data-url');
        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');
        let mortgageAmount = parseFloat($("#wmcCurrentMortgage").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcCurrentValue").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${dyloanterm}&loanType=${loantype}`;
        $(this).find('a.target_url_link').attr('href', seturl);

      });

    });

    // Loan term slider update
    loanTermSlide.on('input', function () {
      const getLoanTerm = this.value;
      loanTerm.textContent = getLoanTerm;

      const mortgageAmountVal = convertInt(opMortgageAmount.textContent);

      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let monthly_amount = calculateMonthlyPayment(mortgageAmountVal, int_rate, getLoanTerm);

        $(this).find('.set_monthly_payment span').html(monthly_amount);


        let targetURL = $(this).find('a.target_url_link').attr('data-url');
        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');
        let mortgageAmount = parseFloat($("#wmcCurrentMortgage").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcCurrentValue").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));


        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }


        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${getLoanTerm}&loanType=${loantype}`;
        $(this).find('a.target_url_link').attr('href', seturl);



      });
    });

    function calculateMonthlyPayment(principal, annualRate, years) {
      const r = annualRate / 100 / 12;
      const n = years * 12;
      const monthlyPayment = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      return monthlyPayment.toFixed(2);
    }

    // Show best 3 rates excluding AIB and EBS
    function showBest3() {
      jQuery.ajax({
      url: mortgageCalcAjax.ajaxUrl,
      type: 'POST',
      data: { action: 'get_mortgage_rates' },
      dataType: 'json',
      success: function(data) {
        let metadata = null;
        let rates = data;

        // Check if data has metadata
        if (Array.isArray(data) && data.length > 0 && data[0]._metadata === 'timestamp') {
          metadata = data[0];
          rates = data.slice(1);
        }

        const sorted = rates.map(m => ({
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

        const sortedByRate = sorted.sort((a, b) => a.numericRate - b.numericRate);

        const seen = new Set();
        const unique = sortedByRate.filter(m => {
          if (!seen.has(m.lenderName)) {
            seen.add(m.lenderName);
            return true;
          }
          return false;
        });

        const top3 = unique.slice(0, 3);
        const wrap = document.querySelector('#best3wrap .wmcRow');
        if (!wrap) {
          console.error('MH Calculator: #best3wrap .wmcRow not found');
          return;
        }

        top3.forEach(m => {
          const rateValue = m.rateValue;
          wrap.insertAdjacentHTML('beforeend',
            `<div class="wmcCol">
              <div class="boItem">
                <div class="boItemImg">
                  <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.lenderName}.webp" alt="">
                </div>
                <ul class="boItemtxt">
                  <li class="set_monthly_payment">€<span></span> Monthly</li>
                  <li class="set_int_rate"> <span>${parseFloat(rateValue).toFixed(2)}</span>% Interest Rate </li>
                </ul>
                <div class="boIFooter">
                  <a target="_blunk" href="https://whichmortgage.ie/start-an-application-2/" data-url="https://whichmortgage.ie/start-an-application-2/" class="wmcBtn btnGit target_url_link">
                    Get in touch
                  </a>
                </div>
              </div>
            </div>`);
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
        } else {
          console.error('MH Calculator: #best3wrap not found for footer');
        }
      },
      error: function(xhr, status, error) {
        console.error('MH Calculator: Failed to fetch rates:', error, xhr);
      }
    });
    }

    showBest3();

  });

})();
