import assert from "node:assert/strict";
import test from "node:test";
import {assignVariant,caseDifference,conversionRate,FIXED_CASE,formatPercent,formatPoints,hashVisitor,MESSAGES,OFFER} from "../lib/experiment";
test("el identificador conserva su asignación",()=>{const id="lab-visitor-demo-01";assert.equal(hashVisitor(id),hashVisitor(id));assert.equal(assignVariant(id),assignVariant(id));});
test("el caso fijo calcula las tasas",()=>{assert.equal(formatPercent(conversionRate(FIXED_CASE.a.impressions,FIXED_CASE.a.conversions)),"7,50%");assert.equal(formatPercent(conversionRate(FIXED_CASE.b.impressions,FIXED_CASE.b.conversions)),"13,14%");assert.equal(formatPoints(caseDifference()),"5,64 pp");});
test("sin impresiones no hay tasa",()=>{assert.equal(conversionRate(0,0),null);assert.equal(conversionRate(4,5),null);});
test("metadatos en rango y oferta intacta",()=>{for(const m of Object.values(MESSAGES)){assert.ok(m.title.length>=50&&m.title.length<=60);assert.ok(m.description.length>=140&&m.description.length<=160);}assert.equal(OFFER.duration,"8 semanas");});
