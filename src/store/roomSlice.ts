// src/store/userSlice.ts
import type { User, Room} from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface RoomsState {
  rooms: Room[];
  status: "idle" | "loading" | "failed";
}

export const fetchRooms = createAsyncThunk<Room[], string>(
  "rooms/fetchList",
  async (token: string, { rejectWithValue }) => {
    console.log(token);
    try {
      const response = await fetch(`/api/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch rooms");
      }

      const data = await response.json();
      return data as Room[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: RoomsState = {
  rooms: [],
  status: "idle",
};

export const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = "loading";
        console.log('pending',state)

      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = "idle";
        state.rooms = action.payload;
        console.log('idle',state)

      })
      .addCase(fetchRooms.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const roomSelector = (state: RootState) => state.rooms;
export default roomSlice.reducer;
