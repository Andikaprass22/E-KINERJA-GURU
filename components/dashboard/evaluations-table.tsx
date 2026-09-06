"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Star } from "lucide-react";
import type { EvaluationCategory } from "@/lib/types";

interface EvaluationRow {
  id: string;
  teacherId: string;
  teacher: { id: string; name: string; username: string };
  evaluator: { id: string; name: string };
  scores: Record<string, number>;
  finalScore: number;
  category: EvaluationCategory;
  updatedAt: Date;
}

interface EvaluationsTableProps {
  evaluations: EvaluationRow[];
  onEdit: (evaluation: EvaluationRow) => void;
  onDelete: (evaluationId: string) => void;
}

function CategoryBadge({ category }: { category: EvaluationCategory }) {
  const colors: Record<EvaluationCategory, string> = {
    A: "bg-emerald-100 text-emerald-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-amber-100 text-amber-700",
    D: "bg-red-100 text-red-700",
  };
  const labels: Record<EvaluationCategory, string> = {
    A: "Sangat Baik",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full ${colors[category]}`}>
      {category} - {labels[category]}
    </span>
  );
}

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= Math.round(score)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-200"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-bold text-slate-900">{score.toFixed(2)}</span>
    </div>
  );
}

export function EvaluationsTable({
  evaluations,
  onEdit,
  onDelete,
}: EvaluationsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus evaluasi ini?")) return;
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (evaluations.length === 0) {
    return (
      <Card className="border-slate-100 shadow-sm">
        <CardContent className="py-12 text-center text-slate-400">
          Belum ada evaluasi pada semester ini
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-medium text-slate-900">Daftar Evaluasi</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          {evaluations.length} evaluasi tercatat
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-bold text-slate-700">Nama Guru</TableHead>
                <TableHead className="font-bold text-slate-700 hidden sm:table-cell">Evaluator</TableHead>
                <TableHead className="font-bold text-slate-700">Nilai Akhir</TableHead>
                <TableHead className="font-bold text-slate-700">Kategori</TableHead>
                <TableHead className="w-[50px] font-bold text-slate-700"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evaluation, index) => (
                <motion.tr
                  key={evaluation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-slate-50"
                >
                  <TableCell className="font-semibold text-slate-900">
                    {evaluation.teacher.name}
                  </TableCell>
                  <TableCell className="text-slate-500 hidden sm:table-cell">
                    {evaluation.evaluator.name}
                  </TableCell>
                  <TableCell>
                    <StarRating score={evaluation.finalScore} />
                  </TableCell>
                  <TableCell>
                    <CategoryBadge category={evaluation.category} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(evaluation)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(evaluation.id)}
                          disabled={deletingId === evaluation.id}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
