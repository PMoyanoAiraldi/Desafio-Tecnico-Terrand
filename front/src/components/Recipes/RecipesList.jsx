    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import axios from "axios";
    import styles from "./RecipesList.module.css";

    const RecipesList = () => {
    const [recipes, setRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
        .get("http://localhost:3010/recipes")
        .then((res) => setRecipes(res.data))
        .catch((err) => console.error("Error al obtener recetas:", err));
    }, []);

    const handleClick = (id) => {
        navigate(`/recipes/${id}`);
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
        </div>
    );
    };

export default RecipesList;