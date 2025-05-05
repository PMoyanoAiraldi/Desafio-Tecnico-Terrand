import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/userReducer";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Login.module.css"


const Login = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogin = (userData) => {
        axios.post(`http://localhost:3010/auth/signIn`, userData)
        .then(resp => {
            if(resp.data && resp.data.user && resp.data.token) {
                localStorage.setItem('token', resp.data.token);
                dispatch(login({ login: true, user: resp.data.user }));
                navigate("/recipes");
            } else {
                alert("Credenciales incorrectas");
            }
        })
        .catch(() => {
            Swal.fire('Error', 'Error al registrar los datos', 'error');
            navigate("/signIn")
            
        });
    };

    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e) => { 
        setInput({ 
            ...input, 
            [e.target.name]:e.target.value 
        })

    }

    const isButtonDisabled = input.email === '' || input.password === '';
    return(
        <div >
        
        <form className={styles.form}>
        <div >
        <input className={styles.input} type="text" name="email" id="email"
        placeholder="Ejemplo@mail.com" 
        onChange={handleChange} 
        value={input.email}/>
        </div> 
        <div>
        <input className={styles.input} type="password" name="password" id="password"
        placeholder="Contraseña" 
        onChange={handleChange} 
        value={input.password}/>
        </div>
        <div>
        <button type="button" className={styles.button} onClick={() => onLogin(input)} disabled={isButtonDisabled}>Ingresar</button>
        <Link to="/"><button type="submit" className={styles.button} > Salir</button></Link>
        </div>
        <p> ¿No estás registrado? <Link to="/register">Registrate ahora</Link></p>
        </form>
        </div>
    )
}

export default Login;