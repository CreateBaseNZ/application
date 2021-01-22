// const e = require("express");

/*  Switching back and forth the input box */
//  const inputs = document.querySelectorAll('.code-input');
//  for (let i = 0; i < inputs.length; i++) {
//      inputs[i].addEventListener('keydown', function (event) {
//          if (event.key === "Backspace") {
//              inputs[i].value = '';
//              if (i === (inputs.length - 1)){
//                 console.log('last one')
//             } else if (i !== 0 || i === (inputs.length - 2)) {
//                 inputs[i - 1].focus();
//                 console.log('yep')
//             }
//          } else if (event.key === "ArrowLeft" && i !== 0) {
//              inputs[i - 1].focus();
//          } else if (event.key === "ArrowRight" && i !== inputs.length - 1) {
//              inputs[i + 1].focus();
//          };
//         //  console.log(i)
//      });
//      inputs[i].addEventListener('input', function () {
//          inputs[i].value = inputs[i].value.toUpperCase(); // Converts to Upper case. Remove .toUpperCase() if conversion isnt required.
//          if (i === inputs.length - 1 && inputs[i].value !== '') {
//              return true;
//          } else if (inputs[i].value !== '') {
//              inputs[i + 1].focus();
//          };
//      });
//  }

const form = document.querySelector('#recover-pass-form')
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
  inputs.forEach((input, i) => {
    input.value = paste[i] || ''
  })
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


