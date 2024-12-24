import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      incrementCartItems: (id, name, price, image) => {
        const cart = get().cart;
        const itemIndex = cart.findIndex((item) => item.productId === id);

        if (itemIndex > -1) {
          cart[itemIndex].quantity += 1;
          set({ cart: [...cart] });
        } else {
          const newItem = {
            cartId: `cart-${id}`,
            productId: id,
            name,
            price,
            image,
            quantity: 1,
          };
          set({ cart: [...cart, newItem] });
        }
      },
      decrementCartItems: (id) => {
        const cart = get().cart.map((item) =>
          item.productId === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        set({ cart: cart.filter((item) => item.quantity > 0) });
      },
      removeItems: (id) => {
        const cart = get().cart.filter((item) => item.cartId !== id);
        set({ cart });
      },
      getTotalPrice: () => {
        return get()
          .cart.reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2);
      },
      getTotalCartItemsCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    { name: "cart-storage" }
  )
);

export default useStore;
