"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  DocumentTypeLabel,
  type DocumentType,
  type SubmissionStatus,
} from "@/lib/types";
import type { TeacherSubmissionRow } from "@/lib/actions/admin";

interface AdminSubmissionsTableProps {
  rows: TeacherSubmissionRow[];
  documentTypes: DocumentType[];
}

function StatusIcon({ status }: { status: SubmissionStatus }) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "LATE":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "MISSING":
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function ProgressBadge({ completed, total }: { completed: number; total: number }) {
  const percentage = Math.round((completed / total) * 100);

  let variant: "default" | "secondary" | "destructive" = "secondary";
  if (percentage === 100) variant = "default";
  else if (percentage >= 50) variant = "secondary";
  else variant = "destructive";

  return (
    <Badge variant={variant}>
      {completed}/{total} ({percentage}%)
    </Badge>
  );
}

export function AdminSubmissionsTable({
  rows,
  documentTypes,
}: AdminSubmissionsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada data guru
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] sticky left-0 bg-background">
              Nama Guru
            </TableHead>
            {documentTypes.map((dt) => (
              <TableHead
                key={dt}
                className="text-center min-w-[80px]"
                title={DocumentTypeLabel[dt]}
              >
                <span className="text-xs">{dt}</span>
              </TableHead>
            ))}
            <TableHead className="text-center min-w-[100px] sticky right-0 bg-background">
              Progress
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <motion.tr
              key={row.teacherId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <TableCell className="font-medium sticky left-0 bg-background">
                {row.teacherName}
              </TableCell>
              {documentTypes.map((dt) => (
                <TableCell key={dt} className="text-center">
                  <div className="flex justify-center">
                    <StatusIcon status={row.submissions[dt]} />
                  </div>
                </TableCell>
              ))}
              <TableCell className="text-center sticky right-0 bg-background">
                <ProgressBadge
                  completed={row.completedCount}
                  total={documentTypes.length}
                />
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
