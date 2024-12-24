import { useForm } from "react-hook-form";
import { axiosInstance } from "../client/api";
import useUserStore from "../store/user";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { register, handleSubmit, getValues, formState } = useForm();
  const { logIn } = useUserStore(); // Zustand store
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const { email, password } = getValues(); // Get form values
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;

      logIn(user, token); // Save user and token in Zustand store

      navigate("/"); // Navigate to Home page after successful login
    } catch (error) {
      console.error("Error during login:", error); // Handle login errors
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {formState.errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-sm font-medium py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Login
        </button>
      </form>
    </div>
  );
}
