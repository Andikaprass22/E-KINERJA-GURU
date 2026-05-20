"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { DocumentTypeLabel, type DocumentType, type SubmissionStatus } from "@/lib/types";
import { DocumentUploader } from "@/components/forms/document-uploader";

interface DocumentCardProps {
  documentType: DocumentType;
  submission: {
    id: string;
    fileUrl: string | null;
    fileKey: string | null;
    uploadedAt: Date | null;
    status: SubmissionStatus;
  } | null;
  deadline: Date | null;
  semesterId: string;
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          Selesai
        </span>
      );
    case "LATE":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
          <AlertTriangle className="h-3 w-3" />
          Terlambat
        </span>
      );
    case "MISSING":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
          <Clock className="h-3 w-3" />
          Belum Unggah
        </span>
      );
  }
}

function formatDeadline(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function getDaysRemaining(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function DocumentCard({ documentType, submission, deadline, semesterId }: DocumentCardProps) {
  const status: SubmissionStatus = submission?.status ?? "MISSING";
  const isUploaded = status === "COMPLETED" || status === "LATE";
  const daysRemaining = deadline ? getDaysRemaining(deadline) : null;
  const isPastDeadline = daysRemaining !== null && daysRemaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all ${
        isPastDeadline && !isUploaded ? "border-red-200" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-5 w-5 shrink-0 text-slate-400" />
          <span className="font-semibold text-sm text-slate-900 truncate">
            {DocumentTypeLabel[documentType]}
          </span>
        </div>
        <StatusBadge status={status} />
      </div>

      {deadline && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${isPastDeadline ? "text-red-600" : "text-slate-500"}`}>
          <Clock className="h-3 w-3" />
          <span>
            {isPastDeadline
              ? "Deadline terlewati"
              : `${daysRemaining} hari lagi`}
          </span>
          <span className="text-slate-400">({formatDeadline(deadline)})</span>
        </div>
      )}

      {isUploaded && submission?.uploadedAt && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <span>Diunggah {new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long", day: "numeric" }).format(submission.uploadedAt)}</span>
        </div>
      )}

      {isUploaded && submission?.fileUrl ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors"
          asChild
        >
          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" />
            Lihat Dokumen
          </a>
        </Button>
      ) : (
        <DocumentUploader documentType={documentType} semesterId={semesterId} />
      )}
    </motion.div>
  );
}
