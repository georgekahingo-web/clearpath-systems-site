import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      business_name,
      forward_to_number,
      business_email,
      auto_reply,
    } = body;

    if (!forward_to_number || !business_email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.from("clients").insert([
      {
        business_name,
        forward_to_number,
        business_email,
        auto_reply,
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    console.log("✅ New client added:", data);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ Onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
