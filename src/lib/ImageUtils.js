// export const getOptimizedImageUrl = (filePath, width = 800, quality = 75) => {
//   if (!filePath) return "";

//   // Use original URL - render API having issues
//   return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
// };

export const getOptimizedImageUrl = (filePath, width = 800, quality = 75) => {
  if (!filePath) return "";

  const ext = filePath.split('.').pop().toLowerCase();
  const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'];

  if (supportedFormats.includes(ext)) {
    // Render API for optimization
    return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/render/image/public/products/${filePath}?width=${width}&quality=${quality}`;
  }

  // Fallback to original
  return `https://dioqjijhqewpznwxwqap.supabase.co/storage/v1/object/public/products/${filePath}`;
};