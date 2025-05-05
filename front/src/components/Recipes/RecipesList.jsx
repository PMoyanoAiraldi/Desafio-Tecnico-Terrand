    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";
    import styles from "./RecipesList.module.css";

    const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            console.error("No hay token, redirigiendo a login...");
            navigate("/signIn");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:3010/recipes", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecipes(res.data);
        } catch (err) {
            console.error("Error al obtener recetas:", err);
            if (err.response && err.response.status === 401) {
                navigate("/signIn");
            }
        }
    };

    fetchData();
}, [navigate]);

    const handleClick = (id) => {
        navigate(`/recipes/${id}`);
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Elimina el token
        navigate("/signIn");              // Redirige al login
    };

    return (
        <div className={styles.container}>
        
        <h1 className={styles.title}>Recetas</h1>
        <div className={styles.grid}>
            {recipes.map((recipe) => (
            <div
                key={recipe.id}
                className={styles.card}
                onClick={() => handleClick(recipe.id)}
            >
                <img
                src={recipe.image}
                alt={recipe.title}
                className={styles.image}
                />
                <h2 className={styles.recipeTitle}>{recipe.title}</h2>
            </div>
            ))}
        </div>
        <button className={styles.button} onClick={handleLogout}>
    Cerrar sesión
</button>
        
        </div>
    );
    };

export default RecipesList;