// src/context/cartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { fbTrack } from "../lib/fbPixel";

const CartContext = createContext();

// A cart line = same product + same size + same colour
const isSame = (item, id, size, color) =>
  item.id === id &&
  (item.size ?? null) === (size ?? null) &&
  (item.color ?? null) === (color ?? null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (!saved) return [];
      // Old cart items have no colour -> normalise to null
      return JSON.parse(saved).map((item) => ({
        ...item,
        size: item.size ?? null,
        color: item.color ?? null,
      }));
    } catch {
      return [];
    }
  });

  const [showCartFloat, setShowCartFloat] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add item (merge if same product AND same size AND same colour)
  const addToCart = (product, size = null, color = null) => {
    fbTrack("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.discount_price || product.price,
      currency: "PKR",
    });

    // The cart doesn't need the full colour list / raw image rows
    const { colors: _colors, product_images: _images, ...lean } = product;

    setCart((prev) => {
      const existing = prev.find((item) => isSame(item, product.id, size, color));
      if (existing) {
        return prev.map((item) =>
          isSame(item, product.id, size, color)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...lean, quantity: 1, size, color }];
    });
  };

  // Remove a line (must match id + size + colour)
  const removeFromCart = (id, size = null, color = null) => {
    setCart((prev) => prev.filter((item) => !isSame(item, id, size, color)));
  };

  // Update quantity (must match id + size + colour)
  const updateQuantity = (id, size, newQuantity, color = null) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        isSame(item, id, size, color) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartLength: cart?.length,
        showCartFloat,
        setShowCartFloat,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);










// // export const useCart = () => useContext(CartContext);
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { fbTrack } from "../lib/fbPixel";

// const CartContext = createContext();

// export function CartProvider({ children }) {
 

//   const [cart, setCart] = useState(() => {
//   const saved = localStorage.getItem("cart");
//   if (!saved) return [];
//   const parsed = JSON.parse(saved);
//   // Fix old cart items that have "Standard" size string → normalize to null
//   return parsed.map(item => ({
//     ...item,
//     // size: item.size === "Standard" ? null : item.size
//     size: item.size ?? null 
//   }));
// });

//   const [showCartFloat, setShowCartFloat] = useState(false);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // Add Item (Merge if same product AND same size)
//   const addToCart = (product, size = null) => {
//     fbTrack("AddToCart", {
//       content_ids: [product.id],
//       content_name: product.name,
//       content_type: "product",
//       value: product.discount_price || product.price,
//       currency: "PKR",
//     });
//     setCart((prev) => {
//       const existing = prev.find(
//         (item) => item.id === product.id && item.size === size
//       );
//       if (existing) {
//         return prev.map((item) =>
//           item.id === product.id && item.size === size
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { ...product, quantity: 1, size }];
//     });
//   };

  

//   const removeFromCart = (id, size = null) => {
//   setCart((prev) =>
//     prev.filter((item) => !(item.id === id && (item.size ?? null) === (size ?? null)))
//   );
// };

//   const updateQuantity = (id, size, newQuantity) => {
//   if (newQuantity < 1) return;
//   setCart((prev) =>
//     prev.map((item) =>
//       item.id === id && (item.size ?? null) === (size ?? null)
//         ? { ...item, quantity: newQuantity }
//         : item
//     )
//   );
// };



//   const clearCart = () => setCart([]);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         cartLength: cart?.length,
//         showCartFloat,        // 👈 add this
//         setShowCartFloat,     // 👈 add this
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => useContext(CartContext);
