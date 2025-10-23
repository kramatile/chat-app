import type { User } from "../model/common";
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Users {
    users: Array<User>,
}

interface UsersResponse {
    users: Array<User>

}

/*export const fetchUsers = createAsyncThunk(
  'users/fetchList',
  async (generation: number) => {
    const response = await fetch(`/api/users`,  {
            method: "POST", // ou 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
    return (await response.json()) as PokemonsResponse
  }
)*/


const initialState: Users = {
    users: [],
};


export const userSlice = createSlice({
    name:'users',
    initialState,
    reducers: {
        
       
    },

});

//export const {setSession, clearSession} = userSlice.actions;
export const userSelector = (state: RootState) => state.users;
export default userSlice.reducer;