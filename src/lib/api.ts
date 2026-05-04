import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export const nollyApi = {
  async getStrategies() {
    const { data, error } = await supabase.from("strategies").select("*");
    if (error) throw error;
    return data;
  },
  async getReferralData(fid: number) {
    const { data, error } = await supabase
      .from("profiles")
      .select("referral_count, points")
      .eq("farcaster_id", fid)
      .single();
    if (error) return null;
    return data;
  },
};
