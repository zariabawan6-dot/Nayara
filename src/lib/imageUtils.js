export const getOptimizedImageUrl = (filePath) => {
  if (!filePath) return "";
  if (filePath.startsWith("https://res.cloudinary.com")) return filePath;
  return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
};