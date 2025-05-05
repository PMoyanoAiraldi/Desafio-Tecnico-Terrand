import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import validation from "./validation";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userReducer";
import styles from "./Register.module.css";
import axios from "axios";
import Swal from 'sweetalert2';

const Register= () =>{

    console.log("El componente Register se está renderizando");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const [input, setInput] = useState({
        name:'',
        surname: '',
        email:'',
        password: '',
        cPassword:''
    });

    const [errors, setErrors] = useState({
        name:'',
        surname: '',
        email:'',
        password: '',
        cPassword:''
    
    });

    const [disabled, setDisabled] = useState(true);

    const handleChange = (e) => { 
        
        setErrors(validation({//validamos que no tenga errores
            ...input,
            [e.target.name]:e.target.value
        }));

        setInput({ //es una promesa
            ...input, //trae todo lo que esta en input
            [e.target.name]:e.target.value //de los cambios que haya en username o password trae el valor, identificamos los campos por name
        })

        setDisabled(!validate());

    }

    const validate = () => {
        const requiredFields = ['name', 'surname', 'email',  'password', 'cpassword'];
        return requiredFields.every(field => !!input[field]);
    };


    const handleSubmit = (e) => { 
        e.preventDefault()
        console.log("handleSubmit se ejecuta");
        if (input.password !== input.cPassword) {
            setErrors({
                ...errors,
                cPassword: 'Las contraseñas no coinciden'
            });
            return;
        }
        console.log("Datos a enviar:", input);

        const userToRegister = {
            name: input.name,
            surname: input.surname,
            email: input.email,
            password: input.password,
            confirmPassword: input.cPassword, 
            state: true                       
        };

        axios.post(`http://localhost:3010/auth/signUp`, userToRegister)
        .then(resp => {
            if (resp.data) {
                dispatch(login(resp.data.user)); 
                Swal.fire('Éxito', 'Datos registrados correctamente', 'success');
                setInput({  // Limpiar los campos de entrada después del registro exitoso
                    name: '',
                    surname: '',
                    email: '',
                    password: '',
                    cPassword: ''
                });
                navigate("/signIn")
            }

        })
        .catch(error => {
            console.error("Error al registrar:", error.response?.data || error.message);
            Swal.fire('Error', 'Error al registrar los datos', 'error');
        });
};

    return(
        <div className={styles.fondo}>
        
        <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Mis datos</h1>
        <div>
        <input className={styles.input} type="text" name="name" 
        placeholder="Nombre" 
        value={input.name}
        onChange={handleChange}
        />
        {errors.name &&<p className={styles.p}>{errors.name}</p>}
        </div>

        <div>
        <input className={styles.input} type="text" name="surname" 
        placeholder="Apellido" 
        value={input.surname}
        onChange={handleChange}
        />
        {errors.name &&<p className={styles.p}>{errors.name}</p>}
        </div>

        <div>
        <input className={styles.input} type="email" name="email" 
        placeholder="Ejemplo@email.com"
        value={input.email}
        onChange={handleChange}
        />
        {errors.email &&<p className={styles.p}>{errors.email}</p>}
        </div>

        <div>
        <input className={styles.input} type="password" name="password" 
        placeholder="Contraseña"
        value={input.password}
        onChange={handleChange}
        />
        {errors.password &&<p className={styles.p}>{errors.password}</p>}
        </div>

        <div>
        <input className={styles.input} type="password" name="cPassword" 
        placeholder="Confirmar contraseña"
        value={input.cPassword}
        onChange={handleChange}
        />
        {errors.cPassword &&<p className={styles.p}>{errors.cPassword}</p>}
        </div>

        <div>
        <button type="submit" className={styles.button} > Registrar</button>
        <Link to="/recipes"><button className={styles.button} > Salir</button></Link>
        </div>

        </form>
        
        </div>
    )
}


export default Register;