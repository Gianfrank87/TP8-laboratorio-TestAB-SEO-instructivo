import { createClient, type Client } from "@libsql/client";
import { isVariant, validVisitor, type Variant } from "./experiment";

let client: Client | undefined;
let initialized: Promise<void> | undefined;

const remote = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);

async function rpc(name: string, args: Record<string, unknown>): Promise<unknown> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Falta configurar la base de datos");
  const response = await fetch(url + "/rest/v1/rpc/" + name, {
    method: "POST",
    headers: { "apikey": key, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error("Fallo en la base de datos: " + response.status + " " + error.substring(0, 300));
  }
  const payload = await response.text();
  return payload ? JSON.parse(payload) : null;
}

function database(): Client {
  if (!client) client = createClient({url: process.env.DATABASE_URL || "file:local.db",authToken:process.env.DATABASE_AUTH_TOKEN || undefined});
  return client;
}
async function ready(): Promise<Client> {
  const db = database();
  initialized ??= (async () => {
    await db.execute("CREATE TABLE IF NOT EXISTS impressions (session_id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL, variant TEXT NOT NULL CHECK(variant IN ('a','b')))");
    await db.execute("CREATE TABLE IF NOT EXISTS conversions (visitor_id TEXT PRIMARY KEY, variant TEXT NOT NULL CHECK(variant IN ('a','b')))");
  })();
  await initialized;
  return db;
}
export async function recordImpression(visitor:string,variant:Variant,session:string):Promise<void> {
  if(!validVisitor(visitor)||!validVisitor(session)||!isVariant(variant))return;
  if(remote) { await rpc("tp8_record_impression",{p_visitor:visitor,p_variant:variant,p_session:session}); return; }
  const db=await ready();
  await db.execute({sql:"INSERT OR IGNORE INTO impressions(session_id,visitor_id,variant) VALUES(?,?,?)",args:[session,visitor,variant]});
}
export async function recordConversion(visitor:string,variant:Variant):Promise<void> {
  if(!validVisitor(visitor)||!isVariant(variant))return;
  if(remote){await rpc("tp8_record_conversion",{p_visitor:visitor,p_variant:variant});return;}
  const db=await ready();
  await db.execute({sql:"INSERT OR IGNORE INTO conversions(visitor_id,variant) SELECT ?,? WHERE EXISTS(SELECT 1 FROM impressions WHERE visitor_id=? AND variant=?)",args:[visitor,variant,visitor,variant]});
}
export async function loadStats():Promise<Record<Variant,{impressions:number;conversions:number}>> {
  const result={a:{impressions:0,conversions:0},b:{impressions:0,conversions:0}};
  if(remote){
    const rows=await rpc("tp8_stats",{}) as Array<{variant:unknown,impressions:unknown,conversions:unknown}>;
    if(!Array.isArray(rows))throw new Error("Respuesta incorrecta de estadísticas");
    for(const row of rows){
      if(!isVariant(row.variant))continue;
      const i=Number(row.impressions),c=Number(row.conversions);
      if(Number.isSafeInteger(i)&&Number.isSafeInteger(c)&&i>=0&&c>=0)result[row.variant]={impressions:i,conversions:c};
    }
    return result;
  }
  const db=await ready();
  for(const row of (await db.execute("SELECT variant,COUNT(*) total FROM impressions GROUP BY variant")).rows)if(isVariant(row.variant))result[row.variant].impressions=Number(row.total);
  for(const row of (await db.execute("SELECT variant,COUNT(*) total FROM conversions GROUP BY variant")).rows)if(isVariant(row.variant))result[row.variant].conversions=Number(row.total);
  return result;
}
