import { denied } from "@/lib/session";
import { sb, storageRemove } from "@/lib/supabase/server";
import type { Memory } from "@/types";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; memorie: string }> },
) {
  const d = await denied(false);
  if (d) return d;
  const { id: planId, memorie: memoryId } = await params;

  try {
    const [memory] = await sb<Memory>(
      `memories?select=imageUrl,planId&id=eq.${encodeURIComponent(memoryId)}&planId=eq.${encodeURIComponent(planId)}`,
    );
    if (!memory) {
      return NextResponse.json(
        { error: "Memoria no encontrada" },
        { status: 404 },
      );
    }

    await storageRemove([memory.imageUrl]);
    await sb(`memories?id=eq.${encodeURIComponent(memoryId)}`, {
      method: "DELETE",
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo borrar la memoria" },
      { status: 500 },
    );
  }
}
