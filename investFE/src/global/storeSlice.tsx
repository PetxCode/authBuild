import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  cart: [],
};

const storeSlice = createSlice({
  name: "eStore",
  initialState,
  reducers: {
    addProductToStore: (state, { payload }) => {
      state.products = payload;
    },
    addProductToCart: (state, { payload }: any) => {
      const check = state.cart.findIndex((el: any) => el?.id === payload?.id);

      console.log(check);

      if (check !== -1) {
        state.cart[check].qty += 1;
      } else {
        const product: any = { ...payload, qty: 1 };
        state.cart.push(product);
      }

      //   state.cart = [];
    },
  },
});

export const { addProductToStore, addProductToCart } = storeSlice.actions;

export default storeSlice.reducer;
