export type Variant = "a" | "b";
export const OFFER = { start: "14 de abril", duration: "8 semanas", capacity: "12 personas", trades: ["carpintería", "electricidad", "cocina"] } as const;
export const MESSAGES: Record<Variant, {title:string;description:string;heading:string;cta:string;lead:string}> = {
a: { title:"Cursos de oficio en ocho semanas, con salida laboral", description:"Aprendé carpintería, electricidad o cocina en ocho semanas. Grupos de doce personas y práctica real, con una salida laboral que se puede cobrar.", heading:"Ocho semanas para un oficio que se puede cobrar.",cta:"Ver cupos de abril",lead:"Aprendé haciendo. Sumá práctica real y llevate un oficio para empezar a trabajar." },
b: { title:"Abril abre cupos: cursos de oficio en grupos de 12", description:"El 14 de abril empiezan grupos de doce. En la cohorte anterior, ocho de cada diez consiguieron trabajo en el rubro antes de los noventa días.",heading:"El curso empieza el 14 de abril. El cupo, no.",cta:"Reservar mi lugar",lead:"Grupos chicos y una fecha concreta para dar el primer paso hacia tu próximo oficio." }
};
export const FIXED_CASE={a:{impressions:240,conversions:18},b:{impressions:236,conversions:31}} as const;
export const VISITOR_COOKIE="tn_visitor", SESSION_COOKIE="tn_session", VISITOR_SECONDS=2592000, SESSION_SECONDS=1800;
export function hashVisitor(visitor:string):number {let hash=2166136261;for(let i=0;i<visitor.length;i++){hash^=visitor.charCodeAt(i);hash=Math.imul(hash,16777619);}return hash>>>0;}
export function assignVariant(visitor:string):Variant{return hashVisitor(visitor)%2===0?"a":"b";}
export function validVisitor(x:unknown):x is string{return typeof x==="string"&&/^[a-zA-Z0-9-]{8,80}$/.test(x);}
export function isVariant(x:unknown):x is Variant{return x==="a"||x==="b";}
export function conversionRate(i:number,c:number):number|null{return Number.isSafeInteger(i)&&Number.isSafeInteger(c)&&i>0&&c>=0&&c<=i?100*c/i:null;}
export function formatPercent(n:number|null):string{return n===null?"Sin datos":n.toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:2})+"%";}
export function formatPoints(n:number|null):string{return n===null?"Sin datos":n.toLocaleString("es-AR",{minimumFractionDigits:2,maximumFractionDigits:2})+" pp";}
export function caseDifference():number{return conversionRate(236,31)!-conversionRate(240,18)!;}
