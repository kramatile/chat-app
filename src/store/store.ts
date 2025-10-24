import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';
import userReducer from './userSlice';
import roomReducer from './roomSlice';
import messageReducer from './messagesSlice';
export const store = configureStore({
  reducer: {
    sessions : sessionReducer,
    users: userReducer,
    rooms: roomReducer,
    messages: messageReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
