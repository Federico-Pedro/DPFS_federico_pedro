const form = document.getElementById('form');
const productName = document.getElementById('name');
const description = document.getElementById('description');
const material = document.getElementById('material');
const category = document.getElementById('category');
const price = document.getElementById('price');
const image = document.getElementById('file');

const nameMessage = document.getElementById('nameMessage');
const descriptionMessage = document.getElementById('descriptionMessage');
const materialMessage = document.getElementById('materialMessage');
const categoryMessage = document.getElementById('categoryMessage');
const priceMessage = document.getElementById('priceMessage');
const imgMessage = document.getElementById('fileMessage');

let error = false;

function validateName(){
    if(productName.value.length < 5){
        nameMessage.textContent = 'El nombre del producto debe tener al menos 5 caracteres';
        error = true
    } else {
        nameMessage.textContent = '';
        error = false;
    }
}
productName.addEventListener('input', validateName);

function validateDescription(){
    if(description.value.length < 50){
        descriptionMessage.textContent = 'La descripcion del producto debe tener al menos 20 caracteres';
        error = true
    } else {
        descriptionMessage.textContent = '';
        error = false;
    }
}
description.addEventListener('input', validateDescription);

function validateMaterial(){
    if(material.value.length < 25){
        materialMessage.textContent = 'Los materiales del producto debe tener al menos 20 caracteres';
        error = true
    } else {
        materialMessage.textContent = '';
        error = false;
    }
}
material.addEventListener('input', validateMaterial);

function validateImage(){
    
    
    if(!image.name.match(/\.(jpg|jpeg|png|gif)$/i)){
        error = true;
        imgMessage.textContent = 'Solo se permiten imágenes JPG, PNG o GIF(front-end)';
        imgMessage.style.color = 'red';
        image.style.borderColor = 'red';
        console.log('funciona la validacion front-end');
    }        
}

image.addEventListener('change', validateImage);


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
