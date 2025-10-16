import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: undefined,
    isLogin: false,
    userData: undefined,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      state.isLogin = true;
    },
    storeUserDetails: (state, action) => {
      state.userData = action.payload
    },
    logout: (state) => {
      state.token = undefined;
      state.isLogin = false;
      state.userData = undefined;
    },
  },
});

export const { loginSuccess, storeUserDetails, logout } = userSlice.actions;

export default userSlice.reducer;