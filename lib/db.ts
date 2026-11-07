import {createClient,type Client} from "@libsql/client";
import {isVariant,validVisitor,type Variant} from "./experiment";
let client:Client|undefined;
let init:Promise<void>|undefined;
function database():Client {
if(!client){const url=process.env.DATABASE_URL||"file:local.db";if(process.env.VERCEL&&url.startsWith("file:"))throw new Error("Configurá DATABASE_URL con una base libSQL remota.");client=createClient({url,authToken:process.env.DATABASE_AUTH_TOKEN||undefined});}
return client;
}
async function ready():Promise<Client>{
const db=database();
init??=(async()=>{
await db.execute("CREATE TABLE IF NOT EXISTS impressions (session_id TEXT PRIMARY KEY, visitor_id TEXT NOT NULL, variant TEXT NOT NULL CHECK(variant IN ('a','b')), created_at TEXT DEFAULT CURRENT_TIMESTAMP)");
await db.execute("CREATE TABLE IF NOT EXISTS conversions (visitor_id TEXT PRIMARY KEY, variant TEXT NOT NULL CHECK(variant IN ('a','b')), created_at TEXT DEFAULT CURRENT_TIMESTAMP)");
})();
await init;return db;
}
export async function recordImpression(visitor:string,variant:Variant,session:string):Promise<void>{
if(!validVisitor(visitor)||!validVisitor(session)||!isVariant(variant))return;
const db=await ready();await db.execute({sql:"INSERT OR IGNORE INTO impressions(session_id,visitor_id,variant) VALUES(?,?,?)",args:[session,visitor,variant]});
}
export async function recordConversion(visitor:string,variant:Variant):Promise<void>{
if(!validVisitor(visitor)||!isVariant(variant))return;
const db=await ready();await db.execute({sql:"INSERT OR IGNORE INTO conversions(visitor_id,variant) SELECT ?,? WHERE EXISTS(SELECT 1 FROM impressions WHERE visitor_id=? AND variant=?)",args:[visitor,variant,visitor,variant]});
}
export async function loadStats():Promise<Record<Variant,{impressions:number;conversions:number}>>{
const db=await ready();const out={a:{impressions:0,conversions:0},b:{impressions:0,conversions:0}};
for(const row of (await db.execute("SELECT variant,COUNT(*) total FROM impressions GROUP BY variant")).rows)if(isVariant(row.variant))out[row.variant].impressions=Number(row.total);
for(const row of (await db.execute("SELECT variant,COUNT(*) total FROM conversions GROUP BY variant")).rows)if(isVariant(row.variant))out[row.variant].conversions=Number(row.total);
return out;
}
