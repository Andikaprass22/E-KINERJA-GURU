"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Loader2 } from "lucide-react";
import { DocumentTypeLabel, type DocumentType, type EvaluationCategory } from "@/lib/types";

const DOCUMENT_TYPES: DocumentType[] = [
  "RPP",
  "SYLLABUS",
  "LEARNING_ACHIEVEMENT",
  "TIME_ALLOCATION",
  "KKTP",
  "SEMESTER_PROGRAM",
  "ANNUAL_PROGRAM",
  "TEACHING_JOURNAL",
];

type Scores = Record<DocumentType, number>;

interface Teacher {
  id: string;
  name: string;
  username: string;
}

interface EvaluationFormProps {
  teachers: Teacher[];
  semesterId: string;
  initialScores?: Record<string, number>;
  initialTeacherId?: string;
  onSubmit: (teacherId: string, scores: Record<string, number>) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          <Star
            className={`h-6 w-6 cursor-pointer transition-colors ${
              i <= (hover || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium">{value}/5</span>
    </div>
  );
}

function calculateCategory(finalScore: number): EvaluationCategory {
  if (finalScore >= 4.56) return "A";
  if (finalScore >= 3.0) return "B";
  if (finalScore >= 2.0) return "C";
  return "D";
}

function getCategoryLabel(category: EvaluationCategory): string {
  const labels: Record<EvaluationCategory, string> = {
    A: "Sangat Baik",
    B: "Baik",
    C: "Cukup",
    D: "Kurang",
  };
  return labels[category];
}

function getCategoryVariant(category: EvaluationCategory): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<EvaluationCategory, "default" | "secondary" | "destructive" | "outline"> = {
    A: "default",
    B: "secondary",
    C: "outline",
    D: "destructive",
  };
  return variants[category];
}

export function EvaluationForm({
  teachers,
  semesterId,
  initialScores,
  initialTeacherId,
  onSubmit,
  onCancel,
}: EvaluationFormProps) {
  const [teacherId, setTeacherId] = useState(initialTeacherId || "");
  const [scores, setScores] = useState<Record<string, number>>(
    initialScores || Object.fromEntries(DOCUMENT_TYPES.map((dt) => [dt, 3]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { finalScore, category } = useMemo(() => {
    const values = Object.values(scores);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { finalScore: avg, category: calculateCategory(avg) };
  }, [scores]);

  const handleScoreChange = (docType: DocumentType, value: number) => {
    setScores((prev) => ({ ...prev, [docType]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!teacherId) {
      setError("Pilih guru terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(teacherId, scores);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || "Terjadi kesalahan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="teacher">Guru</Label>
        <Select
          value={teacherId}
          onValueChange={setTeacherId}
          disabled={!!initialTeacherId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih guru" />
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.name} ({teacher.username})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Aspek Penilaian</Label>
        <div className="grid gap-4 md:grid-cols-2">
          {DOCUMENT_TYPES.map((dt) => (
            <div
              key={dt}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <span className="text-sm font-medium">{DocumentTypeLabel[dt]}</span>
              <StarRatingInput
                value={scores[dt]}
                onChange={(v) => handleScoreChange(dt, v)}
              />
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Hasil Penilaian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Nilai Akhir</p>
              <p className="text-2xl font-bold">{finalScore.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Kategori</p>
              <Badge variant={getCategoryVariant(category)} className="text-lg">
                {category} - {getCategoryLabel(category)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialTeacherId ? "Perbarui" : "Simpan"} Evaluasi
        </Button>
      </div>
    </form>
  );
}
