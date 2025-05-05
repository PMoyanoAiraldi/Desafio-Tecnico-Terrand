export default function validation (input) {
    const errors = {} //inicia en vacio porque solamente los input que genere error lo va a guardar 

    const regexName = /^[^\d]+$/;
    const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[=!@#$%^&*])[A-Za-z\d=!@#$%^&*]{8,15}$/;
    const regexNumber = /^(?:[0-9]+[a-z]|[a-z]+[0-9])[a-z0-9]*$/i;

    //Name validation
    if(!input.name) errors.name = 'Ingresa el nombre!'; //no puede estar el campo vacío
    if (!regexName.test(input.name)) errors.name = 'No se permiten números en el nombre';

    //Surname validation
    if(!input.name) errors.name = 'Ingresa el apellido!'; //no puede estar el campo vacío
    if (!regexName.test(input.name)) errors.name = 'No se permiten números en el apellido';
    

    //Email validation
    if(!input.email) errors.email = 'Ingresa el email!';
    if(!regexEmail.test(input.email)) errors.email = 'El email debe tener el formato adecuado';
    if(input.email.length > 35) errors.email = 'Los caracteres máximos del correo electrónico son 35';


    
    //Password validation
    if(!input.password) errors.password = 'Ingresa la contraseña!';
    if(!regexPassword.test(input.password)) errors.password = 'La contraseña debe tener entre 8 y 15 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*).';
    

    //Confirmed password validation
    if(input.password !== input.cPassword) errors.cPassword = 'La contraseña y la confirmación de contraseña no coinciden'

   // if(Object.keys(errors).length === 0) errors.disabled = false; //Si no hay ninguna propiedad en el objeto errors entonces activamos el botón

    errors.disabled = Object.keys(errors).length


    return errors
}