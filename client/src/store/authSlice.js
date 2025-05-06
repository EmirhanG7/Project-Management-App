import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  user: null
}

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = false;
    },
  },
})

export const {setUser, clearUser} = auth.actions
export default auth.reducer