import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function GET() {
  return POST(new Request("http://localhost/api/cron/check-deadlines"));
}

export async function POST(request: Request) {
  console.log("=== CRON: CHECK DEADLINES START ===");

  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log("❌ Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activeSemesters = await prisma.semester.findMany({
      where: { isActive: true },
      include: { deadlines: true },
    });

    if (activeSemesters.length === 0) {
      console.log("No active semesters found");
      return NextResponse.json({ success: true, updated: 0, message: "No active semesters" });
    }

    const now = new Date();
    let totalMissing = 0;
    let totalLate = 0;
    const updatedTeacherIds = new Set<string>();

    for (const semester of activeSemesters) {
      console.log(`Processing semester: ${semester.name} (${semester.id})`);

      for (const deadline of semester.deadlines) {
        if (now <= deadline.deadline) continue;

        const missingResult = await prisma.documentSubmission.updateMany({
          where: {
            semesterId: semester.id,
            documentType: deadline.documentType,
            status: "MISSING",
            uploadedAt: null,
          },
          data: {
            status: "MISSING",
          },
        });

        if (missingResult.count > 0) {
          console.log(`Marked ${missingResult.count} ${deadline.documentType} as MISSING`);
          totalMissing += missingResult.count;
        }

        const teachersWithSubmissions = await prisma.documentSubmission.findMany({
          where: {
            semesterId: semester.id,
            documentType: deadline.documentType,
            status: "COMPLETED",
            uploadedAt: { gt: deadline.deadline },
          },
          select: { teacherId: true },
        });

        if (teachersWithSubmissions.length > 0) {
          const teacherIds = teachersWithSubmissions.map((t) => t.teacherId);

          const lateResult = await prisma.documentSubmission.updateMany({
            where: {
              semesterId: semester.id,
              documentType: deadline.documentType,
              status: "COMPLETED",
              uploadedAt: { gt: deadline.deadline },
            },
            data: {
              status: "LATE",
            },
          });

          if (lateResult.count > 0) {
            console.log(`Marked ${lateResult.count} ${deadline.documentType} as LATE`);
            totalLate += lateResult.count;
            teacherIds.forEach((id) => updatedTeacherIds.add(id));
          }
        }

      const noSubmissionTeachers = await prisma.user.findMany({
        where: {
          role: "TEACHER",
          NOT: {
            submissions: {
              some: {
                semesterId: semester.id,
                documentType: deadline.documentType,
              },
            },
          },
        },
        select: { id: true },
      });

        if (noSubmissionTeachers.length > 0) {
          const createResults = await prisma.documentSubmission.createMany({
            data: noSubmissionTeachers.map((teacher) => ({
              teacherId: teacher.id,
              semesterId: semester.id,
              documentType: deadline.documentType,
              status: "MISSING" as const,
            })),
            skipDuplicates: true,
          });

          if (createResults.count > 0) {
            console.log(`Created ${createResults.count} MISSING submissions for ${deadline.documentType}`);
            totalMissing += createResults.count;
            noSubmissionTeachers.forEach((t) => updatedTeacherIds.add(t.id));
          }
        }
      }
    }

  for (const teacherId of updatedTeacherIds) {
    revalidateTag(`submissions-${teacherId}`, "max");
  }
  revalidateTag("submissions", "max");

    console.log(`=== CRON: CHECK DEADLINES COMPLETE === missing: ${totalMissing}, late: ${totalLate}`);

    return NextResponse.json({
      success: true,
      missing: totalMissing,
      late: totalLate,
      teachersUpdated: updatedTeacherIds.size,
    });
  } catch (error) {
    console.error("❌ Cron check deadlines error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
