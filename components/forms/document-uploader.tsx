"use client";

import { useState, useRef } from "react";
import { saveSubmissionAction } from "@/lib/actions/submissions";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing-client";
import type { DocumentType } from "@/lib/types";

interface DocumentUploaderProps {
  documentType: DocumentType;
  semesterId: string;
}

export function DocumentUploader({ documentType, semesterId }: DocumentUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("documentUploader", {
    onClientUploadComplete: async (res) => {
      if (!res || res.length === 0) {
        setError("Upload gagal - tidak ada file yang diterima");
        return;
      }

      const file = res[0];
      const result = await saveSubmissionAction(
        file.ufsUrl,
        file.key,
        documentType,
        semesterId
      );

      if (!result.success) {
        setError(result.error || "Gagal menyimpan dokumen");
      } else {
        router.refresh();
      }
    },
    onUploadError: () => {
      setError("Gagal mengunggah dokumen");
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    try {
      await startUpload([file]);
    } catch {
      // Error is handled by onUploadError callback
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
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
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
