import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DECREASE_QUANTITY,
  CLEAR_CART,
} from "./actionTypes";

// Action creators: functions that return action objects
export const addToCart = (book) => ({
  type: ADD_TO_CART,
  payload: book,
});

export const removeFromCart = (bookId) => ({
  type: REMOVE_FROM_CART,
  payload: bookId,
});

export const decreaseQuantity = (bookId) => ({
  type: DECREASE_QUANTITY,
  payload: bookId,
});

export const clearCart = () => ({
  type: CLEAR_CART,
});
