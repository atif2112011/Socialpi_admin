import { createSlice } from "@reduxjs/toolkit";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    CurrentUser: null,
  },
  reducers: {
    SetCurrentUser: (state, action) => {
      state.CurrentUser = action.payload;
    },
  },
});

export const { SetCurrentUser } = usersSlice.actions;
