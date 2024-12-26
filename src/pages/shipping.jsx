import { useForm } from "react-hook-form";
import useStore from "../store/products";
import vine from "@vinejs/vine";
import { vineResolver } from "@hookform/resolvers/vine";
import { useState } from "react";
import { axiosInstance } from "../client/api";
import { useNavigate } from "react-router-dom";

// Validation schema
const schema = vine.compile(
  vine.object({
    city: vine.string(),
    state: vine.string(),
    country: vine.string(),
  })
);

const Shipping = () => {
  const { cart, getTotalPrice, removeItemFromCart } = useStore(); // Zustand
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null); // Local state

  const totalPrice = getTotalPrice(); // Compute total price
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: vineResolver(schema),
  });
  const onSubmit = async () => {
    try {
      // Validate that cart has items
      if (cart.length === 0) {
        console.error("Cart is empty. Cannot place order.");
        return;
      }
  
      // Prepare order items
      const orderItems = cart.map((item) => ({
        price: item.price,
        quantity: item.quantity,
        productId: item.productId,
      }));
  
      // Validate that all required fields exist in form values
      const { city, state, country } = getValues();
      if (!city || !state || !country) {
        console.error("Incomplete address fields. All fields are required.");
        return;
      }
  
      // Build deliveryAddress
      const deliveryAddress = `${city}, ${state}, ${country}`;
  
      // Log the data to ensure it's correct before sending
      console.log("Delivery Address:", deliveryAddress);
      console.log("Order Items:", JSON.stringify(orderItems, null, 2));
      console.log("Total Price:", totalPrice);
  
      // Send request to the server
      const response = await axiosInstance.post("/orders/create", {
        deliveryAddress,
        totalPrice: parseFloat(totalPrice), // Convert to number
        orderItems, // Ensure this is sent with proper keys
      });
  
      // Redirect to checkout page on success
      navigate("/checkout", {
        state: {
          clientSecret: response.data.clientSecret,
        }
      });
  
      // Update state for order details
      setOrderDetails({
        shipping: { city, state, country },
        cart,
        totalPrice: parseFloat(totalPrice),
      });
    } catch (error) {
      // Log server or validation errors for debugging
      if (error.response) {
        console.error("Server Validation Error:", error.response.data);
      } else if (error.request) {
        console.error("No response received from server:", error.request);
      } else {
        console.error("Unexpected Error:", error.message);
      }
    }
  };
  
  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">Shipping Information</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              name="city"
              placeholder="City"
              {...register("city")}
              className={`w-full p-2 border-2 rounded ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">City is required (Max: 10 chars).</p>
            )}
          </div>
          <div>
            <input
              name="state"
              placeholder="State"
              {...register("state")}
              className={`w-full p-2 border-2 rounded ${
                errors.state ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.state && (
              <p className="text-red-500 text-sm">State is required (Max: 10 chars).</p>
            )}
          </div>
          <div>
            <input
              name="country"
              placeholder="Country"
              {...register("country")}
              className={`w-full p-2 border-2 rounded ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">Country is required (Max: 10 chars).</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Your Cart - ${totalPrice}</h2>
        {cart.map((item) => (
          <div key={item.cartId} className="border-b p-2">
            {item.name} - ${item.price} x {item.quantity}
            <br />
            <img src={item.image} alt={item.name}  />
            <button
              onClick={() => removeItemFromCart(item.cartId)}
              className="text-red-500 underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {orderDetails && (
        <div className="col-span-2 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <p>City: {orderDetails.shipping.city}</p>
          <p>State: {orderDetails.shipping.state}</p>
          <p>Country: {orderDetails.shipping.country}</p>
          <h3>Total: ${orderDetails.totalPrice}</h3>
        </div>
      )}
    </div>
  );
};

export default Shipping;
