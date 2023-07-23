// Get the modal element
const modal = document.getElementById("modal-container");

// close icon
const closeBtn = document.getElementsByClassName("close")[0];

// continue to aspapay button
const continueButton = document.getElementById("continueButton");

// Get references to specific DOM elements
// The container for each input
const cardRowDiv = document.getElementsByClassName("card-row");
// The expiry field container
const expiryDiv = document.getElementsByClassName("expiry-input")[0];
// The input field itself
const cardInputDiv = document.getElementsByClassName("card-input")[0];
// Get the expiry date input
const expiryDateInput = document.getElementById("expiryDate");
// Get the cvv input
const cvvInput = document.getElementById("cvv");
// card number
const cardInput = document.getElementById("card-input");
// Get the name input
const nameInput = document.getElementById("name-input");
// name on card 
const nameOnCard = document.getElementById("nameOnCard");

// ---------------- implementing bank transfer -------------------------
// Card details section 
const cardDetails = document.getElementsByClassName("card-details")[0];
// Card details section 
const ussdDetails = document.getElementById("ussd-details");
// bank transfer section
const ussdTransfer = document.getElementById("ussd-details-wrapper")
// timer
const timer = document.getElementById("timer")
// ussd empty
const ussdEmpty = document.getElementById("ussd-empty")
// ussd full
const ussdFull = document.getElementById("ussd-full")

// ---------------------------------------------------------------------
// Card details section 
const bankDetails = document.getElementById("bank-details");
// bank empty
const bankEmpty = document.getElementById("bank-empty")
// bank full
const bankFull = document.getElementById("bank-full")
// bank transfer section
const bankTransfer = document.getElementById("bank-details-wrapper")
// bank name
const bankName = document.getElementById("bank-name")
// bank name
const bankAccount = document.getElementById("bank-account-number")
// account holder
const bankAcctName = document.getElementById("bank-account-name")
//amount
const bankAmount = document.getElementById("bank-amount")
// ----------------------------------------------------------------------

let trackedInput = null;
let trackedCardNumber = null;

// Show the modal on page load
continueButton.addEventListener("click", () => {
  modal.classList.add("slide-down");
  ussdDetails.style.display = "none"
});

// Close the modal and go back when the close button is clicked
closeBtn.addEventListener("click", () => {
  modal.classList.remove("slide-down");
  window.history.back();
});

// Close the modal when the user clicks anywhere outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.classList.remove("slide-down");
  }
});

// Format the card number input by adding a space after every 4 digits
cardInput.addEventListener("input", (event) => {
  const input = event.target;
  const inputValue = input.value.replace(/\s/g, "");
  const formattedValue = inputValue.replace(/(\d{4})/g, "$1 ").trim();
  input.value = formattedValue;
});

// Process the card input by adding spaces after every 4 digits (Unused function)
function processCardInput(input) {
  let spaceCount = parseInt(input.length / 4);
  let processedInput = input;
  let start = 0;
  for (let i = 1; i < spaceCount; i++) {
    processedInput =
      processCardInput.slice(start, i * 4) +
      " " +
      processCardInput.slice(i * 4);
    start += 4;
  }
}

// Handle the expiry date input
expiryDateInput.addEventListener("input", (event) => {
  const input = event.target.value;
  const sanitizedInput = input.replace(/\D/g, "");
  if (sanitizedInput.length < 2) {
    trackedInput = sanitizedInput;
    expiryDateInput.value = trackedInput;
  } else if (sanitizedInput.length === 2) {
    trackedInput = sanitizedInput.slice(0, 2) + "/";
    expiryDateInput.value = trackedInput;
  } else if (sanitizedInput.length === 4 || sanitizedInput.length > 4) {
    trackedInput =
      sanitizedInput.slice(0, 2) + "/" + sanitizedInput.slice(2, 4);
    expiryDateInput.value = trackedInput;
  }
});

// Handle the cvv input
cvvInput.addEventListener("input", (event) => {
  const cvv = event.target.value;
  const sanitizedInput = cvv.replace(/\D/g, "");
  cvvInput.value = sanitizedInput;
  if (sanitizedInput.length >= 3) {
    cvvInput.value = sanitizedInput.slice(0, 3);
  }
});

// Focus and blur functions
function addFocusBorder(parentElement) {
  parentElement.classList.add("focused");
}

function removeFocusBorder(parentElement) {
  parentElement.classList.remove("focused");
}

// ------------------------------- implementing bank transfer -------------------
// make a class active on click
function makeActive(clickedButton, type) {
  const buttons = document.querySelectorAll(".option-card");

  buttons.forEach((button) => {
    // Remove the "active-card" class from all buttons
    button.classList.remove("active-card");
  });
  // Add the "active-card" class only to the clicked button
  clickedButton.classList.add("active-card");
  if (type === "ussd-transfer") {
    // hide the card details section
    cardDetails.style.display = "none"
    bankDetails.style.display = "none"
    ussdDetails.style.display = "block"
    resetCard()
    resetBankTransfer()
  } else if (type === "card-transaction") {
    cardDetails.style.display = "block"
    ussdDetails.style.display = "none"
    bankDetails.style.display = "none"
    resetUssd()
    resetBankTransfer()
  } else if (type === "bank-transfer") {
    bankDetails.style.display = "block"
    ussdDetails.style.display = "none"
    cardDetails.style.display = "none"
    resetUssd()
    resetCard()
  }
}

// --------------- Timer function and bank transfer select ---------------
const selectBank = document.getElementById("selectBank");
const displayCode = document.getElementById("displayCode");
const timerDisplay = document.getElementById("timerDisplay");

let remainingTime = 1800
// Define a variable to store the timer interval
let timerInterval;

// Function to update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to clear the previous timer
function clearTimer() {
  clearInterval(timerInterval);
}

// Function to handle the timer countdown
function startTimer() {
  // Clear the previous timer, if it exists
  clearTimer();

  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingTime--;
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      displayCode.textContent = "Timer Expired!";
    }
    updateTimerDisplay();
  }, 1000);
}

// Add an event listener to the select element
selectBank.addEventListener("change", function () {
  // Get the selected option value
  ussdEmpty.style.display = "none";
  ussdFull.style.display = "block"
  ussdTransfer.style.display = "block"
  const selectedValue = selectBank.value;
  switch (selectedValue) {
    case "firstBank":
      displayCode.textContent = "*894*5000*3099418253#";
      ussdTransfer.style.display = "block";
      remainingTime = 1800; // Set the timer duration in seconds
      startTimer();
      break;
    case "zenithBank":
      ussdTransfer.style.display = "block"
      displayCode.textContent = "*966*5000*1234567890#";
      remainingTime = 1800; // Set the timer duration in seconds
      startTimer();
      break;
    case "accessBank":
      displayCode.textContent = "*901*5000*1234512345#";
      remainingTime = 1800; // Set the timer duration in seconds
      startTimer();
      break;
    default:
      ussdTransfer.style.display = "none";
      ussdEmpty.style.display = "block";
      ussdFull.style.display = "none"
      displayCode.textContent = "";
      remainingTime = 0;
      clearTimer();
  }
});

// Function to copy code to clipboard
function copyCode(button) {
  // Get the #displayCode element
  const codeContainer = document.getElementById("displayCode");
  // Create a range and select the text inside the #displayCode element
  const range = document.createRange();
  range.selectNode(codeContainer);
  // Execute the copy action using the Clipboard API
  navigator.clipboard.writeText(codeContainer.textContent)
    .then(() => {
      // Success: Change the button text temporarily to indicate successful copy
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000); // Reset the button text after 2 seconds
    })
    .catch((error) => {
      // Handle error (e.g., if the browser does not support the Clipboard API)
      console.error("Failed to copy: ", error);
    });
}

// ----------------------------- bank transfer -----------------
const selectBankAccount = document.getElementById("selectBankAccount")

// Add an event listener to the select element
selectBankAccount.addEventListener("change", function () {
  // Get the selected option value
  bankEmpty.style.display = "none";
  bankFull.style.display = "block"
  bankTransfer.style.display = "block"
  const selectedValue = selectBankAccount.value;
  switch (selectedValue) {
    case "firstBank":
      bankName.value = "First Bank"
      bankAccount.value = "3092418251"
      bankAcctName.value = "Aspapay"
      bankAmount.value = "5000"
      bankTransfer.style.display = "block";
      // remainingTime = 1800; // Set the timer duration in seconds
      // startTimer();
      break;
    case "zenithBank":
      bankName.value = "Zenith Bank"
      bankAccount.value = "0034765923"
      bankAcctName.value = "Aspapay"
      bankAmount.value = "5000"
      bankTransfer.style.display = "block";
      // remainingTime = 1800; // Set the timer duration in seconds
      // startTimer();
      break;
    case "accessBank":
      bankName.value = "Access Bank"
      bankAccount.value = "6554892634"
      bankAcctName.value = "Aspapay"
      bankAmount.value = "5000"
      bankTransfer.style.display = "block";
      // remainingTime = 1800; // Set the timer duration in seconds
      // startTimer();
      break;
    default:
      bankTransfer.style.display = "none";
      bankEmpty.style.display = "block";
      bankFull.style.display = "none"
    // displayCode.textContent = "";
    // remainingTime = 0;
    // clearTimer();
  }

});

// Function to copy code to clipboard
function copyBankTransfer(button, type) {
  let copyText = "";
  // Get the #displayCode element
  switch (type) {
    case "bank-name":
      copyText = bankName.value;
      break;
    case "bank-account-number":
      copyText = bankAccount.value;
      break;
    case "bank-amount":
      copyText = bankAmount.value;
      break;
    case "bank-account-name":
      copyText = bankAcctName.value;
      break;
    default:
      copyText = "";
      break;
  }

  // Execute the copy action using the Clipboard API
  navigator.clipboard
    .writeText(copyText)
    .then(() => {
      // Success: Change the button text temporarily to indicate successful copy
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy";
      }, 2000); // Reset the button text after 2 seconds
    })
    .catch((error) => {
      // Handle error (e.g., if the browser does not support the Clipboard API)
      console.error("Failed to copy: ", error);
    });
}



function resetCard() {
  cvvInput.value = ""
  expiryDateInput.value = ""
  cardInput.value = ""
  nameInput.value = ""
}

function resetUssd() {
  selectBank.value = ""
}

function resetBankTransfer() {
  bankName.value = ""
  bankAccount.value = ""
  bankAcctName.value = ""
  bankAmount.value = ""
  selectBankAccount.value = ""
}
