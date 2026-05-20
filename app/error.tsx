"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl">Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Maaf, terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={reset}>Coba Lagi</Button>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Kembali ke Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
