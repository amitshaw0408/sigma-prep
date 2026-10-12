import { v2 as cloudinary } from "cloudinary";
import { cfg } from "./config.js";

cloudinary.config(cfg.cloud);

// Uploads an image buffer; returns { url, id }. Images are resized (max 1000px wide) and optimised.
export const uploadImage = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `sigma-prep/${folder}`,
        resource_type: "image",
        transformation: [
          { width: 1000, crop: "limit", quality: "auto", fetch_format: "auto" },
        ],
      },
      (err, r) =>
        err ? reject(err) : resolve({ url: r.secure_url, id: r.public_id }),
    );
    stream.end(buffer);
  });

export const removeImage = async (id) => {
  if (!id) return;
  try {
    await cloudinary.uploader.destroy(id);
  } catch (e) {
    console.error("Cloudinary delete failed:", e.message);
  }
};
