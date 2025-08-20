const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const passwordMessage = document.getElementById('passwordMessage');
const emailMessage = document.getElementById('emailMessage');



let error = false;

function validateMail() {
    const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!mailRegex.test(email.value.trim())) {
        emailMessage.textContent = 'El mail debe tener un formato válido';
        emailMessage.style.color = 'red';
        email.style.borderColor = 'red';
        error = true;
    } else {
        emailMessage.textContent = '';
        email.style.borderColor = '';
        error = false;
    }
}

email.addEventListener('input', validateMail);

const fields = [
    { input: email, message: emailMessage },
    { input: password, message: passwordMessage }
]

form.addEventListener('submit', function (event) {



    fields.forEach(f => {
        if (f.input.value.trim() === '') {
            f.message.textContent = 'Este campo es obligatorio';
            f.message.style.color = 'red';
            f.input.style.borderColor = 'red';
            error = true
        }


    });
    console.log('Error is: ', error)
    if (error) {
        event.preventDefault();
        error = false
    };
    console.log('Error ahora es: ', error)
});
