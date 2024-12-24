import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      logIn: (user, token) => {
        set({
          user,
          token,
        });
      },
      logOut: () => {
        set({
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "user-store", // Use a unique name for local storage
    }
  )
);

export default useUserStore;
