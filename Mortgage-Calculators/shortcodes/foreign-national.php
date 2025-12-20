<?php
// Shortcode function for Foreign National calculator
function fn_calculator_shortcode() {
    ob_start();
    ?>

    <form class="wmcForm" id="mortgage_form" data-loantype="ftb">
      <div class="wmcHeader">
        <div class="wmcBtnGroup">
          <button class="wmcBtn wmcBtnTlg btnSelected"> Single</button>
          <button class="wmcBtn wmcBtnTlg wmcbtnJoint"> Joint </button>
        </div>
      </div>
      <div class="wmcBody">
        <div class="wmcContainer">

          <!-- Row 1: Your Age + Your Salary -->
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your Age </label>
                <input type="text" placeholder="35" id="wmcAge">
                <span class="wmcWarning errAge"></span>
              </div>
              <div class="wmcInput">
                <label for=""> Visa Type </label>
                <select id="wmcVisaType" class="wmcSelect">
                  <option value="">Select</option>
                  <option value="STAMP 1">STAMP 1</option>
                  <option value="STAMP 1G">STAMP 1G</option>
                  <option value="STAMP 4">STAMP 4</option>
                  <option value="EU/EEA">EU/EEA</option>
                </select>
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your Salary (€) </label>
                <input type="text" placeholder="€50,000" id="wmcSalary">
              </div>
            </div>
          </div>

          <!-- Row 2: Partner Details (Joint Only) -->
          <div class="wmcRow" id="wmcJointElm">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your partner's age </label>
                <input type="number" placeholder="35" id="wmcPartnerAge" maxlength="2" minlength="1">
              </div>
              <div class="wmcInput">
                <label for=""> Partner Visa Type </label>
                <select id="wmcPartnerVisaType" class="wmcSelect">
                  <option value="">Select</option>
                  <option value="STAMP 1">STAMP 1</option>
                  <option value="STAMP 1G">STAMP 1G</option>
                  <option value="STAMP 4">STAMP 4</option>
                  <option value="EU/EEA">EU/EEA</option>
                </select>
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Your partner's income (€) </label>
                <input type="text" placeholder="€30,000" id="wmcPartnerIncome">
              </div>
            </div>
          </div>

          <!-- Section: Mortgage Information -->
          <div class="wmcRow">
            <div class="wmcCol">
              <h4>Mortgage Information</h4>
            </div>
          </div>

          <!-- Row 3: Property Value + Mortgage Amount -->
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Property Value (€) </label>
                <input type="text" placeholder="€400,000" id="wmcPropertyValue">
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label for=""> Mortgage Amount (€) </label>
                <input type="text" placeholder="€250,000" id="wmcMortgageAmount">
              </div>
            </div>
          </div>

          <!-- Row 4: Calculate Button -->
          <div class="wmcRow">
            <div class="wmcCol">
              <button class="wmcBtn" id="wmcBtnCalculate"> Calculate</button>
            </div>
          </div>

          <!-- Output Section -->
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
add_shortcode('fn_calculator', 'fn_calculator_shortcode');
