// src/store/userSlice.ts
import type { User } from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "failed";
}

export const fetchUsers = createAsyncThunk<User[], string>(
  "users/fetchList",
  async (token: string, { rejectWithValue }) => {
    console.log(token);
    try {
      const response = await fetch(`/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch users");
      }

      const data = await response.json();
      return data as User[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: UsersState = {
  users: [],
  status: "idle",
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        console.log('pending',state)

      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "idle";
        state.users = action.payload;
        console.log('idle',state.users)

      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const userSelector = (state: RootState) => state.users;
export const filteredUsers = (state: RootState) => (username: string) => state.users.users.filter(
        (user) => user.username != username
      );
export const userIdSelector = (state: RootState) => (id: number) => state.users.users.find(
        (user) => user.user_id === id
      );
export default userSlice.reducer;
