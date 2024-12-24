import { useEffect, useState } from "react";
import useStore from "../store/products"; // Zustand store for the cart
import { axiosInstance } from "../client/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const {
    cart,
    incrementCartItems,
    decrementCartItems,
    getTotalPrice,
    removeItems,
  } = useStore(); // Zustand store for the cart

  // Fetch products from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Cart Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-gray-700 font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decrementCartItems(item.productId)}
                      className="bg-gray-200 px-2 py-1 rounded-lg hover:bg-gray-300 text-gray-600"
                    >
                      -
                    </button>
                    <button
                      onClick={() => incrementCartItems(item.productId)}
                      className="bg-blue-500 px-2 py-1 rounded-lg text-white hover:bg-blue-600"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItems(item.cartId)}
                      className="bg-red-500 px-2 py-1 rounded-lg text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-right text-gray-700 font-semibold mt-4">
            Total Price: <span className="text-blue-500">${getTotalPrice()}</span>
          </p>
        </div>

        {/* Products Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
            >
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-700 hover:text-blue-500 mb-4 text-center">
                  {product.name}
                </h3>
                <img src={product.image} alt={product.image} />
              </Link>
              <button
                onClick={() =>
                  incrementCartItems(
                    product.id,
                    product.name,
                    product.price,
                    product.image
                  )
                }
                className="mt-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
