/* ==========================================================
VARIABLES
========================================================== */

let verification = {
  initialise: undefined,
  listeners: undefined,
  collect: undefined,
  resend: undefined,
  confirm: undefined
}

/* ==========================================================
FUNCTIONS
========================================================== */

verification.initialise = () => {
  // Add the event listeners
  verification.listeners();
}

verification.listeners = () => {
  document.querySelector("#resend-code").addEventListener("click", verification.resend);
  document.querySelector("#verify-btn").addEventListener("click", verification.confirm);
}

verification.resend = async () => {
  // Clear the error field
  document.querySelector(".error-p").innerHTML = "";
  // Disable "Resend Code" button
  document.querySelector("#resend-code").setAttribute("disabled", "");
  // Send the request to the backend
  let data;
  try {
    data = (await axios.post("/verification/resend-code"))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Handle any incoming failures or errors
  if (data.status === "failed") {
    // Enable "Resend Code" button
    document.querySelector("#resend-code").removeAttribute("disabled");
    // Display the failure message
    document.querySelector(".error-p").innerHTML = data.content;
    return;
  } else if (data.status === "error") {
    // Enable "Resend Code" button
    document.querySelector("#resend-code").removeAttribute("disabled");
    // TEMPORARY: Display the error on the console
    console.log(data.content);
    return;
  }
  // Success handler
  // Enable "Resend Code" button
  document.querySelector("#resend-code").removeAttribute("disabled");
  // TEMPORARY: Display the success message on the console
  console.log("The code has been sent successfully");
  return;
}

verification.collect = () => {
  const codeObject = {
    first: String(document.querySelector("#first").value),
    second: String(document.querySelector("#second").value),
    third: String(document.querySelector("#third").value),
    fourth: String(document.querySelector("#fourth").value),
    fifth: String(document.querySelector("#fifth").value),
    sixth: String(document.querySelector("#sixth").value)
  }
  const code = codeObject.first + codeObject.second + codeObject.third +
  codeObject.fourth + codeObject.fifth + codeObject.sixth;
  return code;
}

verification.confirm = async () => {
  // Clear the error messages
  document.querySelector(".error-p").innerHTML = "";
  // Disable the "Confirm" button
  document.querySelector("#verify-btn").setAttribute("disabled", "");
  // Collect code input
  const code = verification.collect();
  // Validate code input
  // TO DO
  // Send request to the backend
  let data;
  try {
    data = (await axios.post("/verification/verify-account", { code }))["data"];
  } catch (error) {
    data = { status: "error", content: error };
  }
  // Validate the response from the request
  if (data.status === "failed") {
    // Enable "Resend Code" button
    document.querySelector("#verify-btn").removeAttribute("disabled");
    // Display the failure message
    document.querySelector(".error-p").innerHTML = data.content;
    // Abort
    return;
  } else if (data.status === "error") {
    // Enable "Resend Code" button
    document.querySelector("#verify-btn").removeAttribute("disabled");
    // TEMPORARY: Display the error on the console
    console.log(data.content);
    // Abort
    return;
  }
  // Success handler - redirect to the dashboard
  window.location.assign("/dashboard");
  return;
}

/* ==========================================================
END
========================================================== */

// Code inputs functionality
const form = document.querySelector('.input-form')
const inputs = form.querySelectorAll('.code-input')
const KEYBOARDS = {
  backspace: 8,
  arrowLeft: 37,
  arrowRight: 39,
}

function handleInput(e) {
  const input = e.target
  const nextInput = input.nextElementSibling
  if (nextInput && input.value) {
    nextInput.focus()
    if (nextInput.value) {
      nextInput.select()
    }
  }
}

function handlePaste(e) {
  e.preventDefault()
  const paste = e.clipboardData.getData('text')
  const pasteLength = paste.length
  console.log(pasteLength)
  inputs.forEach((input, i) => {
    input.value = paste[i] || ''
  })
  if (pasteLength > inputs.length){
    inputs[(inputs.length)-1].focus()
  } else {
    inputs[pasteLength-1].focus()
  }
}

function handleBackspace(e) { 
  const input = e.target
  const previousInput = e.target.previousElementSibling
  if (previousInput !== null){
    if (input.value) {
        input.value = ''
        return
      }
    input.previousElementSibling.focus()
  }  
}

function handleArrowLeft(e) {
  const previousInput = e.target.previousElementSibling
  if (!previousInput) return
  previousInput.focus()
}

function handleArrowRight(e) {
  const nextInput = e.target.nextElementSibling
  if (!nextInput) return
  nextInput.focus()
}

form.addEventListener('input', handleInput)
inputs[0].addEventListener('paste', handlePaste)

inputs.forEach(input => {
  input.addEventListener('focus', e => {
    setTimeout(() => {
      e.target.select()
    }, 0)
  })
  
  input.addEventListener('keydown', e => {
    switch(e.keyCode) {
      case KEYBOARDS.backspace:
        handleBackspace(e)
        break
      case KEYBOARDS.arrowLeft:
        handleArrowLeft(e)
        break
      case KEYBOARDS.arrowRight:
        handleArrowRight(e)
        break
      default:  
    }
  })
})

// disable control z - breaks inputs
document.onkeydown = function(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
    }
  }

// Code input validation