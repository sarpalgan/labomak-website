import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { tensileState } from '../tensile-geometry.js';
import { homepage, homepageSeo } from '../tools/homepage.mjs';

test('tensile travel is bounded, reversible and continuous before fracture', () => {
  assert.equal(tensileState(-1).lift,0);
  assert.equal(tensileState(2).lift,96);
  assert.equal(tensileState(NaN).progress,0);
  let last=0;
  for(let i=0;i<=100;i++) {
    const state=tensileState(i/100);
    assert.ok(state.lift>=last);
    assert.ok(!/NaN|Infinity/.test(state.upper+state.lower));
    assert.equal(Boolean(state.lower),i>88);
    last=state.lift;
  }
  assert.deepEqual([0,.3,.7,1].map(p=>tensileState(p).stage),[0,1,2,3]);
  assert.deepEqual(tensileState(0),tensileState(-100));
});

function motionHarness(reduced=false) {
  const element=()=>({dataset:{},attributes:{},events:{},classList:{toggle(){}},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this.events[k]=fn;}});
  const slider=element(), toggle=element(), crosshead=element(), specimen=element(), fragment=element(), controls=element();
  toggle.dataset={pause:'Pause scroll motion',resume:'Enable scroll motion'};
  const stages=Array.from({length:4},(_,i)=>({...element(),textContent:`Stage ${i}`}));
  let position=80;
  const story={...element(),offsetHeight:1720,firstElementChild:{offsetHeight:880},querySelectorAll:()=>stages,getBoundingClientRect:()=>({top:position,height:1720}),querySelector:q=>({'#tensile-progress':slider,'[data-motion-toggle]':toggle,'[data-rig-crosshead]':crosshead,'[data-rig-specimen]':specimen,'[data-rig-fragment]':fragment,'[data-motion-controls]':controls}[q])};
  const preference={...element(),matches:reduced};
  const events={}, frames=[];
  const context={tensileState,document:{querySelector:()=>story,documentElement:{lang:'en'}},matchMedia:()=>preference,getComputedStyle:()=>({position:'sticky',top:'80px'}),requestAnimationFrame:fn=>frames.push(fn),IntersectionObserver:class{observe(){}},window:{addEventListener:(event,fn)=>{events[event]=fn;}}};
  vm.runInNewContext(fs.readFileSync(new URL('../home.js',import.meta.url),'utf8').replace(/^import .*?;\s*/,''),context);
  const flush=()=>{while(frames.length)frames.shift()();};
  flush();
  return {slider,toggle,crosshead,fragment,story,controls,preference,flush,scroll(progress){position=80-progress*840;events.scroll();flush();}};
}

test('scroll motion pauses, manual selection persists, and resume follows the page',()=>{
  const h=motionHarness();
  h.scroll(.5);
  assert.equal(h.slider.value,50);
  h.toggle.events.click();
  h.scroll(1);
  assert.equal(h.slider.value,50);
  h.slider.value=25;h.slider.events.input();h.scroll(.8);
  assert.equal(h.slider.value,25);
  h.toggle.events.click();h.flush();
  assert.equal(h.slider.value,80);
  h.scroll(0);assert.equal(h.crosshead.attributes.transform,'translate(0 0)');
});

test('reduced motion starts static, allows deliberate keyboard input, and responds to preference changes',()=>{
  const h=motionHarness(true);
  h.scroll(1);
  assert.equal(h.slider.value,0);
  assert.equal(h.story.dataset.scrollLayout,'false');
  assert.equal(h.toggle.disabled,true);
  h.slider.value=100;h.slider.events.input();
  assert.ok(h.fragment.attributes.d.length>0);
  h.preference.matches=false;h.preference.events.change();h.flush();
  assert.equal(h.toggle.disabled,false);
  h.preference.matches=true;h.preference.events.change();h.flush();
  assert.equal(h.slider.value,0);
});

test('both landing pages expose products, controls and SEO content without animation execution',()=>{
  for(const lang of ['en','tr']) {
    const html=homepage(lang,()=>'<section id="enquire"></section>');
    assert.equal((html.match(/<h1>/g)||[]).length,1);
    assert.ok(html.includes('id="tensile-progress"'));
    assert.ok(html.includes('id="quote"'));
    assert.ok(!/machine-frame|mini-machine|fixture-illustration|product-machine|LIVE LOAD/.test(html));
    assert.equal((html.match(/class="lm-product-card"/g)||[]).length,4);
    assert.ok(html.includes('332'));
    const seo=homepageSeo(lang);
    const schema=JSON.parse(seo.extra.match(/application\/ld\+json">(.*?)<\/script>/)[1]);
    assert.deepEqual(schema['@graph'].map(n=>n['@type']),['Organization','WebSite','WebPage']);
    assert.equal(schema['@graph'][2].inLanguage,lang);
  }
});
