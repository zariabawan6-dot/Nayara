// src/lib/colors.js
// Shared helpers for product colour variants.
//
// A colour is stored inside products.colors (jsonb) like this:
// {
//   name: "Red",
//   image: "https://res.cloudinary.com/.../red.jpg",  // photo for this colour (or null)
//   price: null,            // null = same price as the product
//   discount_price: null,   // only used when price is set
//   out_of_stock: false
// }

export const COLOR_PRESETS = {
  Blue: "#2563EB",
  Red: "#DC2626",
  Black: "#111827",
  Green: "#16A34A",
  Beige: "#D9C7A5",
  Mustard: "#CA9A04",
  Yellow: "#FACC15",
  Pink: "#EC4899",
  White: "#FFFFFF",
  Maroon: "#7F1D1D",
  Navy: "#1E3A8A",
  Grey: "#9CA3AF",
  Brown: "#78350F",
  Purple: "#7C3AED",
  Peach: "#FDBA9B",
};

// Circle colour for a colour name. Custom ("Other") colours get a neutral grey.
export const swatchFor = (name) => COLOR_PRESETS[name] || "#E5E7EB";

// Price for a product, optionally for one specific colour.
// Falls back to the product price when the colour has no price of its own.
export const getPricing = (product, colorName) => {
  const variant = colorName
    ? (product.colors || []).find((c) => c.name === colorName)
    : null;
  const override = variant && variant.price != null;

  const price = Number(override ? variant.price : product.price);
  const sale = Number(
    override
      ? variant.discount_price ?? variant.price
      : product.discount_price ?? product.price
  );
  return { price, sale };
};

// Clean the colours right before saving to Supabase.
//  - urlMap:    { "new:abc123": "https://cloudinary..." } for photos uploaded in this save
//  - validKeys: (Edit page only) Set of existing image paths that are still kept
export const cleanColors = (colors = [], urlMap = {}, validKeys = null) =>
  colors.map((c) => {
    let image = c.image || null;

    if (image && urlMap[image]) {
      image = urlMap[image]; // newly uploaded photo -> real URL
    } else if (image && image.startsWith("new:")) {
      image = null; // that new photo was removed before saving
    } else if (image && validKeys && !validKeys.has(image)) {
      image = null; // that existing photo was deleted
    }

    return {
      name: c.name.trim(),
      image,
      price: c.price ?? null,
      discount_price: c.price != null ? c.discount_price ?? null : null,
      out_of_stock: !!c.out_of_stock,
    };
  });