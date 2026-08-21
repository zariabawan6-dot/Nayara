// migrate.js - Run once: node migrate.js
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import * as dotenv from "dotenv";

dotenv.config();

// --- CONFIG ---
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/products`;

// --- HELPERS ---
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploadToCloudinary = (url, publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      url,
      {
        public_id: publicId,
        folder: "nayara-products",
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
  });
};

// --- MAIN MIGRATION ---
const migrate = async () => {
  console.log("🚀 Starting Cloudinary migration...\n");

  // 1. Fetch all image records from Supabase
  const { data: images, error } = await supabase
    .from("product_images")
    .select("id, file_path, product_id");

  if (error) {
    console.error("❌ Failed to fetch images:", error.message);
    process.exit(1);
  }

  console.log(`📦 Found ${images.length} images to migrate\n`);

  let success = 0;
  let failed = 0;
  const failedImages = [];

  // 2. Loop through each image
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const { id, file_path } = image;

    // Skip already migrated (Cloudinary URLs start with https://res.cloudinary.com)
    if (file_path.startsWith("https://res.cloudinary.com")) {
      console.log(`⏭️  [${i + 1}/${images.length}] Already migrated: ${file_path}`);
      success++;
      continue;
    }

    const supabaseUrl = `${SUPABASE_STORAGE_URL}/${file_path}`;
    const publicId = file_path.replace(/\.[^/.]+$/, ""); // Remove extension

    try {
      console.log(`⬆️  [${i + 1}/${images.length}] Uploading: ${file_path}`);

      // 3. Upload to Cloudinary directly from Supabase URL
      const result = await uploadToCloudinary(supabaseUrl, publicId);

      // 4. Update DB with new Cloudinary URL
      const { error: updateError } = await supabase
        .from("product_images")
        .update({ file_path: result.secure_url })
        .eq("id", id);

      if (updateError) throw updateError;

      console.log(`✅ Done: ${result.secure_url}`);
      success++;

      // Small delay to avoid rate limiting
      await sleep(200);
    } catch (err) {
      console.error(`❌ Failed: ${file_path} — ${err.message}`);
      failed++;
      failedImages.push(file_path);
      await sleep(500);
    }
  }

  // 5. Summary
  console.log("\n==========================================");
  console.log(`✅ Successfully migrated: ${success}/${images.length}`);
  console.log(`❌ Failed: ${failed}`);
  if (failedImages.length > 0) {
    console.log("\nFailed images:");
    failedImages.forEach((f) => console.log(`  - ${f}`));
  }
  console.log("==========================================");
  console.log("\n🎉 Migration complete!");
};

migrate();