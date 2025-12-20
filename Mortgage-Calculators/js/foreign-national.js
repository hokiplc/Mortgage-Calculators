jQuery(document).ready(function ($) {
  // Cache DOM elements
  var $singleBtn = $(".btnSelected");
  var $jointBtn = $(".wmcbtnJoint");
  var $jointElm = $("#wmcJointElm");
  var $calcBtn = $("#wmcBtnCalculate");
  var $salary = $("#wmcSalary");
  var $age = $("#wmcAge");
  var $errAge = $(".errAge");
  var $mortgageAmount = $("#wmcMortgageAmount");
  var $opMortgage = $("#opMortgageAmount");
  var $opTerm = $("#opLoanTerm");
  var $termSlider = $("#loanTermRangeSlide");
  var $wmcOutputs = $("#wmcOutputs");


  var actionURL='https://whichmortgage.ie/start-an-application-2/';


  function convertInt(strn) {
    // const numStr = String(strn).replace(/,/g, '');
    const numStr = String(strn).replace(/[^\d]/g, '');
    const num = parseInt(numStr, 10);
    return isNaN(num) ? 0 : num;
  }

  // Hide joint by default
  $wmcOutputs.hide();
  if ($jointElm.length) {
    $jointElm.hide();
  }

  // Toggle buttons
  if ($singleBtn.length && $jointBtn.length) {
    $singleBtn.on("click", function (e) {
      e.preventDefault();
      $jointElm.hide();
      $singleBtn.addClass("btnSelected");
      $jointBtn.removeClass("btnSelected");
    });

    $jointBtn.on("click", function (e) {
      e.preventDefault();
      $jointElm.css("display", "flex");
      $jointBtn.addClass("btnSelected");
      $singleBtn.removeClass("btnSelected");
    });
  }

  // Update loan term label
  if ($termSlider.length) {
    $termSlider.on("input", function () {
      $opTerm.text($(this).val() + " yrs");


      const mortgageAmountVal = convertInt(opMortgageAmount.textContent);


      $('#best3wrap .wmcRow').children().each(function () {
          let int_rate = parseFloat($(this).find('.set_int_rate span').text());
          let getLoanTerm = $termSlider.val();
          let monthly_amount = calculateMonthlyPayment(mortgageAmountVal, int_rate, getLoanTerm);

          $(this).find('.set_monthly_payment span').html(monthly_amount.toFixed(2));

          let loantype=document.querySelector("#mortgage_form").getAttribute('data-loantype');
          let mortgageAmount=parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
          let propertyValue=parseFloat($("#wmcPropertyValue").val().replace(/,/g, '')); 
          let formType=$(".wmcBtnTlg.btnSelected").html();
          let grossSalary=parseFloat($("#wmcSalary").val().replace(/,/g, ''));                
          
          if(formType.toLowerCase().trim()=='joint'){
              grossSalary +=parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
          }                

          let seturl=`${actionURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${getLoanTerm}&loanType=${loantype}`;
          $(this).find('a.target_url_link').attr('href',seturl);



      });



    });
  }

  /**
   * Validate form inputs
   * @return {boolean} True if validation passes
   */
  function validateInputs() {
    var isValid = true;
    $errAge.hide();

    var ageVal = parseInt($age.val());
    var salaryVal = parseFloat($salary.val().replace(/[^\d.]/g, ''));

    if (isNaN(ageVal) || ageVal < 18 || ageVal > 70) {
      $errAge.css("display", "inline-block").text("Please enter a valid age (18–70)");
      isValid = false;
    }

    if (isNaN(salaryVal) || salaryVal <= 0) {
      $salary.addClass("inputError");
      isValid = false;
    } else {
      $salary.removeClass("inputError");
    }

    return isValid;
  }

  // Calculate and show results
  $calcBtn.on("click", function (e) {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    var loan = parseFloat($mortgageAmount.val().replace(/[^\d.]/g, '')) || 0;
    $opMortgage.text("€" + loan.toLocaleString());
    $opTerm.text($termSlider.val() + " yrs");
    $wmcOutputs.show();

    setTimeout(function () {
      if (typeof showBest3 === "function") {
        showBest3();
          setTimeout(function() {
            $('#best3wrap .wmcRow').children().each(function () {
                let getLoanTerm = $termSlider.val();
                let loantype=document.querySelector("#mortgage_form").getAttribute('data-loantype');

                let mortgageAmount=parseFloat($("#wmcMortgageAmount").val().replace(/,/g, ''));
                let propertyValue=parseFloat($("#wmcPropertyValue").val().replace(/,/g, '')); 
                let formType=$(".wmcBtnTlg.btnSelected").html();
                let grossSalary=parseFloat($("#wmcSalary").val().replace(/,/g, ''));
                if(formType.toLowerCase().trim()=='joint'){
                    grossSalary +=parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
                }
                let seturl=`${actionURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${getLoanTerm}&loanType=${loantype}`;
                $(this).find('a.target_url_link').attr('href',seturl);

            });
        }, 50);
      }
    }, 100);
  });
});