"use client";

import { useState } from "react";
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
  const variants: Record<EvaluationCategory, "default" | "secondary" | "destructive" | "outline"> = {
    A: "default",
    B: "secondary",
    C: "outline",
    D: "destructive",
  };

  const labels: Record<EvaluationCategory, string> = {
    A: "Sangat Baik",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
  };

  return (
    <Badge variant={variants[category]}>
      {category} - {labels[category]}
    </Badge>
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
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{score.toFixed(2)}</span>
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
      <div className="text-center py-8 text-muted-foreground">
        Belum ada evaluasi pada semester ini
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Guru</TableHead>
            <TableHead>Evaluator</TableHead>
            <TableHead>Nilai Akhir</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluations.map((evaluation, index) => (
            <motion.tr
              key={evaluation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <TableCell className="font-medium">
                {evaluation.teacher.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
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
                    <Button variant="ghost" className="h-8 w-8 p-0">
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
                      className="text-destructive"
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
  );
}
