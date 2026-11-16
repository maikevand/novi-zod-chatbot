import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Vacature } from "@/lib/vacature/schema";

export async function saveVacature(vacature: Vacature, origineleTekst: string) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase
        .from("vacatures")
        .insert({ ...vacature, origineleTekst });
    if (error) throw error;
}

export async function getVacatures() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.from("vacatures").select("*");
    if (error) throw error;
    return data;
}