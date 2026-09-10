import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function navigationHarness() {
  const makeElement=()=>({events:{},open:false,addEventListener(name,fn){(this.events[name]??=[]).push(fn);},emit(name,event={}){this.events[name]?.forEach(fn=>fn(event));},removeAttribute(){this.open=false;}});
  const menus=Array.from({length:6},()=>{
    const menu=makeElement();
    menu.summary=makeElement();
    menu.link={focus(){doc.activeElement=this;}};
    menu.summary.focus=()=>{doc.activeElement=menu.summary;};
    menu.contains=node=>node===menu.summary||node===menu.link;
    menu.querySelector=selector=>selector==='summary'?menu.summary:menu.link;
    return menu;
  });
  const doc={...makeElement(),activeElement:null,querySelector:()=>null,querySelectorAll:selector=>selector==='.nav-mega'?menus:[]};
  const hover={matches:true};
  const timers=new Map();let next=0;
  vm.runInNewContext(fs.readFileSync(new URL('../script.js',import.meta.url),'utf8'),{
    document:doc,window:{scrollY:0,addEventListener(){},matchMedia:()=>hover,setTimeout:fn=>{timers.set(++next,fn);return next;},clearTimeout:id=>timers.delete(id)},IntersectionObserver:class{observe(){}},
  });
  return {menus,doc,hover,flush(){for(const fn of timers.values())fn();timers.clear();}};
}

test('mouse hover opens each menu without a click and switches between panels',()=>{
  const {menus}=navigationHarness();
  for(const menu of menus){
    menu.emit('pointerenter',{pointerType:'mouse'});
    assert.equal(menu.open,true);
    assert.equal(menus.filter(m=>m.open).length,1);
  }
});

test('hover exit delay is cancelled on re-entry; touch does not trigger hover',()=>{
  const h=navigationHarness(),menu=h.menus[0];
  menu.emit('pointerenter',{pointerType:'touch'});assert.equal(menu.open,false);
  menu.emit('pointerenter',{pointerType:'mouse'});
  menu.emit('pointerleave',{pointerType:'mouse'});assert.equal(menu.open,true);
  menu.emit('pointerenter',{pointerType:'mouse'});h.flush();assert.equal(menu.open,true);
  menu.emit('pointerleave',{pointerType:'mouse'});h.flush();assert.equal(menu.open,false);
  h.hover.matches=false;menu.emit('pointerenter',{pointerType:'mouse'});assert.equal(menu.open,false);
});

test('keyboard focus stays usable inside a menu and Escape closes it',()=>{
  const h=navigationHarness(),menu=h.menus[0];let prevented=false;
  menu.summary.emit('keydown',{key:'ArrowDown',preventDefault(){prevented=true;}});
  assert.ok(prevented);assert.equal(menu.open,true);assert.equal(h.doc.activeElement,menu.link);
  menu.emit('pointerleave',{pointerType:'mouse'});h.flush();assert.equal(menu.open,true);
  h.doc.emit('keydown',{key:'Escape'});assert.equal(menu.open,false);assert.equal(h.doc.activeElement,menu.summary);
  menu.emit('pointerenter',{pointerType:'mouse'});
  menu.emit('focusout',{relatedTarget:null});assert.equal(menu.open,false);
});
