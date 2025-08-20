const form = document.getElementById('form');
const productName = document.getElementById('name');
const description = document.getElementById('description');
const material = document.getElementById('material');
const category = document.getElementById('category');
const price = document.getElementById('price');
const file = document.getElementById('file');

const nameMessage = document.getElementById('nameMessage');
const descriptionMessage = document.getElementById('descriptionMessage');
const materialMessage = document.getElementById('materialMessage');
const categoryMessage = document.getElementById('categoryMessage');
const priceMessage = document.getElementById('priceMessage');
const fileMessage = document.getElementById('fileMessage');

let error = false;


const fields = [
    { input: productName, message: nameMessage },
    { input: description, message: descriptionMessage },
    { input: material, message: materialMessage },
    { input: category, message: categoryMessage },
    { input: price, message: priceMessage },
    { input: file, message: fileMessage },
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
