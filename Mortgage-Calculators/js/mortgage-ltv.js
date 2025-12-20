document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const singleBtn = document.querySelector(".btnSelected");
  const jointBtn = document.querySelector(".wmcbtnJoint");
  const jointElm = document.getElementById("wmcJointElm");
  const mortgageInput = document.getElementById("wmcMortgageAmount");
  const propertyInput = document.getElementById("wmcMaxPropertyPice");
  const ltvDisplay = document.getElementById("wmcLTV");

  // Single/Joint toggle logic
  if (singleBtn && jointBtn && jointElm) {
    singleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      jointElm.style.display = "none";
      singleBtn.classList.add("btnSelected");
      jointBtn.classList.remove("btnSelected");
    });

    jointBtn.addEventListener("click", function (e) {
      e.preventDefault();
      jointElm.style.display = "flex";
      jointBtn.classList.add("btnSelected");
      singleBtn.classList.remove("btnSelected");
    });

    // Hide joint section initially
    jointElm.style.display = "none";
  }

  // LTV calculation function
  function updateLTV() {
    const mortgageVal = parseFloat(mortgageInput.value.replace(/[^\d.]/g, '')) || 0;
    const propertyVal = parseFloat(propertyInput.value.replace(/[^\d.]/g, '')) || 0;

    let ltv = 0;
    if (propertyVal > 0) {
      ltv = Math.round((mortgageVal / propertyVal) * 100);
    }

    ltvDisplay.textContent = `${ltv}%`;
  }

  // Event listeners for live updates
  [mortgageInput, propertyInput].forEach(input => {
    input.addEventListener("input", updateLTV);
    input.addEventListener("blur", updateLTV);
  });

  // Trigger once on page load
  updateLTV();
});
