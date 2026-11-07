import Link from "next/link";
import {loadStats} from "@/lib/db";
import {caseDifference,conversionRate,FIXED_CASE,formatPercent,formatPoints} from "@/lib/experiment";
export const dynamic="force-dynamic";
type Data=Record<"a"|"b",{impressions:number;conversions:number}>;
function Results({data}:{data:Data}){
const a=conversionRate(data.a.impressions,data.a.conversions),b=conversionRate(data.b.impressions,data.b.conversions);
return <div className="table-wrap"><table><thead><tr><th>Variante</th><th>Impresiones</th><th>Conversiones</th><th>Tasa</th></tr></thead><tbody>
<tr><td>A · Control</td><td>{data.a.impressions}</td><td>{data.a.conversions}</td><td><b>{formatPercent(a)}</b></td></tr>
<tr><td>B · Tratamiento</td><td>{data.b.impressions}</td><td>{data.b.conversions}</td><td><b>{formatPercent(b)}</b></td></tr>
<tr className="difference"><td>B − A</td><td>—</td><td>—</td><td><b>{formatPoints(a!==null&&b!==null?b-a:null)}</b></td></tr>
</tbody></table></div>;
}
export default async function Bitacora(){
const databaseReady = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) || !process.env.VERCEL;
const stats=databaseReady?await loadStats():null;
return <main className="dashboard"><nav className="nav"><Link href="/" className="brand">TALLER <b>NORTE</b><span>↗</span></Link><Link href="/practica">Volver a la landing ↗</Link></nav>
<header className="dashboard-header"><p className="eyebrow">LABORATORIO 01 / EXPERIMENTO A/B</p><h1>Bitácora del<br/>experimento<span>.</span></h1><p>Una URL canónica, dos mensajes y un registro sin duplicaciones.</p></header>
<section className="stats-section"><div className="section-heading"><h2>01 / Registro real</h2><p>Eventos almacenados en la base de datos.</p></div>{stats?<Results data={stats}/>:<p role="status" className="small-note">Registro pendiente: falta configurar la base de datos persistente. No hay estadísticas reales disponibles.</p>}<p className="small-note">Una impresión por sesión de 30 minutos. Una conversión por visitante, solo desde el CTA.</p></section>
<section className="stats-section"><div className="section-heading"><h2>02 / Caso de prueba</h2><p>Datos fijos de la consigna.</p></div><Results data={FIXED_CASE}/><div className="formula"><span>18 / 240 = {formatPercent(conversionRate(240,18))}</span><span>31 / 236 = {formatPercent(conversionRate(236,31))}</span><span>B − A = {formatPoints(caseDifference())}</span></div><p className="small-note">La diferencia observada no demuestra por sí sola que B sea la ganadora.</p></section>
<footer><span>TALLER NORTE / LAB 01</span><div><Link href="/practica?preview=a">Vista A</Link><Link href="/practica?preview=b">Vista B</Link></div></footer></main>;
}
