import { useForm } from "react-hook-form";
import useStore from "../store/products";
import vine from "@vinejs/vine";
import { vineResolver } from "@hookform/resolvers/vine";
import { useState } from "react";

// Define validation schema using vine
const schema = vine.compile(
  vine.object({
    city: vine.string(),
    state: vine.string(),
    country: vine.string(),
  })
);

const Shipping = () => {
  const { cart, getTotalPrice, removeItemFromCart } = useStore(); // Zustand store for cart
  const [orderDetails, setOrderDetails] = useState(null); // Store order details

  const totalPrice = getTotalPrice(); // Compute the total price

  const { register, handleSubmit, formState, getValues } = useForm({
    resolver: vineResolver(schema),
  });

  const onSubmit = () => {
    try {
      // Fetch shipping details from form values
      const { city, state, country } = getValues();

      // Set order details including cart and form data
      setOrderDetails({
        shipping: { city, state, country },
        cart,
        totalPrice,
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {/* Shipping Form */}
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              name="city"
              placeholder="City"
              {...register("city")}
              className="w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              name="state"
              placeholder="State"
              {...register("state")}
              className="w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              name="country"
              placeholder="Country"
              {...register("country")}
              className="w-full p-2 border-2 border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Cart Details */}
      <div className="space-y-4">
        {cart.map((cartItem) => (
          <div key={cartItem.cartId} className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span>
                {cartItem.name} - ${cartItem.price} x {cartItem.quantity}
              </span>
              <button
                onClick={() => removeItemFromCart(cartItem.cartId)}
                className="text-red-600 hover:text-red-800"
              >
                Remove from cart
              </button>
            </div>
            <img
              src={cartItem.image}
              width={200}
              height={120}
              alt={cartItem.name}
              className="rounded-md shadow-sm"
            />
          </div>
        ))}
        <div className="font-medium text-lg mt-4">Total Price: ${totalPrice}</div>
      </div>

      {/* Order Summary (Display after submission) */}
      {orderDetails && (
        <div className="col-span-2 bg-gray-50 p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <h3 className="font-medium">Shipping Details:</h3>
          <p>City: {orderDetails.shipping.city}</p>
          <p>State: {orderDetails.shipping.state}</p>
          <p>Country: {orderDetails.shipping.country}</p>

          <h3 className="font-medium mt-4">Cart Details:</h3>
          <ul className="space-y-2">
            {orderDetails.cart.map((item) => (
              <li
                key={item.cartId}
                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <span>
                  {item.name} - ${item.price} x {item.quantity}
                </span>
                <img
                  src={item.image}
                  width={50}
                  height={50}
                  alt={item.name}
                  className="rounded-md shadow-sm"
                />
              </li>
            ))}
          </ul>
          <p className="text-right font-bold mt-4">
            Total Price: ${orderDetails.totalPrice}
          </p>
        </div>
      )}
    </div>
  );
};

export default Shipping;
