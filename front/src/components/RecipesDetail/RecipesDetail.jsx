    import { useParams, Link } from "react-router-dom";
    import { useEffect, useState } from "react";
    import axios from "axios";
    import styles from "./RecipesDetail.module.css";

    const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem('token');

        axios
        .get(`http://localhost:3010/recipes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
    })
        .then((res) => setRecipe(res.data))
        .catch((err) => console.error("Error al obtener receta:", err));
    }, [id]);

    if (!recipe) return <p>Cargando receta...</p>;

    return (
        <div className={styles.container}>
        <h1>{recipe.title}</h1>
        <img src={recipe.image} alt={recipe.title} className={styles.image} />
        <p><strong>Descripción:</strong> {recipe.description}</p>
        <p><strong>Ingredientes:</strong> {recipe.ingredients}</p>

        <Link to="/recipes"><button className={styles.button} > Volver</button></Link>
        </div>
    );
    };

export default RecipeDetail;