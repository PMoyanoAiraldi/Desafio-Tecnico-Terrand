import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import RecipesList from './components/Recipes/RecipesList';
import RecipeDetail from './components/RecipesDetail/RecipesDetail';

function App() {
  

  return (
    <>
      <Routes> 
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/signIn" />} />
      <Route path='/signIn' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>

      <Route path="/recipes" element={<RecipesList />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      

      </Routes>
    </>
  )
}

export default App
