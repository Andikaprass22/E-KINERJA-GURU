"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "LATE":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "MISSING":
      return <Clock className="h-4 w-4 text-slate-400" />;
  }
}

function ProgressBadge({ completed, total }: { completed: number; total: number }) {
  const percentage = Math.round((completed / total) * 100);

  let colorClass = "bg-red-100 text-red-700";
  if (percentage === 100) colorClass = "bg-emerald-100 text-emerald-700";
  else if (percentage >= 50) colorClass = "bg-amber-100 text-amber-700";

  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {completed}/{total} ({percentage}%)
    </span>
  );
}

export function AdminSubmissionsTable({
  rows,
  documentTypes,
}: AdminSubmissionsTableProps) {
  if (rows.length === 0) {
    return (
      <Card className="border-slate-100 shadow-sm">
        <CardContent className="py-12 text-center text-slate-400">
          Belum ada data guru
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-slate-900">Status Upload Dokumen</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {rows.length} guru terdaftar
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="min-w-[150px] sticky left-0 bg-slate-50 font-bold text-slate-700">
                  Nama Guru
                </TableHead>
                {documentTypes.map((dt) => (
                  <TableHead
                    key={dt}
                    className="text-center min-w-[80px] font-bold text-slate-700"
                    title={DocumentTypeLabel[dt]}
                  >
                    <span className="text-xs">{dt}</span>
                  </TableHead>
                ))}
                <TableHead className="text-center min-w-[100px] sticky right-0 bg-slate-50 font-bold text-slate-700">
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
                  className="hover:bg-slate-50"
                >
                  <TableCell className="font-semibold text-slate-900 sticky left-0 bg-white">
                    {row.teacherName}
                  </TableCell>
                  {documentTypes.map((dt) => (
                    <TableCell key={dt} className="text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={row.submissions[dt]} />
                      </div>
                    </TableCell>
                  ))}
                  <TableCell className="text-center sticky right-0 bg-white">
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
      </CardContent>
    </Card>
  );
}
