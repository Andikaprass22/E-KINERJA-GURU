import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { EvaluationCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateFinalScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return parseFloat((sum / scores.length).toFixed(2));
}

export function getCategory(score: number): EvaluationCategory {
  if (score >= 4.56) return "A";
  if (score >= 3.0) return "B";
  if (score >= 2.0) return "C";
  return "D";
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
