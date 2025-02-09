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

export const addSubmenu = createAsyncThunk('menus/addSubmenu', async ({ menuId, submenuName }) => {
    const response = await axios.post(`https://jinn-dashboard-backend.vercel.app/api/menus/${menuId}/submenus`, { name: submenuName });
    return response.data;
  }
);

export const deleteMenu = createAsyncThunk('menus/deleteMenu', async (menuId) => {
    await axios.delete(`https://jinn-dashboard-backend.vercel.app/api/menus/${menuId}`);
    return menuId;
  }
);

export const deleteSubmenu = createAsyncThunk('menus/deleteSubmenu', async ({ menuId, submenuName }) => {
    const response = await axios.delete(`https://jinn-dashboard-backend.vercel.app/api/menus/${menuId}/submenus/${submenuName}`);
    return response.data;
  }
);

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
    builder.addCase(addSubmenu.fulfilled, (state, action) => {
      return state.map(menu => 
        menu._id === action.payload._id ? action.payload : menu
      );
    });
    builder.addCase(deleteMenu.fulfilled, (state, action) => {
      return state.filter(menu => menu._id !== action.payload);
    });
    builder.addCase(deleteSubmenu.fulfilled, (state, action) => {
      return state.map(menu => 
        menu._id === action.payload._id ? action.payload : menu
      );
    });
  },
});

export default menuSlice.reducer;