import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./userReducer";
import { recipesSlice } from "./recipesReducer";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        userRecipes: recipesSlice.reducer
    }
})

export default store;