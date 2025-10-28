// src/store/userSlice.ts
import type { Message, Room} from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface MessageState {
  messages: Message[];
  status: "idle" | "loading" | "failed";
}

export const fetchMessages = createAsyncThunk<
  Message[],
  { token: string; conv_id: string },
  { rejectValue: string }
>(
  "messages/fetchList",
  async ({ token, conv_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/message/get`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authentication: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: conv_id }), 
      });

      if (!response.ok) {
        const err = await response.json();
        return rejectWithValue(err.message || "Failed to fetch messages");
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
    addMessage : (state, action:PayloadAction<Message>) => {
      state.messages.push(action.payload);
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";

      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages = action.payload;

      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const {addMessage} = messageSlice.actions;
export const messageSelector = (state: RootState) => state.messages;


export default messageSlice.reducer;
