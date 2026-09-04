// Same account/preset the mobile apps already use (EXPO_PUBLIC_CLOUDINARY_*
// in client-app/.env) — unsigned presets are origin-agnostic, so this is
// safe to share. Falls back to those values directly so attachment upload
// works without a separate Vercel env var configuration step, same
// pattern as NEXT_PUBLIC_API_URL's fallback in lib/fetch-client.ts. Still
// overridable via env vars if a dedicated web account is ever wanted.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "annvck7c"
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "id_quickhands_now"

export interface UploadedFile {
  url: string
  name: string
}

/**
 * Uploads a file straight to Cloudinary from the browser using an unsigned
 * upload preset — no backend involvement, same account/preset the mobile
 * apps already use (unsigned presets are origin-agnostic). Direct browser
 * port of client-app/lib/cloudinaryUpload.ts — a real browser File is
 * already a valid FormData part, so no {uri,name,type} shim is needed the
 * way React Native requires.
 */
export async function uploadToCloudinary(
  file: File,
  options: { resourceType?: "image" | "auto" } = {}
): Promise<UploadedFile> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env."
    )
  }

  const resourceType = options.resourceType || "auto"

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", UPLOAD_PRESET)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  if (!response.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Failed to upload file")
  }

  return { url: data.secure_url as string, name: file.name }
}
