"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, AlertTriangle, Upload } from "lucide-react";
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
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="h-3 w-3" />
          Selesai
        </Badge>
      );
    case "LATE":
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3" />
          Terlambat
        </Badge>
      );
    case "MISSING":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3" />
          Belum Unggah
        </Badge>
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
    >
      <Card className={isPastDeadline && !isUploaded ? "border-red-200 dark:border-red-900" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="font-medium text-sm truncate">
                {DocumentTypeLabel[documentType]}
              </span>
            </div>
            <StatusBadge status={status} />
          </div>

          {deadline && (
            <div className={`flex items-center gap-1.5 text-xs mb-3 ${isPastDeadline ? "text-red-600" : "text-muted-foreground"}`}>
              <Clock className="h-3 w-3" />
              <span>
                {isPastDeadline
                  ? "Deadline terlewati"
                  : `${daysRemaining} hari lagi`}
              </span>
              <span className="text-muted-foreground">({formatDeadline(deadline)})</span>
            </div>
          )}

          {isUploaded && submission?.uploadedAt && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              <span>Diunggah {new Intl.DateTimeFormat("id-ID", { year: "numeric", month: "long", day: "numeric" }).format(submission.uploadedAt)}</span>
            </div>
          )}

          {isUploaded && submission?.fileUrl ? (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                Lihat Dokumen
              </a>
            </Button>
          ) : (
            <DocumentUploader documentType={documentType} semesterId={semesterId} />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
