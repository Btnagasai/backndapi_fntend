import { Link } from 'react-router-dom';
import useStore from '../store/products';

export const Cart = () => {
  const { cart, getTotalPrice, removeItems } = useStore();

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Cart Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Your Cart</h1>
        <p className="text-lg text-gray-600 mt-2">Total Price: <span className="font-semibold">${totalPrice}</span></p>
      </div>

      {/* Cart Items */}
      <div className="max-w-6xl mx-auto px-4">
        {cart.length > 0 ? (
          cart.map((cartItem) => (
            <div
              key={cartItem.cartId}
              className="bg-white shadow-lg rounded-xl p-6 mb-6 flex items-center justify-between gap-6"
            >
              {/* Cart Item Image */}
              <img
                src={cartItem.image || "https://via.placeholder.com/150"}
                alt={cartItem.name}
                className="w-32 h-32 object-cover rounded-lg shadow-md"
              />

              {/* Cart Item Details */}
              <div className="flex-grow">
                <p className="text-xl font-semibold text-gray-800">{cartItem.name}</p>
                <p className="text-gray-600 text-sm">Price: <span className="font-semibold">${cartItem.price}</span></p>
                <p className="text-gray-600 text-sm">Quantity: {cartItem.quantity}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItems(cartItem.cartId)}
                className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-lg text-center text-gray-600">Your cart is empty!</p>
        )}
      </div>

      {/* Empty Cart Message */}
      <div className="max-w-6xl mx-auto px-4 mt-8 text-center">
        {cart.length === 0 && (
          <p className="text-xl font-semibold text-gray-700">There are no items in your cart. Please add some products.</p>
        )}
      </div>

      {/* Shipping Button */}
      <div className="mt-6 text-center">
        <Link to="/shipping" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
          Go to Shipping
        </Link>
      </div>
    </div>
  );
};
