"use client"

import { useRef, useState } from "react"
import { Loader2, Paperclip, X } from "lucide-react"
import { uploadToCloudinary } from "@/lib/cloudinary"

interface AttachedFile {
  url: string
  name: string
}

export function AttachmentPicker({
  documents,
  onChange,
  onUploadingChange,
}: {
  documents: string[]
  onChange: (documents: string[]) => void
  onUploadingChange: (uploading: boolean) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<AttachedFile[]>([])
  const [uploadingCount, setUploadingCount] = useState(0)

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const selected = Array.from(fileList)

    setUploadingCount((c) => c + selected.length)
    onUploadingChange(true)

    const results = await Promise.allSettled(
      selected.map((file) =>
        uploadToCloudinary(file, { resourceType: file.type.startsWith("image/") ? "image" : "auto" })
      )
    )

    const uploaded: AttachedFile[] = []
    results.forEach((result) => {
      if (result.status === "fulfilled") {
        uploaded.push(result.value)
      } else {
        console.error("[AttachmentPicker] Upload failed:", result.reason)
      }
    })

    setFiles((current) => {
      const next = [...current, ...uploaded]
      onChange(next.map((f) => f.url))
      return next
    })

    setUploadingCount((c) => {
      const next = c - selected.length
      if (next <= 0) onUploadingChange(false)
      return Math.max(0, next)
    })
  }

  const removeFile = (url: string) => {
    setFiles((current) => {
      const next = current.filter((f) => f.url !== url)
      onChange(next.map((f) => f.url))
      return next
    })
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Paperclip className="h-4 w-4" />
        Add photos or documents
      </button>

      {uploadingCount > 0 || files.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={file.url}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
            >
              {file.name}
              <button type="button" onClick={() => removeFile(file.url)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {uploadingCount > 0 ? (
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading {uploadingCount}…
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
