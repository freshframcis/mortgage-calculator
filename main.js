const elements = {
  clearText: document.getElementById("clear"),
  amount: document.getElementById("amount-id"),
  years: document.getElementById("term-id"),
  interestId: document.getElementById("interest-id"),
  repayment: document.getElementById("repayment-id"),
  signs: document.querySelectorAll("#signs"),
  interest: document.getElementById("interest"),
  btn: document.getElementById("btn-submit"),
  result: document.querySelector(".result"),
  longDiv: document.querySelectorAll(".long-div"),
  shortDiv: document.querySelectorAll(".short-div"),
  err: document.querySelectorAll(".error"),
  innerOutput: document.querySelector(".inner-output"),
  resultContainer: document.querySelector(".result-container"),
  total: document.querySelector(".total-payment"),
};

let money,
  year,
  interestPay,
  isValid = false;

const updateValidity = (value, element, index, min = 0) => {
  const isValidValue = value > min;
  element.classList.toggle("err-alert", !isValidValue);
  elements.signs[index].classList.toggle("sign-alert", !isValidValue);
  elements.signs[index].classList.toggle("colour", isValidValue);
  elements.err[index].textContent = isValidValue
    ? ""
    : "This field is required";

  return isValidValue;
};

const getValue = (el) => Number(el.value.replace(/\s+/g, ""));

const myMoney = () => {
  money = getValue(elements.amount);
  isValid = updateValidity(money, elements.longDiv[0], 0);
};
const interestRate = () => {
  interestPay = getValue(elements.interestId);
  isValid = updateValidity(interestPay, elements.shortDiv[1], 2);
  if (isValid) interestPay = interestPay / 100 / 12;
};
const interestYears = () => {
  year = getValue(elements.years);
  isValid = updateValidity(year, elements.shortDiv[0], 1);
  if (isValid) year *= 12;
};

const calculate = () => {
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
  const num = Math.pow(1 + interestPay, year);
  let isColor = false;

  if (!elements.repayment.checked && !elements.interest.checked) {
    isValid = false;
    elements.err[3].textContent = "This field is required";
    return;
  }
 

  elements.err[3].textContent = "";
  const mortgageRepayment = (money * interestPay * num) / (num - 1);
  const formattedRepayment = mortgageRepayment.toLocaleString("en-US", options);

  if (elements.repayment.checked) {
    elements.longDiv[2].classList.remove("back-color");
    elements.longDiv[1].classList.add("back-color");

    elements.result.innerHTML = `&pound;${formattedRepayment}`;
    elements.total.innerHTML = `&pound;${(
      mortgageRepayment * year
    ).toLocaleString("en-US", options)}`;
  } else if (elements.interest.checked) {
    elements.longDiv[1].classList.remove("back-color");
    elements.longDiv[2].classList.add("back-color");
    const totalInterest = mortgageRepayment * year - money;
    const monthlyInterest = (totalInterest / year).toLocaleString(
      "en-US",
      options
    );
    elements.result.innerHTML = `&pound;${monthlyInterest}`;
    elements.total.innerHTML = `&pound;${totalInterest.toLocaleString(
      "en-US",
      options
    )}`;
  }

  elements.innerOutput.style.display = "none";
  elements.resultContainer.style.display = "block";

  interestYears();
  myMoney();
  interestRate();
};

const clearAll = () => {
  let clearBtn = document.querySelectorAll("input");
  clearBtn.forEach((input) => {
    if (input.type == "number") {
      input.value = "";
    } else if (input.type == "radio") {
      input.checked = false;
    }
  });
  elements.result.innerHTML = "";
  elements.total.innerHTML = "";
  elements.err.forEach((errs) => (errs.textContent = ""));
  elements.innerOutput.style.display = "block";
  elements.resultContainer.style.display = "none";
  elements.signs.forEach((r) => r.classList.remove("colour"));
  elements.longDiv.forEach((b) => b.classList.remove("back-color"));
  elements.signs.forEach((l) => l.classList.remove("sign-alert"));
  elements.longDiv[0].classList.remove("err-alert");
  elements.shortDiv.forEach((s) => s.classList.remove("err-alert"));
};

elements.amount.addEventListener("input", myMoney);
elements.years.addEventListener("input", interestYears);
elements.interestId.addEventListener("input", interestRate);
elements.btn.addEventListener("click", calculate);
elements.clearText.addEventListener("click", clearAll);
