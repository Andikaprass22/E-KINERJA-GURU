export type UserRole = "ADMIN" | "PRINCIPAL" | "TEACHER";

export type DocumentType =
  | "RPP"
  | "SYLLABUS"
  | "LEARNING_ACHIEVEMENT"
  | "TIME_ALLOCATION"
  | "KKTP"
  | "SEMESTER_PROGRAM"
  | "ANNUAL_PROGRAM"
  | "TEACHING_JOURNAL";

export type SubmissionStatus = "COMPLETED" | "LATE" | "MISSING";

export type EvaluationCategory = "A" | "B" | "C" | "D";

export const DocumentTypeLabel: Record<DocumentType, string> = {
  RPP: "Rencana Pelaksanaan Pembelajaran",
  SYLLABUS: "Silabus",
  LEARNING_ACHIEVEMENT: "Capaian Pembelajaran",
  TIME_ALLOCATION: "Alokasi Waktu",
  KKTP: "KKTP",
  SEMESTER_PROGRAM: "Program Semester",
  ANNUAL_PROGRAM: "Program Tahunan",
  TEACHING_JOURNAL: "Jurnal Mengajar",
};