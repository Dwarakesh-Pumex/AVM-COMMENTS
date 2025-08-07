/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect, useCallback } from "react";
import "./AttachmentInput.css";
import {
  CloudUpload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCcw,
  Upload,
} from "lucide-react";
import type { UploadAttachmentResponse } from "../../../../types/incidents";
import { uploadIncidentAttachment } from "../../../../apis/incidents";

/* ---------------------------------- Types --------------------------------- */
export type UploadStatus = "staged" | "uploading" | "success" | "error";

export interface AttachmentInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadComplete?: (results: {
    successes: UploadAttachmentResponse[];
    failures: { file?: File; error: unknown }[];
  }) => void;
  onStagedChange?: (items: PreviewItem[]) => void;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  multiple?: boolean;
  className?: string;
  uploadButtonLabel?: string;
  parallel?: boolean;
  defaultValue?: string[];
}

export interface StoredUpload {
  url: string;
  id?: string;
  fileName?: string;
  size?: number;
  uploadedAt: string;
}

export interface PreviewItem {
  file?: File;
  previewUrl: string;
  isObjectUrl: boolean;
  stored: StoredUpload | null;
  status: UploadStatus;
  progress: number;
  error?: unknown;
}

const STORAGE_KEY = "incident-uploaded-files-draft";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

/* ------------------------------- helpers ---------------------------------- */
function toStoredUpload(u: UploadAttachmentResponse): StoredUpload {
  const anyU = u as any;
  return {
    url: anyU.url || anyU.fileUrl || "",
    id: anyU.id,
    fileName: anyU.fileName || anyU.name || undefined,
    size: typeof anyU.size === "number" ? anyU.size : undefined,
    uploadedAt: new Date().toISOString(),
  };
}

function isImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(
    (url.split("?")[0] || "").trim()
  );
}

/* -------------------------------------------------------------------------- */
const AttachmentInput: React.FC<AttachmentInputProps> = ({
  onChange,
  onUploadComplete,
  onStagedChange,
  defaultValue,
  id,
  disabled = false,
  required = false,
  accept = ".jpg,.jpeg,.png",
  multiple = false,
  className,
  uploadButtonLabel = "Upload All",
  parallel = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ---------------- Restore successful uploads from sessionStorage -------- */
  useEffect(() => {
    try {
      const restoredItems: PreviewItem[] = [];

      // 1. Load from sessionStorage
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: unknown = JSON.parse(raw);
        if (Array.isArray(stored)) {
          restoredItems.push(
            ...stored.map(
              (s: any): PreviewItem => ({
                file: undefined,
                previewUrl: isImageUrl(s?.url) ? String(s.url) : "",
                isObjectUrl: false,
                stored: {
                  url: String(s?.url || ""),
                  id: s?.id ? String(s.id) : undefined,
                  fileName: s?.fileName ? String(s.fileName) : undefined,
                  size: typeof s?.size === "number" ? s.size : undefined,
                  uploadedAt: s?.uploadedAt
                    ? String(s.uploadedAt)
                    : new Date().toISOString(),
                },
                status: "success",
                progress: 100,
              })
            )
          );
        }
      }

      // 2. Load from defaultValue
      if (defaultValue?.length) {
        restoredItems.push(
          ...defaultValue.map(
            (url): PreviewItem => ({
              file: undefined,
              previewUrl: isImageUrl(url) ? url : "",
              isObjectUrl: false,
              stored: {
                url,
                uploadedAt: new Date().toISOString(),
              },
              status: "success",
              progress: 100,
            })
          )
        );
      }

      if (restoredItems.length) {
        setItems(restoredItems);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.warn("[AttachmentInput] restore failed", err);
    }
  }, [defaultValue]);

  /* ---------------- Persist successful uploads whenever items change ------- */
  useEffect(() => {
    const storedOnly: StoredUpload[] = items
      .filter((i) => i.status === "success" && i.stored)
      .map((i) => i.stored as StoredUpload);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storedOnly));
    } catch (err) {
      console.warn("[AttachmentInput] persist failed", err);
    }
    onStagedChange?.(items);
  }, [items, onStagedChange]);

  /* ---------------- Cleanup object URLs on unmount ------------------------- */
  useEffect(() => {
    return () => {
      items.forEach((i) => {
        if (i.isObjectUrl && i.previewUrl) {
          try {
            URL.revokeObjectURL(i.previewUrl);
          } catch {
            /* ignore */
          }
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const latestItemsRef = useRef<PreviewItem[]>(items);
  useEffect(() => {
    latestItemsRef.current = items;
  }, [items]);

  /* ---------------- Derived booleans -------------------------------------- */
  const anyUploading = items.some((i) => i.status === "uploading");
  const showUploadAll = items.some(
    (i) => i.status === "staged" || i.status === "error"
  );
  const current = items[currentIndex];
  const showRetry = current?.status === "error";

  /* ---------------- file browse trigger ----------------------------------- */
  const handleBrowseClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  /* ---------------- stage new files (no upload yet) ------------------------ */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);

      const fileList = e.target.files;
      if (!fileList || fileList.length === 0) return;

      const files = Array.from(fileList);

      const validFiles: File[] = [];
      const rejectedFiles: { file: File; reason: string }[] = [];

      files.forEach((file) => {
        const isImage = file.type.startsWith("image/");
        const isWithinSize = file.size <= MAX_FILE_SIZE;

        if (!isImage) {
          rejectedFiles.push({ file, reason: "Not an image file" });
          return;
        }
        if (!isWithinSize) {
          rejectedFiles.push({ file, reason: "File size exceeds 25MB" });
          return;
        }
        validFiles.push(file);
      });

      if (rejectedFiles.length > 0) {
        console.warn(
          "[AttachmentInput] Some files were rejected:",
          rejectedFiles
        );
        // You could also show a UI alert/toast here
      }

      const newItems: PreviewItem[] = files.map((file) => {
        const isImg = file.type.startsWith("image/");
        const blobUrl = isImg ? URL.createObjectURL(file) : "";
        return {
          file,
          previewUrl: blobUrl,
          isObjectUrl: isImg,
          stored: null,
          status: "staged",
          progress: 0,
        };
      });

      setItems((prev) => {
        const merged = [...prev, ...newItems];
        // If we previously had no items, ensure index=0.
        if (!prev.length && newItems.length) {
          setCurrentIndex(0);
        }
        return merged;
      });

      // reset <input> so selecting same file again works
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onChange]
  );

  /* ---------------- upload logic ------------------------------------------ */
  const uploadOne = useCallback(
    async (
      idx: number
    ): Promise<{
      success?: UploadAttachmentResponse;
      failure?: { file?: File; error: unknown };
    }> => {
      // Snapshot the item at call-time; don't rely on closure after awaits.
      const snapshot = items[idx];
      if (!snapshot) {
        return { failure: { error: new Error("No item"), file: undefined } };
      }
      if (!snapshot.file) {
        // Already uploaded (restored) or missing file; treat as success passthrough.
        if (snapshot.stored) {
          return {
            success: snapshot.stored as unknown as UploadAttachmentResponse,
          };
        }
        return {
          failure: { file: undefined, error: new Error("No file to upload") },
        };
      }

      setItems((prev) =>
        prev.map((p, i) =>
          i === idx
            ? { ...p, status: "uploading", progress: 0, error: undefined }
            : p
        )
      );

      try {
        const res = await uploadIncidentAttachment(
          snapshot.file,
          (pct: number) => {
            setItems((prev) =>
              prev.map((p, i) =>
                i === idx
                  ? { ...p, progress: Math.max(0, Math.min(100, pct)) }
                  : p
              )
            );
          }
        );

        const stored = toStoredUpload(res);
        const previewUrl =
          snapshot.previewUrl || (isImageUrl(stored.url) ? stored.url : "");

        setItems((prev) =>
          prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  stored,
                  status: "success",
                  progress: 100,
                  previewUrl,
                  // keep local file ref to allow re-upload? Could null to save memory.
                }
              : p
          )
        );

        return { success: res };
      } catch (err) {
        console.error("upload failed", err);
        setItems((prev) =>
          prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  status: "error",
                  error: err,
                  progress: p.progress ?? 0,
                }
              : p
          )
        );
        return { failure: { file: snapshot.file, error: err } };
      }
    },
    [items]
  );

  const handleUploadAll = useCallback(async () => {
    const targetIdxs = items
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.status === "staged" || it.status === "error")
      .map(({ i }) => i);

    if (!targetIdxs.length) return;

    const successes: UploadAttachmentResponse[] = [];
    const failures: { file?: File; error: unknown }[] = [];

    if (parallel) {
      const results = await Promise.all(targetIdxs.map((i) => uploadOne(i)));
      for (const r of results) {
        if (r.success) successes.push(r.success);
        if (r.failure) failures.push(r.failure);
      }
    } else {
      for (const i of targetIdxs) {
        const r = await uploadOne(i);
        if (r.success) successes.push(r.success);
        if (r.failure) failures.push(r.failure);
      }
    }

    onUploadComplete?.({ successes, failures });
  }, [items, parallel, uploadOne, onUploadComplete]);

  const handleRetryCurrent = useCallback(async () => {
    if (!items.length) return;
    const cur = items[currentIndex];
    if (!cur || cur.status !== "error") return;
    await handleUploadAll(); // simplest: call batch uploader (will pick up error items)
  }, [items, currentIndex, handleUploadAll]);

  /* ---------------- nav ---------------------------------------------------- */
  const handleNext = useCallback(() => {
    setCurrentIndex((i) => (items.length ? (i + 1) % items.length : 0));
  }, [items.length]);
  const handlePrev = useCallback(() => {
    setCurrentIndex((i) =>
      items.length ? (i - 1 + items.length) % items.length : 0
    );
  }, [items.length]);

  /* ---------------- delete ------------------------------------------------- */
  const handleDelete = useCallback(async () => {
    if (!items.length) return;
    const removed = items[currentIndex];

    // API delete only if successfully uploaded and has id
    if (removed.status === "success" && removed.stored?.id) {
      try {
        await fetch(
          `/api/attachments/${encodeURIComponent(removed.stored.id)}`,
          { method: "DELETE" }
        );
      } catch (error) {
        console.error("Failed to delete attachment:", error);
      }
    }

    // Clean up local object URL
    if (removed.isObjectUrl && removed.previewUrl) {
      try {
        URL.revokeObjectURL(removed.previewUrl);
      } catch {
        /* ignore */
      }
    }

    setItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== currentIndex);
      const newIdx = updated.length
        ? Math.min(currentIndex, updated.length - 1)
        : 0;
      setCurrentIndex(newIdx);
      return updated;
    });
  }, [items, currentIndex]);

  /* ---------------- Render ------------------------------------------------- */
  return (
    <div className="attachment-input-root">
      {/* hidden input */}
      <input
        className={`attachment-input ${className || ""}`}
        type="file"
        id={id}
        onChange={handleFileChange}
        disabled={disabled}
        required={required}
        accept={accept}
        multiple={multiple}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      {/* no items yet -> upload state */}
      {!items.length ? (
        <div
          className="attachment-input-wrapper"
          role="button"
          tabIndex={0}
          onClick={handleBrowseClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleBrowseClick();
          }}
        >
          <div className="attachment-overlay">
            <CloudUpload className="attachment-upload-icon" />
            <p className="attachment-title">Drop file or browse</p>
            <p className="attachment-info">
              Format: jpg, .png &amp; Max file size 25 MB
            </p>
            <button
              type="button"
              className="browse-btn"
              disabled={disabled}
              aria-label="Browse files to attach"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          {/* preview */}
          {current?.previewUrl ? (
            <img
              src={current.previewUrl}
              alt={
                current?.stored?.fileName ||
                current?.file?.name ||
                "Attachment preview"
              }
              className="preview-image"
            />
          ) : (
            <div className="non-image-preview">
              <span>
                {current?.stored?.fileName ||
                  current?.file?.name ||
                  "Attachment"}
              </span>
            </div>
          )}

          {/* status + progress */}
          <div
            className={`attachment-status-line status-${
              current?.status || "none"
            }`}
          >
            {current?.status === "staged" && <span>Ready to upload</span>}
            {current?.status === "uploading" && (
              <span>Uploading… {Math.round(current.progress)}%</span>
            )}
            {current?.status === "success" && <span>Uploaded</span>}
            {current?.status === "error" && (
              <span className="attachment-error-text">Upload failed</span>
            )}
          </div>
          {current?.status === "uploading" && (
            <progress
              className="attachment-progress"
              max={100}
              value={current.progress}
            />
          )}

          {/* controls */}
          <div className="preview-controls">
            <button
              onClick={handlePrev}
              disabled={items.length < 2}
              type="button"
              aria-label="Previous attachment"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={handleBrowseClick}
              type="button"
              aria-label="Add more files"
            >
              <Plus color="blue" />
            </button>
            <button
              onClick={handleDelete}
              type="button"
              aria-label="Delete current attachment"
            >
              <Trash2 color="#E33326" />
            </button>
            <button
              onClick={handleNext}
              disabled={items.length < 2}
              type="button"
              aria-label="Next attachment"
            >
              <ChevronRight />
            </button>
          </div>

          
          {(showUploadAll || showRetry) && (
            <div className="attachment-upload-actions">
              {showUploadAll && (
                <button
                  type="button"
                  className="upload-all-btn"
                  onClick={handleUploadAll}
                  disabled={disabled || anyUploading}
                >
                  <Upload size={16} /> {uploadButtonLabel}
                </button>
              )}
              {showRetry && (
                <button
                  type="button"
                  className="upload-retry-btn"
                  onClick={handleRetryCurrent}
                  disabled={disabled || anyUploading}
                >
                  <RefreshCcw size={16} /> Retry
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentInput;
