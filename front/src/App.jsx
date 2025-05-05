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
      <Route path="/" element={<Navigate to="/sigIn" />} />
      <Route path='/signIn' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>

      <Route path="/recipes" element={<RecipesList />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />
      

      {/* Rutas protegidas, dentro del layout */}
      {/* <Route element={<AppLayout />}> */}
      {/* <Route path='/welcome' element={<WelcomeScreen/>}/>
      <Route path='/user-maintenance' element={<UserMaintenance/>}/>
      <Route path='/user-edit/:idPerson' element={<EditUserForm/>}/>
      <Route path='/editar-perfils/:idPerson' element={<EditUserForm/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/profile' element={<Profile/>}/> */}

      </Routes>
    </>
  )
}

export default App
