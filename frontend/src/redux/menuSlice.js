import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMenus = createAsyncThunk('menus/fetchMenus', async () => {
  const response = await axios.get('https://jinn-dashboard-backend.vercel.app/api/menus');
  return response.data;
});

export const addMenu = createAsyncThunk('menus/addMenu', async (menu) => {
  const response = await axios.post('https://jinn-dashboard-backend.vercel.app/api/menus', menu);
  return response.data;
});

const menuSlice = createSlice({
  name: 'menus',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMenus.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(addMenu.fulfilled, (state, action) => {
      state.push(action.payload);
    });
  },
});

export default menuSlice.reducer;