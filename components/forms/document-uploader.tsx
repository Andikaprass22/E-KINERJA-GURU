"use client";

import { useState, useRef } from "react";
import { saveSubmissionAction } from "@/lib/actions/submissions";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DocumentType } from "@/lib/types";

interface DocumentUploaderProps {
  documentType: DocumentType;
  semesterId: string;
}

export function DocumentUploader({ documentType, semesterId }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploadthing", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data || !data.url || !data.key) {
        setError("Upload gagal - tidak ada file yang diterima");
        setUploading(false);
        return;
      }

      const result = await saveSubmissionAction(
        data.url,
        data.key,
        documentType,
        semesterId
      );

      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Gagal menyimpan dokumen");
      }
    } catch (err) {
      setError("Gagal mengunggah dokumen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        onChange={handleFileSelect}
      />
      <Button
        size="sm"
        className="w-full"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengunggah...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Unggah Dokumen
          </>
        )}
      </Button>
    </div>
  );
}
