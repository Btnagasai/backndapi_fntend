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
  const { cart, getTotalPrice, removeItemFromCart } = useStore(); // Get required state and methods from Zustand store
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if the form is submitted

  const totalPrice = getTotalPrice(); // Compute the total price

  const { register, handleSubmit, formState, getValues } = useForm({
    resolver: vineResolver(schema),
  });

  const onSubmit = async () => {
    try {
      const { city, state, country } = getValues();
      setFormSubmitted(true); // Set form as submitted
    } catch (error) {
      console.log("error in onSubmit", error);
      throw error;
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

        {formSubmitted && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
            <h3 className="font-medium">Shipping Details:</h3>
            <p>City: {getValues("city")}</p>
            <p>State: {getValues("state")}</p>
            <p>Country: {getValues("country")}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {cart.map((cartItem) => (
          <div key={cartItem.cartId} className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span>{cartItem.name} - ${cartItem.price} x {cartItem.quantity}</span>
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
    </div>
  );
};

export default Shipping;
