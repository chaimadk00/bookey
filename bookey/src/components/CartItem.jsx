import { useDispatch } from "react-redux";
import { addToCart, decreaseQuantity, removeFromCart } from "../redux/actions";

function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <li className="ledger-item">
      {/* Mini Book Cover Thumbnail */}
      <div
        className="ledger-item__cover"
        style={{ backgroundColor: item.color }}
        aria-hidden="true"
      >
        <div className="ledger-item__cover-spine" />
        <span className="ledger-item__cover-init">
          {item.title.charAt(0)}
        </span>
      </div>

      <div className="ledger-item__info">
        <h4 className="ledger-item__title">{item.title}</h4>
        <p className="ledger-item__author">{item.author}</p>
        <p className="ledger-item__unit-price">
          {item.price.toLocaleString("en-US")} DZD each
        </p>
      </div>

      <div className="ledger-item__controls">
        <div className="ledger-qty">
          <button
            className="ledger-qty__btn"
            aria-label={`Decrease quantity of ${item.title}`}
            onClick={() => dispatch(decreaseQuantity(item.id))}
          >
            −
          </button>
          <span className="ledger-qty__val">{item.quantity}</span>
          <button
            className="ledger-qty__btn"
            aria-label={`Increase quantity of ${item.title}`}
            onClick={() => dispatch(addToCart(item))}
          >
            +
          </button>
        </div>

        <strong className="ledger-item__total-price">
          {(item.price * item.quantity).toLocaleString("en-US")} DZD
        </strong>

        <button
          className="ledger-item__remove-btn"
          onClick={() => dispatch(removeFromCart(item.id))}
          aria-label={`Remove ${item.title} from basket`}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default CartItem;
