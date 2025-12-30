(function () {

  jQuery(document).ready(function () {

    var $ = jQuery;

    function formatNumberWithCommas(val) {
      let value = val.toString().replace(/\D/g, '');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return value;
    }

    function convertInt(strn) {
      const numStr = String(strn).replace(/,/g, '');
      const num = parseInt(numStr, 10);
      return isNaN(num) ? strn : num;
    }

    const buttonToggle = jQuery('.wmcBtnTlg');
    const btnJoint = jQuery('.wmcbtnJoint');
    const jointElm = jQuery('#wmcJointElm');
    const ltRangeWrap = jQuery('.loanTermRange');
    const loanTermSlide = jQuery('#loanTermRangeSlide');

    const age = jQuery('#wmcAge');
    const salary = jQuery('#wmcSalary');
    const partnerAge = jQuery('#wmcPartnerAge');
    const partnerIncome = jQuery('#wmcPartnerIncome');
    const mortgageAmount = jQuery('#wmcMortgageAmount');
    const deposit = jQuery('#wmcDeposit');
    const maxPropertyPice = jQuery('#wmcMaxPropertyPice');

    const btnCalculate = jQuery('#wmcBtnCalculate');

    const fbMortgageAmount = jQuery('.fbMortgageAmount');
    const errSalary = jQuery('.errSalary');
    const errAge = jQuery('.errAge');

    const outputs = document.getElementById('wmcOutputs');
    const opMortgageAmount = document.getElementById('opMortgageAmount');
    const loanTerm = document.getElementById('opLoanTerm');

    outputs.style.display = 'none';
    jointElm.hide();
    errSalary.hide();
    fbMortgageAmount.hide();

    for (var i = 0; i < buttonToggle.length; i++) {
      buttonToggle[i].addEventListener('click', btnToggle, false);
    }

    function btnToggle(e) {
      e.preventDefault();
      jQuery('.wmcBtnTlg.btnSelected').removeClass('btnSelected');
      $(this).addClass('btnSelected');
      if (btnJoint.hasClass('btnSelected')) {
        jointElm.slideDown('fast');
      } else {
        jointElm.slideUp('fast');
      }
    }

    const inputs = jQuery('input[type="text"]');
    inputs.on('input', function () {
      jQuery(this).val(formatNumberWithCommas(jQuery(this).val()));
    });

    jQuery('#wmcSalary, #wmcPartnerIncome, #wmcDeposit').on('input', function () {
      updateInputsBasedOnSalary();
    });

    function updateInputsBasedOnSalary() {
      errSalary.fadeOut('fast');
      const valSalary = convertInt(salary.val()) || 0;
      const valPartnerIncome = convertInt(partnerIncome.val()) || 0;
      const totalIncome = valSalary + valPartnerIncome;

      const mortgageVal = totalIncome * 4;
      mortgageAmount.val(formatNumberWithCommas(mortgageVal));

      const depositVal = convertInt(deposit.val()) || 0;
      const propertyPrice = mortgageVal + depositVal;
      maxPropertyPice.val(formatNumberWithCommas(propertyPrice));
    }

    $(age).on('input', function () {
      const max_chars = 2;
      const $element = $(this);
      $element.css('borderColor', '#ccc');

      if ($element.val().length > max_chars) {
        $(errAge).text("Age limit 18 - 70 years.").show();
        $element.val($element.val().substr(0, max_chars));
      } else {
        $(errAge).hide();
      }
    });

    btnCalculate.on('click', calculateMortgage);

    let dyloanterm = 35;

    function calculateMortgage(event) {
      event ? event.preventDefault() : '';

      const mortgageAmountVal = convertInt(mortgageAmount.val());
      const ageVal = convertInt(age.val());
      const salaryVal = convertInt(salary.val());

      let isValid = true;

      if (ageVal == "") {
        age.css({ "border-color": 'red' });
        isValid = false;
      }

      if (salaryVal == "") {
        errSalary.fadeIn('fast');
        isValid = false;
      }

      if (!isValid) return;

      if (ageVal < 30) {
        dyloanterm = 35;
      } else if (ageVal <= 60) {
        dyloanterm = Math.min(35, 70 - ageVal);
      } else {
        dyloanterm = 5;
      }

      opMortgageAmount.textContent = `€${formatNumberWithCommas(parseInt(mortgageAmountVal))}`;
      loanTerm.textContent = `${parseInt(dyloanterm)}`;
      loanTermSlide.val(dyloanterm);
      outputs.style.display = 'block';

      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let monthly_amount = calculateMonthlyPayment(mortgageAmountVal, int_rate, dyloanterm);
        let targetURL = $(this).find('a.target_url_link').attr('data-url');

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        // console.log(loantype);

        let mortgageAmount = parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcMaxPropertyPice").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${dyloanterm}&loanType=${loantype}`;
        $(this).find('.set_monthly_payment span').html(monthly_amount);
        $(this).find('a.target_url_link').attr('href', seturl);

      });
    }

    loanTermSlide.on('input', function () {
      const getLoanTerm = this.value;
      loanTerm.textContent = getLoanTerm;

      const mortgageAmountVal = convertInt(mortgageAmount.val());

      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let dlTerm = parseInt($("ul.wmcOutputList li #opLoanTerm").text());

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        let targetURL = $(this).find('a.target_url_link').attr('data-url');
        let mortgageAmount = parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcMaxPropertyPice").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${dlTerm}&loanType=${loantype}`;

        let monthly_amount = calculateMonthlyPayment(mortgageAmountVal, int_rate, dlTerm);
        $(this).find('.set_monthly_payment span').html(monthly_amount);
        $(this).find('a.target_url_link').attr('href', seturl);

      });
    });

    function calculateMonthlyPayment(principal, annualRate, years) {
      const r = annualRate / 100 / 12;
      const n = years * 12;
      const monthlyPayment = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      return monthlyPayment.toFixed(2);
    }

    function showBest3() {
      $.ajax({
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

        const sortedByRate = rates.map(m => ({
          ...m,
          numericRate: parseFloat(m.ratePercent || m.rate || 0)
        }))
        .filter(m =>
          m.lender !== "AIB" &&
          m.lender !== "EBS" &&
          !isNaN(m.numericRate) &&
          m.numericRate > 0
        )
        .sort((a, b) => a.numericRate - b.numericRate);

        const seenRates = new Set();
        const removeRepetition = sortedByRate.filter((item) => {
          if (!seenRates.has(item.lender)) {
            seenRates.add(item.lender);
            return true;
          }
          return false;
        });

        const top3 = removeRepetition.slice(0, 3);
        const parnt = document.querySelector('#best3wrap .wmcRow');
        if (!parnt) {
          console.error('Mortgage Calculator: #best3wrap .wmcRow not found');
          return;
        }

        top3.forEach((m, index) => {
          const rateValue = m.ratePercent || m.rate || 0;
          parnt.insertAdjacentHTML('beforeend',
            `<div class="wmcCol">
              <div class="boItem">
                <div class="boItemImg">
                  <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.lender}.webp" alt="">
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
        const best3wrap = document.querySelector('#best3wrap');
        if (best3wrap) {
          best3wrap.appendChild(footer);
        } else {
          console.error('Mortgage Calculator: #best3wrap not found for footer');
        }
      },
      error: function(xhr, status, error) {
        console.error('Mortgage Calculator: Failed to fetch rates:', error, xhr);
      }
    });
    }
    /*
    <a target="_blunk" href="https://whichmortgage.ie/start-an-application-2/" class="wmcBtn btnGit">
                          Get in touch
                      </a>
    */
    showBest3();

  });

})();
