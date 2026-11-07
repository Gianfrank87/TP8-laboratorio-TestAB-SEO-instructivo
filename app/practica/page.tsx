import type {Metadata} from "next";
import Link from "next/link";
import {headers} from "next/headers";
import {registerConversion} from "./actions";
import {assignVariant,isVariant,MESSAGES,OFFER,type Variant,validVisitor} from "@/lib/experiment";
import {recordImpression} from "@/lib/db";
export const dynamic="force-dynamic";
type Props={searchParams:Promise<{preview?:string;registrado?:string}>};
async function context(preview:string|undefined):Promise<{variant:Variant;isPreview:boolean;crawler:boolean}>{
if(isVariant(preview))return {variant:preview,isPreview:true,crawler:false};
const h=await headers();const visitor=h.get("x-tn-visitor");
if(validVisitor(visitor))return {variant:assignVariant(visitor),isPreview:false,crawler:false};
return {variant:"a",isPreview:false,crawler:true};
}
export async function generateMetadata({searchParams}:Props):Promise<Metadata>{
const p=await searchParams;const {variant,isPreview}=await context(p.preview);
return {title:{absolute:MESSAGES[variant].title},description:MESSAGES[variant].description,alternates:{canonical:"/practica"},robots:isPreview?{index:false,follow:false}:{index:true,follow:true}};
}
export default async function Practica({searchParams}:Props){
const p=await searchParams;const {variant,isPreview,crawler}=await context(p.preview);
const h=await headers();const visitor=h.get("x-tn-visitor"),session=h.get("x-tn-session");
if(!isPreview&&!crawler&&validVisitor(visitor)&&validVisitor(session))await recordImpression(visitor,variant,session);
const copy=MESSAGES[variant];
return <main><nav className="nav"><Link href="/" className="brand">TALLER <b>NORTE</b><span>↗</span></Link><Link href="/bitacora">Bitácora del experimento ↗</Link></nav>
<section className="hero"><div className="hero-copy"><p className="eyebrow">OFICIOS REALES · INSCRIPCIONES ABIERTAS</p><span className="tag">{variant==="a"?"APRENDER HACIENDO":"ÚLTIMOS CUPOS DE ABRIL"}</span><h1>{copy.heading}</h1><p className="intro">{copy.lead}</p><div className="info"><div><strong>14 ABR</strong><small>Próximo inicio</small></div><div><strong>8 SEM</strong><small>Duración</small></div><div><strong>12</strong><small>Por grupo</small></div></div>
{isPreview?<div className="primary inactive">{copy.cta} · Vista previa</div>:<form action={registerConversion}><button className="primary" type="submit">{copy.cta} ↗</button></form>}
{p.registrado==="1"&&!isPreview&&<p role="status" className="success">Tu interés quedó registrado.</p>}
<p className="note">Cupos limitados por grupo. Sin compromiso de inscripción.</p></div>
<aside className="hero-art"><span>ESCUELA DE OFICIOS / EDICIÓN ABRIL</span><div className="art-lines"><span>HACÉ.</span><span>APRENDÉ.</span><span>CRECÉ.</span></div><span>FORMACIÓN PARA EL TRABAJO · 01/03</span></aside></section>
<section className="courses"><div><p className="eyebrow">LO QUE PODÉS APRENDER</p><h2>Tres oficios.<br/>Un nuevo comienzo.</h2></div><div>{OFFER.trades.map((t,i)=><div className="course" key={t}><span>0{i+1}</span><strong>{t}</strong><span>↗</span></div>)}<p>Inicio: {OFFER.start} · Duración: {OFFER.duration} · Cupo: {OFFER.capacity} por grupo.</p></div></section>
<footer><span>© Taller Norte · Escuela de oficios</span><div><Link href="/practica?preview=a">Preview A</Link><Link href="/practica?preview=b">Preview B</Link><Link href="/bitacora">Bitácora</Link></div></footer></main>;
}
