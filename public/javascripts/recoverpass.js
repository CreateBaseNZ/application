// Code inputs functionality
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