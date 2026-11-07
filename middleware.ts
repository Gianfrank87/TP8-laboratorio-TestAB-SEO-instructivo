import { NextRequest, NextResponse } from "next/server";
import { assignVariant,SESSION_COOKIE,SESSION_SECONDS,validVisitor,VISITOR_COOKIE,VISITOR_SECONDS,isVariant } from "./lib/experiment";
export function middleware(request:NextRequest){
const p=request.nextUrl.searchParams.get("preview");
if(isVariant(p))return NextResponse.next();
const agent=request.headers.get("user-agent")||"";
if(/googlebot|bingbot|duckduckbot|baiduspider|yandexbot|slurp/i.test(agent))return NextResponse.next();
const oldVisitor=request.cookies.get(VISITOR_COOKIE)?.value;
const visitor=validVisitor(oldVisitor)?oldVisitor:crypto.randomUUID();
const oldSession=request.cookies.get(SESSION_COOKIE)?.value;
const session=validVisitor(oldSession)?oldSession:crypto.randomUUID();
const variant=assignVariant(visitor);
const headers=new Headers(request.headers);
headers.set("x-tn-visitor",visitor);headers.set("x-tn-variant",variant);headers.set("x-tn-session",session);
const res=NextResponse.next({request:{headers}});
const embed=process.env.NEXT_PUBLIC_EMBEDDED_PREVIEW==="true";
const opts={httpOnly:true,path:"/",sameSite:(embed?"none":"lax") as "none"|"lax",secure:embed||process.env.NODE_ENV==="production"};
res.cookies.set(VISITOR_COOKIE,visitor,{...opts,maxAge:VISITOR_SECONDS});
res.cookies.set("tn_variant",variant,{...opts,maxAge:VISITOR_SECONDS});
res.cookies.set(SESSION_COOKIE,session,{...opts,maxAge:SESSION_SECONDS});
return res;
}
export const config={matcher:["/practica"]};
