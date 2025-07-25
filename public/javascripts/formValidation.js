const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const repeatPassword = document.getElementById('repeatPassword');
const passwordMessage = document.getElementById('passwordMessage');
const repeatMessage = document.getElementById('repeatMessage');
const firstName = document.getElementById('name');
const lastName = document.getElementById('lastName');
const emailMessage = document.getElementById('email-message');

const nameMessage = document.getElementById('name-message');
const lastNameMessage = document.getElementById('lastName-message');

function validate() {
    if (repeatPassword.value === '') {
        repeatMessage.textContent = '';
        repeatPassword.style.borderColor = '';
    } else if (password.value === repeatPassword.value) {
        repeatMessage.textContent = '✔️ Las contraseñas coinciden';
        repeatMessage.style.color = 'green';
        repeatPassword.style.borderColor = 'green';
    } else {
        repeatMessage.textContent = '❌ Las contraseñas no coinciden';
        repeatMessage.style.color = 'red';
        repeatPassword.style.borderColor = 'red';
    }
}
password.addEventListener('input', validate);
repeatPassword.addEventListener('input', validate);

function validateMail() {
  const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!mailRegex.test(email.value.trim())) {
    emailMessage.textContent = 'El mail debe tener un formato válido';
    emailMessage.style.color = 'red';
    email.style.borderColor = 'red';
  } else {
    emailMessage.textContent = '';
    email.style.borderColor = '';
  }
}

email.addEventListener('input', validateMail);

const fields = [
    { input: email, message: emailMessage},
    { input: password, message: passwordMessage},
    { input: repeatPassword, message: repeatMessage},
    { input: firstName, message: nameMessage},
    { input: lastName, message: lastNameMessage},
]

form.addEventListener('submit', function (event) {

    let error = false;

    fields.forEach(f => {
        if (f.input.value.trim() === '') {
            f.message.textContent = 'Este campo es obligatorio';
            f.message.style.color = 'red';
            f.input.style.borderColor = 'red';
            error = true
        }

    });

    if (error) event.preventDefault();

});




