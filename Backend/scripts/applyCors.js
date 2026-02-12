/**
 * Script to apply CORS configuration to a GCS bucket
 * Run: node scripts/applyCors.js
 */

const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

function getCredentialsJsonFromEnv() {
  const raw =
    process.env.GCS_CREDENTIALS ||
    process.env.GCP_SA_JSON ||
    (process.env.GCP_SA_JSON_B64
      ? Buffer.from(process.env.GCP_SA_JSON_B64, "base64").toString("utf8")
      : null);

  return raw;
}

async function applyCors() {
  try {
    const { GCS_PROJECT_ID, GCS_BUCKET_NAME, GCS_KEY_FILE } = process.env;

    if (!GCS_PROJECT_ID || !GCS_BUCKET_NAME) {
      console.error("❌ Error: GCS_PROJECT_ID and GCS_BUCKET_NAME must be set in env/.env");
      process.exit(1);
    }

    // Initialize GCS config
    const storageConfig = { projectId: GCS_PROJECT_ID };

    // Priority:
    // 1) Key file path (local dev / VM)
    // 2) JSON creds via env (Fly secret)
    // 3) GOOGLE_APPLICATION_CREDENTIALS (default ADC)
    if (GCS_KEY_FILE) {
      storageConfig.keyFilename = path.resolve(GCS_KEY_FILE);
      console.log("[GCS] Using key file:", storageConfig.keyFilename);
    } else {
      const credsJson = getCredentialsJsonFromEnv();

      if (credsJson) {
        try {
          storageConfig.credentials = JSON.parse(credsJson);
          console.log("[GCS] Using credentials from env (GCS_CREDENTIALS/GCP_SA_JSON/GCP_SA_JSON_B64)");
        } catch (err) {
          console.error("❌ Error: Failed to parse credentials JSON from env:", err.message);
          process.exit(1);
        }
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.log("[GCS] Using GOOGLE_APPLICATION_CREDENTIALS (Application Default Credentials)");
        // No change needed; google lib will pick it up
      } else {
        console.error(
          "❌ Error: No GCS credentials found.\n" +
            "Set one of:\n" +
            " - GCS_KEY_FILE (path to JSON key)\n" +
            " - GCS_CREDENTIALS (full JSON string)\n" +
            " - GCP_SA_JSON (full JSON string)\n" +
            " - GCP_SA_JSON_B64 (base64 of JSON)\n" +
            " - GOOGLE_APPLICATION_CREDENTIALS (ADC path)"
        );
        process.exit(1);
      }
    }

    const storage = new Storage(storageConfig);
    const bucket = storage.bucket(GCS_BUCKET_NAME);

    // Read CORS config
    const corsFilePath = path.join(__dirname, "..", "gcs-cors.json");
    if (!fs.existsSync(corsFilePath)) {
      console.error(`❌ Error: CORS config file not found: ${corsFilePath}`);
      process.exit(1);
    }

    const corsConfig = JSON.parse(fs.readFileSync(corsFilePath, "utf8"));
    console.log("📋 CORS Configuration:");
    console.log(JSON.stringify(corsConfig, null, 2));

    // Apply CORS
    console.log(`\n🔄 Applying CORS configuration to bucket: ${GCS_BUCKET_NAME}...`);
    await bucket.setCorsConfiguration(corsConfig);

    console.log("✅ CORS configuration applied successfully!");
    console.log("\n📝 Next steps:");
    console.log("1. If you need PUBLIC access, ensure bucket/IAM allows it (or use Signed URLs).");
    console.log("2. Test video playback in your frontend.");
    console.log("3. If you see CORS issues, re-check allowed origins/methods/headers in gcs-cors.json.");
  } catch (err) {
    console.error("❌ Error applying CORS:", err.message);
    if (err.code === 403) {
      console.error("\n💡 Tip: Make sure your service account has 'Storage Admin' (or storage.buckets.update) permission.");
    }
    process.exit(1);
  }
}

applyCors();
