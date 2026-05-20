"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Clock, User, History } from "lucide-react";
import { getEvaluationHistory } from "@/lib/actions/evaluations";
import { DocumentTypeLabel, type DocumentType } from "@/lib/types";

interface HistoryEntry {
  id: string;
  changedBy: { id: string; name: string; role: string };
  previousScores: Record<string, number>;
  newScores: Record<string, number>;
  reason: string | null;
  changedAt: Date;
}

interface EvaluationHistoryProps {
  evaluationId: string;
}

function ScoreDiff({
  prev,
  next,
  docType,
}: {
  prev: number;
  next: number;
  docType: string;
}) {
  const diff = next - prev;
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded bg-muted/50">
      <span className="text-xs text-muted-foreground truncate mr-2">{DocumentTypeLabel[docType as DocumentType]}</span>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-sm">{prev}</span>
        <span className="text-muted-foreground text-xs">→</span>
        <span className={`text-sm font-medium ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""}`}>
          {next}
        </span>
        {diff !== 0 && (
          <Badge variant={diff > 0 ? "default" : "destructive"} className="text-xs h-5 px-1.5">
            {diff > 0 ? `+${diff}` : diff}
          </Badge>
        )}
      </div>
    </div>
  );
}

export function EvaluationHistory({ evaluationId }: EvaluationHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const result = await getEvaluationHistory(evaluationId);
      if (result.success && result.data) {
        setHistory(result.data as unknown as HistoryEntry[]);
      }
      setIsLoading(false);
    };
    load();
  }, [evaluationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <History className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
          <p className="text-sm">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <div className="text-center">
          <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Belum ada riwayat revisi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium">{entry.changedBy.name}</span>
                <Badge variant="outline" className="ml-2 text-xs">{entry.changedBy.role}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(entry.changedAt).toLocaleString("id-ID")}
            </div>
          </div>

          {entry.reason && (
            <p className="text-xs text-muted-foreground pl-10">
              Alasan: {entry.reason}
            </p>
          )}

          <div className="grid gap-1.5 md:grid-cols-2">
            {Object.keys(entry.previousScores).map((docType) => (
              <ScoreDiff
                key={docType}
                docType={docType}
                prev={entry.previousScores[docType]}
                next={entry.newScores[docType]}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
