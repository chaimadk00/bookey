import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  DECREASE_QUANTITY,
  CLEAR_CART,
} from "./actionTypes";

const initialState = {
  items: [],
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const book = action.payload;
      const existing = state.items.find((item) => item.id === book.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...book, quantity: 1 }],
      };
    }

    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case DECREASE_QUANTITY:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
}

export default cartReducer;
