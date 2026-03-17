
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const supabaseServer = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    try {
        // 1. GET /poems-api/occasions
        if (path === "occasions" && req.method === "GET") {
            const { data, error } = await supabaseServer.from("occasions").select("*");
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // 2. GET /poems-api/users
        if (path === "users" && req.method === "GET") {
            const { data, error } = await supabaseServer.from("profiles").select("*");
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // 3. GET /poems-api (Search Poems)
        if (req.method === "GET") {
            const search = url.searchParams.get("search");
            let query = supabaseServer.from("poems").select("*");
            if (search) query = query.or(`title.ilike.%${search}%,poet_name.ilike.%${search}%`);

            const { data, error } = await query;
            if (error) throw error;
            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // 4. POST /poems-api (Add Poem)
        if (req.method === "POST") {
            const body = await req.json();
            const { data, error } = await supabaseServer.from("poems").insert(body).select().single();
            if (error) throw error;
            return new Response(JSON.stringify(data), { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        return new Response("Not Found", { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
