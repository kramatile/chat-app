// src/store/userSlice.ts
import type { Message, Room} from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface MessageState {
  messages: Message[];
  status: "idle" | "loading" | "failed";
}

export const fetchMessages = createAsyncThunk<Message[], string>(
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
      return data as Message[];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: MessageState = {
  messages: [],
  status: "idle",
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        console.log('pending',state)

      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages = action.payload;
        console.log('idle',state)

      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const messageSelector = (state: RootState) => state.messages;


export default messageSlice.reducer;
