(function () {
  jQuery(document).ready(function () {

    const $ = jQuery;

    function formatNumberWithCommas(val) {
      let value = val.toString().replace(/\D/g, '');
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function convertInt(strn) {
      // const num = parseInt(String(strn).replace(/,/g, ''), 10);
      const num = parseInt(String(strn).replace(/[^\d]/g, ''), 10);
      return isNaN(num) ? 0 : num;
    }

    const btnToggle = $('.wmcBtnTlg');
    const btnJoint = $('.wmcbtnJoint');
    const jointElm = $('#wmcJointElm');

    const age = $('#wmcAge');
    const errAge = $('.errAge');
    const salary = $('#wmcSalary');
    const partnerIncome = $('#wmcPartnerIncome');
    const currentMortgage = $('#wmcCurrentMortgage');
    const remainingTerm = $('#wmcRemainingTerm');

    const btnCalculate = $('#wmcBtnCalculate');
    const outputs = $('#wmcOutputs');
    const opMortgageAmount = $('#opMortgageAmount');
    const opLoanTerm = $('#opLoanTerm');
    const loanTermSlide = $('#loanTermRangeSlide');

    outputs.hide();
    jointElm.hide();

    btnToggle.each(function () {
      $(this).on('click', function (e) {
        e.preventDefault();
        btnToggle.removeClass('btnSelected');
        $(this).addClass('btnSelected');
        jointElm.slideToggle(btnJoint.hasClass('btnSelected'));
      });
    });

    $('input[type="text"]').on('input', function () {
      $(this).val(formatNumberWithCommas($(this).val()));
    });

    // validating  age 
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

    btnCalculate.on('click', function (e) {
      e.preventDefault();

      const ageVal = convertInt(age.val());
      const termVal = convertInt(remainingTerm.val());
      const mortgageVal = convertInt(currentMortgage.val());

      let isValid = true;
      if (ageVal == "") {
        age.css({ "border-color": 'red' });
        isValid = false;
      }
      if (!isValid) return;

      opMortgageAmount.text(`€${formatNumberWithCommas(mortgageVal)}`);
      opLoanTerm.text(termVal);
      loanTermSlide.val(termVal);
      outputs.show();

      $('#best3wrap .wmcRow').children().each(function () {
        const int_rate = parseFloat($(this).find('.set_int_rate span').text());
        const monthly = calculateMonthlyPayment(mortgageVal, int_rate, termVal);

        let targetURL = $(this).find('a.target_url_link').attr('data-url');

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        let mortgageAmount = parseFloat($("#wmcCurrentMortgage").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcCurrentValue").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${termVal}&loanType=${loantype}`;


        $(this).find('.set_monthly_payment span').html(monthly);


        $(this).find('a.target_url_link').attr('href', seturl);

      });
    });

    loanTermSlide.on('input', function () {
      const newTerm = parseInt(this.value);
      opLoanTerm.text(newTerm);
      const mortgageVal = convertInt(opMortgageAmount.text());

      $('#best3wrap .wmcRow').children().each(function () {
        const int_rate = parseFloat($(this).find('.set_int_rate span').text());
        const monthly = calculateMonthlyPayment(mortgageVal, int_rate, newTerm);
        $(this).find('.set_monthly_payment span').html(monthly);


        let targetURL = $(this).find('a.target_url_link').attr('data-url');

        let loantype = document.querySelector("#mortgage_form").getAttribute('data-loantype');

        let mortgageAmount = parseFloat($("#wmcCurrentMortgage").val().replace(/,/g, ''));
        let propertyValue = parseFloat($("#wmcCurrentValue").val().replace(/,/g, ''));
        let formType = $(".wmcBtnTlg.btnSelected").html();
        let grossSalary = parseFloat($("#wmcSalary").val().replace(/,/g, ''));
        if (formType.toLowerCase().trim() == 'joint') {
          grossSalary += parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
        }
        let seturl = `${targetURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${newTerm}&loanType=${loantype}`;
        $(this).find('a.target_url_link').attr('href', seturl);


      });
    });

    function calculateMonthlyPayment(principal, annualRate, years) {
      const r = annualRate / 100 / 12;
      const n = years * 12;
      return (principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)).toFixed(2);
    }

    function showBest3() {
      $.getJSON(`${document.location.origin}/wp-content/plugins/mortgage-calculator/js/bestrate.json`, function (data) {
        const filtered = data.map(m => ({
          ...m,
          numericRate: parseFloat(m.Rate)
        })).filter(m => m.Company !== "AIB" && m.Company !== "EBS");

        const seen = new Set();
        const unique = filtered.filter(m => {
          if (!seen.has(m.Company)) {
            seen.add(m.Company);
            return true;
          }
          return false;
        }).sort((a, b) => a.numericRate - b.numericRate);

        const top3 = unique.slice(0, 3);
        const wrap = document.querySelector('#best3wrap .wmcRow');
        top3.forEach(m => {
          wrap.insertAdjacentHTML('beforeend', `
            <div class="wmcCol">
              <div class="boItem">
                <div class="boItemImg">
                  <img src="${document.location.origin}/wp-content/plugins/mortgage-calculator/images/${m.Company}.webp" alt="">
                </div>
                <ul class="boItemtxt">
                  <li class="set_monthly_payment">€<span></span> Monthly</li>
                  <li class="set_int_rate"><span>${m.Rate}</span>% Interest Rate</li>
                </ul>
                <div class="boIFooter">
                  <a target="_blunk" href="https://whichmortgage.ie/start-an-application-2/"  data-url="https://whichmortgage.ie/start-an-application-2/" class="wmcBtn btnGit target_url_link">
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
