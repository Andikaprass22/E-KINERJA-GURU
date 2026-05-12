"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DocumentType } from "@/lib/types";
import { DocumentTypeLabel } from "@/lib/types";

interface DeadlineFormProps {
  semesterId: string;
  existingDeadlines?: {
    documentType: string;
    deadline: Date;
  }[];
}

export function DeadlineForm({ semesterId, existingDeadlines }: DeadlineFormProps) {
  const initialDeadlines: Record<DocumentType, Date> = {} as Record<DocumentType, Date>;
  if (existingDeadlines) {
    existingDeadlines.forEach((d) => {
      initialDeadlines[d.documentType as DocumentType] = d.deadline;
    });
  }
  const [deadlines, setDeadlines] = useState<Record<DocumentType, Date>>(initialDeadlines);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const documentTypes: DocumentType[] = [
    "RPP",
    "SYLLABUS",
    "LEARNING_ACHIEVEMENT",
    "TIME_ALLOCATION",
    "KKTP",
    "SEMESTER_PROGRAM",
    "ANNUAL_PROGRAM",
    "TEACHING_JOURNAL",
  ];

  const getDocumentLabel = (type: DocumentType): string => {
    return DocumentTypeLabel[type];
  };

  const handleDateChange = (documentType: DocumentType, value: string) => {
    setDeadlines((prev) => ({
      ...prev,
      [documentType]: new Date(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/semesters/update-deadline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semesterId,
          deadlines: deadlines,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal menyimpan deadline");
        setIsSaving(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Save deadline error:", err);
      setError("Terjadi kesalahan");
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {documentTypes.map((type) => (
        <div key={type} className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor={`deadline-${type}`}>
              {getDocumentLabel(type)}
            </Label>
            <Input
              id={`deadline-${type}`}
              type="datetime-local"
              value={deadlines[type]?.toISOString().slice(0, 16) || ""}
              onChange={(e) => handleDateChange(type, e.target.value)}
              className="w-full px-3 py-2 rounded-md border-input bg-background"
              required
            />
          </div>
        </div>
      ))}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 bg-red-50 p-3 rounded-md"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-600 bg-green-50 p-3 rounded-md"
        >
          Deadline berhasil disimpan!
        </motion.div>
      )}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Menyimpan..." : "Simpan Semua Deadline"}
      </Button>
    </form>
  );
}