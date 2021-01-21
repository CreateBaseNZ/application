 /*  Switching back and forth the input box for user experience */
 const inputs = document.querySelectorAll('.code-input');
 for (let i = 0; i < inputs.length; i++) {
     inputs[i].addEventListener('keydown', function (event) {
         if (event.key === "Backspace") {
             inputs[i].value = '';
             if (i !== 0) {
                 inputs[i - 1].focus();
             }
         } else if (event.key === "ArrowLeft" && i !== 0) {
             inputs[i - 1].focus();
         } else if (event.key === "ArrowRight" && i !== inputs.length - 1) {
             inputs[i + 1].focus();
         }
     });
     inputs[i].addEventListener('input', function () {
         inputs[i].value = inputs[i].value.toUpperCase(); // Converts to Upper case. Remove .toUpperCase() if conversion isnt required.
         if (i === inputs.length - 1 && inputs[i].value !== '') {
             return true;
         } else if (inputs[i].value !== '') {
             inputs[i + 1].focus();
         }
     });
 }