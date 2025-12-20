<?php
function mh_calculator_shortcode() {
    ob_start();
    ?>
    <form class="wmcForm" id="mortgage_form" data-loantype="stb">
      <div class="wmcHeader">
        <div class="wmcBtnGroup">
          <button class="wmcBtn wmcBtnTlg btnSelected"> Single</button>
          <button class="wmcBtn wmcBtnTlg wmcbtnJoint"> Joint </button>
        </div>
      </div>
      <div class="wmcBody">
        <div class="wmcContainer">
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your Age </label>
                <input type="text" placeholder="35" id="wmcAge">
                <span class="wmcWarning errAge"></span>
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your Salary (€) </label>
                <input type="text" placeholder="€50,000" id="wmcSalary">
              </div>
            </div>
          </div>

          <div class="wmcRow" id="wmcJointElm">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your partner's age </label>
                <input type="number" placeholder="35" id="wmcPartnerAge" maxlength="2" minlength="1">
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your partner's income (€) </label>
                <input type="text" placeholder="€30,000" id="wmcPartnerIncome">
              </div>
            </div>
          </div>

          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Current Property Value (€) </label>
                <input type="text" placeholder="€400,000" id="wmcCurrentValue">
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Current Mortgage Balance (€) </label>
                <input type="text" placeholder="€250,000" id="wmcCurrentMortgage">
              </div>
            </div>
          </div>

          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> New Property Value (€) </label>
                <input type="text" placeholder="€500,000" id="wmcNewPropertyValue">
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Savings Added (€) </label>
                <input type="text" placeholder="€50,000" id="wmcSavingsAdded">
              </div>
            </div>
          </div>

          <div class="wmcRow">
            <div class="wmcCol">
              <button class="wmcBtn" id="wmcBtnCalculate"> Calculate</button>
            </div>
          </div>

          <div id="wmcOutputs">
            <div class="wmcRow">
              <div class="wmcCol">
                <ul class="wmcOutputList">
                  <li> <span> Mortgage Amount </span> <span id="opMortgageAmount"> </span> </li>
                  <li> <span> Loan Term </span> <span id="opLoanTerm"> </span> </li>
                </ul>
                <div class="loanTermRange">
                  <input type="range" id="loanTermRangeSlide" min="5" max="35" value="30">
                </div>
              </div>
            </div>
            <div id="best3wrap">
              <div class="wmcRow"></div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('mh_calculator', 'mh_calculator_shortcode');
