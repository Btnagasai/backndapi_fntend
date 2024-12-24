import { useForm } from "react-hook-form";
import { axiosInstance } from "../client/api";
import userStore from "../store/user";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Login from "./login";

export default function Register() {
  const { register, getValues, handleSubmit } = useForm();
  const { login, logOut, user } = userStore(); // Access the user store to check if the user is logged in
  const navigate = useNavigate(); // Initialize useNavigate

  // If the user is already logged in, navigate them to the login page
  if (user) {
    navigate("/login"); // Redirect to login page if user is logged in
    return null; // Prevent rendering the rest of the component
  }

  const onSubmit = async () => {
    try {
      const { email, password, name, image } = getValues();
      const response = await axiosInstance.post("/users/create", {
        email,
        password,
        name,
        image,
      });

      console.log("Logging in");
      console.log(response.data);

      // After successful registration, log in the user and store the token
      login(response.data.user, response.data.token);

      // Redirect to the home page after successful registration
      navigate(Login); // Redirect to home page
    } catch (error) {
      console.log("Error on fetching data", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Register</h2>

        {/* Registration Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Enter your name"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Image Field */}
          <div className="space-y-2">
            <label htmlFor="image" className="block text-sm font-medium text-gray-600">
              Profile Image URL
            </label>
            <input
              {...register("image")}
              type="text"
              id="image"
              placeholder="Enter image URL"
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-200"
          >
             <a href="/login" className="text-blue-500 hover:underline">
              Register
            </a>
          </button>
        </form>

        {/* Link to Login page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
