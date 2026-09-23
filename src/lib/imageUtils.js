// export const getOptimizedImageUrl = (filePath) => {
//   if (!filePath) return "";
//   if (filePath.startsWith("https://res.cloudinary.com")) return filePath;
//   return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
// };

export const getOptimizedImageUrl = (filePath, width = 500) => {
  if (!filePath) return "";

  if (filePath.startsWith("https://res.cloudinary.com")) {
    return filePath.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  }

  return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
};