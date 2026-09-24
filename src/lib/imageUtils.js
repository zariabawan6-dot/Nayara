

// export const getOptimizedImageUrl = (filePath, width = 500) => {
//   if (!filePath) return "";

//   if (filePath.startsWith("https://res.cloudinary.com")) {
//     return filePath.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
//   }

//   return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
// };



// storefront: src/lib/imageUtils.js
const SUPABASE_PUBLIC =
  "https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/";
const R2_HOST = "https://images.nayarazone.store/";

export const getOptimizedImageUrl = (filePath, width = 500) => {
  if (!filePath) return "";

  // New images on R2: every upload has a full file and a "_thumb.webp" copy
  if (filePath.startsWith(R2_HOST)) {
    return width <= 600 ? filePath.replace(/\.webp$/, "_thumb.webp") : filePath;
  }

  // Old Cloudinary images (still work if the account is active)
  if (filePath.startsWith("https://res.cloudinary.com")) {
    return filePath.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }

  // Any other full URL
  if (filePath.startsWith("https://")) return filePath;

  // Legacy Supabase storage path
  return `${SUPABASE_PUBLIC}${filePath}`;
};