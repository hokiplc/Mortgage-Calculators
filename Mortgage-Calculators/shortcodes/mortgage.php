<?php
function mortgage_calculator_shortcode() {
    ob_start(); ?>
    <form class="wmcForm" id="mortgage_form" data-loantype="ftb">
      <div class="wmcHeader">
        <div class="wmcBtnGroup">
          <button class="wmcBtn wmcBtnTlg btnSelected">Single</button>
          <button class="wmcBtn wmcBtnTlg wmcbtnJoint">Joint</button>
        </div>
      </div>
      <div class="wmcBody">
        <div class="wmcContainer">
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Your Age</label>
                <input type="text" id="wmcAge" placeholder="35">
                <span class="wmcWarning errAge"></span>
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Your Salary (€)</label>
                <input type="text" id="wmcSalary" placeholder="€50,000">
                <span class="wmcWarning errSalary">Please Insert your salary</span>
              </div>
            </div>
          </div>
          <div class="wmcRow" id="wmcJointElm">
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Your partner's age</label>
                <input type="number" id="wmcPartnerAge" placeholder="35">
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Your partner's income (€)</label>
                <input type="text" id="wmcPartnerIncome" placeholder="€30,000">
              </div>
            </div>
          </div>
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Mortgage Amount (€)</label>
                <input type="text" id="wmcMortgageAmount" placeholder="€200,000">
                <span class="wmcFeedBack fbMortgageAmount">
                  You can borrow up to a maximum of 4 times your gross annual income.
                </span>
              </div>
            </div>
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Deposit (€)</label>
                <input type="text" id="wmcDeposit" placeholder="€50,000">
              </div>
            </div>
          </div>
          <div class="wmcRow">
            <div class="wmcCol">
              <div class="wmcInput">
                <label>Property Price (€)</label>
                <input type="text" id="wmcMaxPropertyPice" placeholder="€220,000">
              </div>
            </div>
          </div>
          <div class="wmcRow"><div class="wmcCol"><button class="wmcBtn" id="wmcBtnCalculate">Calculate</button></div></div>
          <div id="wmcOutputs">
            <div class="wmcRow"><div class="wmcCol">
              <ul class="wmcOutputList">
                <li><span>Mortgage Amount</span> <span id="opMortgageAmount"></span></li>
                <li><span>Loan Term</span> <span id="opLoanTerm"></span></li>
              </ul>
              <div class="loanTermRange">
                <input type="range" id="loanTermRangeSlide" min="5" max="35" value="30">
              </div>
            </div></div>
            <div id="best3wrap"><div class="wmcRow"></div></div>
          </div>
        </div>
      </div>
    </form>
    <?php return ob_get_clean();
}
add_shortcode('mortgage_calculator', 'mortgage_calculator_shortcode');
