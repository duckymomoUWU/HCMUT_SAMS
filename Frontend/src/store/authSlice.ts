import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
  isLoggedIn: boolean;
  userName?: string;
}

const initialState: AuthSlice = {
  isLoggedIn: false,
  userName: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.userName = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userName = undefined;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
