import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    login: false, //Representa el estado de la sesión
    user: null, //Guarda el usuario actual
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
            login: (state, action) => {
                state.login = true; 
                state.user = action.payload;
        },

        logout: (state) => {
            state.login = false,
            state.user = null  
    },  
    },
});       

export const { login, logout} = userSlice.actions
export default userSlice.reducer;