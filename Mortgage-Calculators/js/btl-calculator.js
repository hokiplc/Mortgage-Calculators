(function () {
  jQuery(document).ready(function () {

    var $ = jQuery;

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

    const btnToggle = jQuery('.wmcBtnTlg');
    const btnJoint = jQuery('.wmcbtnJoint');
    const jointElm = jQuery('#wmcJointElm');

    const age = jQuery('#wmcAge');
    const salary = jQuery('#wmcSalary');
    const partnerAge = jQuery('#wmcPartnerAge');
    const partnerIncome = jQuery('#wmcPartnerIncome');
    const mortgageAmount = jQuery('#wmcMortgageAmount');

    const btnCalculate = jQuery('#wmcBtnCalculate');
    const outputs = document.getElementById('wmcOutputs');
    const opMortgageAmount = document.getElementById('opMortgageAmount');
    const loanTerm = document.getElementById('opLoanTerm');
    const loanTermSlide = jQuery('#loanTermRangeSlide');

    outputs.style.display = 'none';
    jointElm.hide();

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

    jQuery('input[type="text"]').on('input', function () {
      jQuery(this).val(formatNumberWithCommas(jQuery(this).val()));
    });

    btnCalculate.on('click', function (e) {
      e.preventDefault();

      const ageVal = convertInt(age.val());
      const mortgageVal = convertInt(mortgageAmount.val());

      let dyloanterm = 35;

      if (!ageVal || !mortgageVal) {
        alert('Please enter your age and mortgage amount.');
        return;
      }

      if (ageVal < 30) {
        dyloanterm = 35;
      } else if (ageVal <= 60) {
        dyloanterm = 70 - ageVal;
      } else {
        dyloanterm = 5;
      }

      opMortgageAmount.textContent = `€${formatNumberWithCommas(mortgageVal)}`;
      loanTerm.textContent = `${dyloanterm}`;
      loanTermSlide.val(dyloanterm);
      outputs.style.display = 'block';

      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let monthly_amount = calculateMonthlyPayment(mortgageVal, int_rate, dyloanterm);
        $(this).find('.set_monthly_payment span').html(monthly_amount);


        let targetURL = $(this).find('a.target_url_link').attr('data-url');

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        let mortgageAmount = parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcPropertyValue").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${dyloanterm}&loanType=${loantype}`;
        $(this).find('a.target_url_link').attr('href', seturl);

      });
    });

    loanTermSlide.on('input', function () {
      const getLoanTerm = this.value;
      loanTerm.textContent = getLoanTerm;

      const mortgageVal = convertInt(opMortgageAmount.textContent);

      $('#best3wrap .wmcRow').children().each(function () {
        let int_rate = parseFloat($(this).find('.set_int_rate span').text());
        let monthly_amount = calculateMonthlyPayment(mortgageVal, int_rate, getLoanTerm);
        $(this).find('.set_monthly_payment span').html(monthly_amount);


        let targetURL = $(this).find('a.target_url_link').attr('data-url');

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        let mortgageAmount = parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcPropertyValue").val().replace(/,/g, ''));
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

    function showBest3() {
      $.getJSON(`${document.location.origin}/wp-content/plugins/mortgage-calculator/js/bestrate.json`, function (data) {
        const filtered = data.map(m => ({
          ...m,
          numericRate: parseFloat(m.Rate)
        })).filter(m =>
            (m.Company === "PTSB" || m.Company === "ICS") &&
            typeof m.NOTES === 'string' &&
            /btl/i.test(m.NOTES) &&
            Number.isFinite(m.numericRate)
    );


        const sorted = filtered.sort((a, b) => a.numericRate - b.numericRate);

        const seen = new Set();
        const unique = sorted.filter(m => {
          if (!seen.has(m.Company)) {
            seen.add(m.Company);
            return true;
          }
          return false;
        });

        const top3 = unique.slice(0, 3);
        top3.forEach(m => {
          const wrap = document.querySelector('#best3wrap .wmcRow');
          wrap.insertAdjacentHTML('beforeend',
            `<div class="wmcCol">
              <div class="boItem">
                <div class="boItemImg">
                  <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.Company}.webp" alt="">
                </div>
                <ul class="boItemtxt">
                  <li class="set_monthly_payment">€<span></span> Monthly</li>
                  <li class="set_int_rate"> <span>${m.Rate}</span>% Interest Rate </li>
                </ul>
                <div class="boIFooter">
                  <a target="_blunk" href="https://whichmortgage.ie/start-an-application-2/" data-url="https://whichmortgage.ie/start-an-application-2/" class="wmcBtn btnGit target_url_link">
                    Get in touch
                  </a>
                </div>
              </div>
            </div>`);
        });
      });
    }

    showBest3();

  });
})();
