import type { Session } from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';


const initialState: Session = {
    username: "",
    token:"",
    externalId:"",
    id:0
};


export const sessionSlice = createSlice({
    name:'sessions',
    initialState,
    reducers: {
        setSession: ((state, action: PayloadAction<Session>)=>{
            return action.payload
        }),
        clearSession: ((state)=>{
            state.username = "";
            state.token = "";
            state.externalId = "";
            state.id = 0;
        })
       
    },

});

export const {setSession, clearSession} = sessionSlice.actions;
export const sessionSelector = (state: RootState) => state.sessions;
export default sessionSlice.reducer;