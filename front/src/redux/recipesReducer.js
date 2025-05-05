import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    recipes: []
};

export const recipesSlice = createSlice({
    name: "userRecipes",
    initialState,
    reducers: {
            userRecipes: (state, action) => {
                state.recipes =  action.payload;
            }

    },
    
});

export const { userRecipes } = recipesSlice.actions;
export default recipesSlice.reducer;