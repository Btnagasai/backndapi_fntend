// src/pages/Home.js
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store/products"; // Zustand store for managing cart
import { axiosInstance } from "../client/api"; // Axios instance for fetching data

function Home() {
  const [products, setProducts] = useState([]); // State to store products
  const { cart, incrementCartItems, decrementCartItems, getTotalPrice, removeItems } = useStore(); // Cart actions from Zustand store
  const navigate = useNavigate(); // For navigation

  // Fetch products from the server
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch products when component mounts
  }, []); // Empty dependency array to run on mount

  const totalPrice = getTotalPrice(); // Get total price of items in the cart

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      {/* Cart Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          cart.map((cartItem) => (
            <div key={cartItem.cartId} className="flex justify-between items-center border-b py-4">
              <div className="flex items-center gap-4">
                <img
                  src={cartItem.image || "https://via.placeholder.com/150"} // Fallback image if no image is available
                  alt={cartItem.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{cartItem.name}</p>
                  <p className="text-gray-600">Price: ${cartItem.price}</p>
                  <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => removeItems(cartItem.cartId)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none transition duration-200"
              >
                Remove
              </button>
            </div>
          ))
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="mt-4 text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total Items: {cart.length}
            </p>
            <p className="text-xl font-semibold text-gray-800">Total Price: ${totalPrice}</p>
          </div>
        )}
      </div>

      {/* Product Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link to={`/products/${product.id}`} className="block text-center mb-4">
              <img
                src={product.image || "https://via.placeholder.com/150"}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-800 font-semibold">{product.name}</p>
              <p className="text-gray-600">${product.price}</p>
            </Link>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => decrementCartItems(product.id)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none transition-all duration-200"
              >
                -
              </button>
              <button
                onClick={() =>
                  incrementCartItems(product.id, product.name, product.price, product.image, product.description)
                }
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none transition-all duration-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
