"use server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {assignVariant,validVisitor,VISITOR_COOKIE} from "@/lib/experiment";
import {recordConversion} from "@/lib/db";
export async function registerConversion(){
const jar=await cookies();const visitor=jar.get(VISITOR_COOKIE)?.value;
if(!process.env.VERCEL || (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY)){
if(validVisitor(visitor))await recordConversion(visitor,assignVariant(visitor));
}else{redirect("/practica?sin_base=1");}
redirect("/practica?registrado=1");
}
