jQuery(document).ready(function($) {
    // Cache DOM elements
    var $singleBtn = $(".btnSelected");
    var $jointBtn = $(".wmcbtnJoint");
    var $jointElm = $("#wmcJointElm");
    var $calcBtn = $("#wmcBtnCalculate");
    var $mortBal = $("#wmcMortgageBalance");
    var $impCost = $("#wmcImprovementCost");
    var $mortReq = $("#wmcMortgageAmount");
    var $salary = $("#wmcSalary");
    var $age = $("#wmcAge");
    var $errAge = $(".errAge");
    var $opMortgage = $("#opMortgageAmount");
    var $opTerm = $("#opLoanTerm");
    var $termSlider = $("#loanTermRangeSlide");
    var $wmcOutputs = $("#wmcOutputs");

    var actionURL = (typeof mortgageCalcAjax !== 'undefined' && mortgageCalcAjax.getInTouchUrl)
      ? mortgageCalcAjax.getInTouchUrl
      : 'https://whichmortgage.ie/start-an-application-2/';

    /**
     * Validate form fields
     * @return {boolean} True if validation passes
     */
    function validateFields() {
        var isValid = true;
        var ageVal = parseInt($age.val());
        var salaryVal = parseFloat($salary.val().replace(/[^\d.]/g, ''));
        
        $errAge.hide();

        if (isNaN(ageVal) || ageVal < 18 || ageVal > 70) {
            $errAge.css("display", "inline-block").text("Please enter a valid age (18-70)");
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


    function convertInt(strn) {
      // const numStr = String(strn).replace(/,/g, '');
      const numStr = String(strn).replace(/[^\d]/g, '');
      const num = parseInt(numStr, 10);
      return isNaN(num) ? 0 : num;
    }



    /**
     * Calculate and update mortgage required amount
     * @return {number} Total mortgage amount
     */
    function updateMortgageRequired() {
        var balance = parseFloat($mortBal.val().replace(/[^\d.]/g, '')) || 0;
        var improve = parseFloat($impCost.val().replace(/[^\d.]/g, '')) || 0;
        var total = balance + improve;
        
        $mortReq.val('€' + total.toLocaleString());
        return total;
    }

    // Initialize mortgage balance and improvement cost events
    if ($mortBal.length && $impCost.length) {
        $mortBal.on("blur", updateMortgageRequired);
        $impCost.on("blur", updateMortgageRequired);
    }

    // Handle single/joint application toggle
    if ($singleBtn.length && $jointBtn.length && $jointElm.length) {
        $jointElm.hide();
        
        $singleBtn.on("click", function(e) {
            e.preventDefault();
            $jointElm.hide();
            $singleBtn.addClass("btnSelected");
            $jointBtn.removeClass("btnSelected");
        });
        
        $jointBtn.on("click", function(e) {
            e.preventDefault();
            $jointElm.css("display", "flex");
            $jointBtn.addClass("btnSelected");
            $singleBtn.removeClass("btnSelected");
        });
    }

    // Update term display when slider changes
    if ($termSlider.length) {
        $termSlider.on("input", function() {
            $opTerm.text(this.value + " yrs");

            const mortgageAmountVal = convertInt(opMortgageAmount.textContent);


            $('#best3wrap .wmcRow').children().each(function () {
                let int_rate = parseFloat($(this).find('.set_int_rate span').text());
                let getLoanTerm = $termSlider.val();
                let monthly_amount = calculateMonthlyPayment(mortgageAmountVal, int_rate, getLoanTerm);

                $(this).find('.set_monthly_payment span').html(monthly_amount.toFixed(2));

                let loantype=document.querySelector("#mortgage_form").getAttribute('data-loantype');
                let mortgageAmount=parseFloat($("#wmcMortgageBalance").val().replace(/,/g, ''));
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

    // Handle calculate button click
    $calcBtn.on("click", function(e) {
        e.preventDefault();

        if (!validateFields()) {
            return;
        }

        var ageVal = parseInt($age.val());
        var newMortgage = updateMortgageRequired();

        // Calculate loan term based on age
        var dyloanterm = 35;
        if (ageVal < 30) {
            dyloanterm = 35;
        } else if (ageVal <= 60) {
            dyloanterm = Math.min(35, 70 - ageVal);
        } else {
            dyloanterm = 5;
        }

        $opMortgage.text('€' + newMortgage.toLocaleString());
        $opTerm.text(dyloanterm + " yrs");
        $termSlider.val(dyloanterm);
        $wmcOutputs.show();



        


        // Trigger Best 3 Rates if function exists
        setTimeout(function() {
            if (typeof showBest3 === "function") {
                showBest3();
                setTimeout(function() {
                    $('#best3wrap .wmcRow').children().each(function () {

                        let loantype=document.querySelector("#mortgage_form").getAttribute('data-loantype');

                        let mortgageAmount=parseFloat($("#wmcMortgageBalance").val().replace(/,/g, ''));
                        let propertyValue=parseFloat($("#wmcPropertyValue").val().replace(/,/g, '')); 
                        let formType=$(".wmcBtnTlg.btnSelected").html();
                        let grossSalary=parseFloat($("#wmcSalary").val().replace(/,/g, ''));
                        if(formType.toLowerCase().trim()=='joint'){
                            grossSalary +=parseFloat($("#wmcPartnerIncome").val().replace(/,/g, ''));
                        }
                        let seturl=`${actionURL}?income=${grossSalary}&loanValue=${mortgageAmount}&propertyValue=${propertyValue}&term=${dyloanterm}&loanType=${loantype}`;
                        $(this).find('a.target_url_link').attr('href',seturl);

                    });
                }, 50);
            }
        }, 100);

        // Get target URL if exists
        var targetURL = $(this).find('a.target_url_link').data('url');
        if (targetURL) {
            console.log('url: ' + targetURL);
        }
    });
});