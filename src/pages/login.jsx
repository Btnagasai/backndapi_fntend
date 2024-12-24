// src/pages/Login.js
import { useForm } from "react-hook-form";
import { axiosInstance } from "../client/api"; // Axios instance for fetching data
import useUserStore from "../store/user";
import { useNavigate } from "react-router-dom";
import vine from "@vinejs/vine";
import { vineResolver } from "@hookform/resolvers/vine";

const schema = vine.compile(
  vine.object({
    email: vine.string().email().minLength(1),
    password: vine.string().minLength(1),
  })
);

export default function Login() {
  const { register, handleSubmit, formState, getValues } = useForm({
    resolver: vineResolver(schema),
  });
  const { logIn, user } = useUserStore();
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const { email, password } = getValues();
      const response = await axiosInstance.post("/auth/login", { email, password });

      // Store user and token in Zustand store
      logIn(response.data.user, response.data.token);

      // Redirect to Home page
      navigate("/");
    } catch (error) {
      console.log("Error during login:", error);
    }
  };

  // If user is already logged in, redirect to Home
  if (user) {
    navigate("/");
    return null; // Don't render the login form if user is logged in
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formState.errors.email && <p className="text-red-500 text-xs">{formState.errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {formState.errors.password && <p className="text-red-500 text-xs">{formState.errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don`t have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a></p>
        </div>
      </div>
    </div>
  );
}
