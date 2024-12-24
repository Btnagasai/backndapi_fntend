import { Link, Outlet } from "react-router-dom";
import React from "react";
import userStore from "../store/user";
import useStore from "../store/products";

function LayOut() {
  const { user, logOut } = userStore();
  const { getTotalCartItemsCount } = useStore();

  const totalItemsInCart = getTotalCartItemsCount();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 shadow-md py-4">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* Logo / Home Link */}
            <Link to="/" className="text-white text-2xl font-semibold hover:text-blue-300 transition duration-200">
              Home
            </Link>
            {/* Cart Link */}
            <Link to="/cart" className="text-white text-lg hover:text-blue-300 transition duration-200">
              Cart
              {totalItemsInCart > 0 && (
                <span className="ml-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm">
                  {totalItemsInCart}
                </span>
              )}
             
            </Link>
          </div>

          {/* Authentication / LogOut */}
          <div className="flex items-center gap-6">
            {user ? 
              <button
                onClick={logOut}
                className="text-white font-semibold hover:text-blue-300 transition duration-200"
              >
                LogOut
              </button>
              :
              <Link to="/login" className="text-white font-semibold hover:text-blue-300 transition duration-200">
                Login
              </Link>
            }
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8 px-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

export default LayOut;
