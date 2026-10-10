'use strict';
// TROGEBOB — zero dependencies; image-only responses are pre-drawn illustrations.
const MOODS = ['happy','shocked','angry','sad','smug'];
const FOUNDERS = [{id:'v',name:'Vitalik'},{id:'a',name:'Anatoly'},{id:'r',name:'Raj'}];
const MIXED = [
  {key:'happy-angry-smug',name:'HAPPY + ANGRY + SMUG',desc:'Vitalik is vibing, Anatoly wants to argue, and Raj knows something we don’t.'},
  {key:'shocked-sad-happy',name:'SHOCKED + SAD + HAPPY',desc:'The emotional equivalent of checking three different price charts.'},
  {key:'smug-happy-sad',name:'SMUG + HAPPY + SAD',desc:'A genius idea, a celebration, and a tiny existential crisis.'},
  {key:'angry-smug-happy',name:'ANGRY + SMUG + HAPPY',desc:'One face. Three very incompatible group chats.'},
  {key:'sad-shocked-smug',name:'SAD + SHOCKED + SMUG',desc:'The market fell. One of them apparently predicted it.'}
];
const ALL3 = {
  happy:'Three founders found the same brain cell. They’re throwing a party.',
  shocked:'All three saw the gas fee at once.',
  angry:'The DAO meeting has been cancelled for emotional reasons.',
  sad:'Three founders crying over one shared portfolio.',
  smug:'All three are convinced the other two copied their homework.'
};
const state = {v:'happy',a:'happy',r:'happy'};
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];
const pathMood = (founder,mood)=>`assets/moods/${founder}-${mood}.webp`;
const pathSame = mood=>`assets/results/aaa-${mood}.webp`;
const pathMix = key=>`assets/samples/mixed-${key}.webp`;
const name = x=>x.toUpperCase();
let current = {key:'happy-happy-happy', image:pathSame('happy'),exact:true,title:'HAPPY + HAPPY + HAPPY'};
function createMoodButtons(){
  for(const {id,name:label} of FOUNDERS){
    const grid = $(`[data-mood-grid="${id}"]`);
    for(const mood of MOODS){
      const button = document.createElement('button');
      button.type='button';button.className='mood-button';button.dataset.founder=id;button.dataset.mood=mood;
      button.setAttribute('aria-label',`${label}: ${mood}`);button.setAttribute('aria-pressed',String(state[id]===mood));
      button.innerHTML=`<img src="${pathMood(id,mood)}" alt="" loading="lazy" width="260" height="200"><span>${name(mood)}</span>`;
      button.addEventListener('click',()=>{state[id]=mood;updateSelection();renderResult();});
      grid.appendChild(button);
    }
  }
}
function updateSelection(){
  $$('.mood-button').forEach(b=>b.setAttribute('aria-pressed',String(state[b.dataset.founder]===b.dataset.mood)));
}
function nearestMixed(){
  const wanted = [state.v,state.a,state.r];
  let nearest = MIXED[0],best=-1;
  MIXED.forEach((m,i)=>{
    const key=m.key.split('-');let score=key.reduce((s,mood,ix)=>s+(mood===wanted[ix]?1:0),0);
    // Stable tie-break gives consistent image for the same input.
    score += (MIXED.length-i)*.0001;
    if(score>best){best=score;nearest=m;}
  });return nearest;
}
function renderResult(){
  const key=`${state.v}-${state.a}-${state.r}`;
  const allSame=state.v===state.a && state.a===state.r;
  const exactMix=MIXED.find(m=>m.key===key);
  const match= allSame ? {img:pathSame(state.v),title:`${name(state.v)} × 3`,desc:ALL3[state.v],type:'ALL-THREE MATCH · ORIGINAL ARTWORK'}
                       :exactMix ? {img:pathMix(exactMix.key),title:exactMix.name,desc:exactMix.desc,type:'MIXED MOOD · PRE-DRAWN SAMPLE'}
                                   : null;
  const nearest=match?null:nearestMixed();
  current={key, image:match?match.img:pathMix(nearest.key), exact:!!match, title:match?match.title:`${name(state.v)} + ${name(state.a)} + ${name(state.r)}`};
  const img=$('#resultImage');img.src=current.image;
  img.alt= match?`Illustrated Trogebob fusion: ${current.title}`:`Example artwork for ${nearest.name}; not a drawing of the currently selected expressions`;
  const view=$('#resultViewport');view.classList.remove('bump');void view.offsetWidth;view.classList.add('bump');
  $('#resultKind').textContent=match?match.type:'NEW COMBINATION · NEAREST SAMPLE';
  $('#resultTitle').textContent=match?match.title:current.title;
  $('#resultDescription').textContent=match?match.desc:`No custom Trogebob artwork exists for this combination yet. Showing the closest finished sample (${nearest.name}) with your precise selections underneath.`;
  $('#unmadeNote').hidden=!!match;
  $('#unstableOverlay').hidden=!!match;
  if(!match){for(const id of ['v','a','r'])$(`#selected${id.toUpperCase()}`).src=pathMood(id,state[id]);}
}
function setAll(mood){for(const f of FOUNDERS)state[f.id]=mood;updateSelection();renderResult();document.querySelector('#resultViewport').scrollIntoView({block:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
function randomize(){let arr;const q=MIXED[Math.floor(Math.random()*MIXED.length)];arr=q.key.split('-');[state.v,state.a,state.r]=arr;updateSelection();renderResult();}
function populatePrints(){
 const strip=$('#resultStrip');MOODS.forEach(m=>{const div=document.createElement('div');div.className='face-print';div.innerHTML=`<img loading="lazy" src="${pathSame(m)}" alt="${name(m)} times three illustration"><h3>${name(m)} ×3</h3><button type="button">TRY THIS MOOD ↗</button>`;div.querySelector('button').onclick=()=>{setAll(m);$('#lab').scrollIntoView({behavior:'smooth'});};strip.appendChild(div);});
 const gallery=[['confused','THREE DIFFERENT OPINIONS'],['suspicious','IS THIS US?!'],['angry','NOT MY SCENE'],['award','ACCEPTING OUR OWN AWARD'],['couch','THREE BRAINS. ONE COUCH.']];
 gallery.forEach(([key,label])=>{const b=document.createElement('button');b.type='button';b.className='meme-card';b.innerHTML=`<img loading="lazy" alt="Trogebob parody cartoon: ${label}" src="assets/gallery/${key}.webp"><span>${label}</span>`;b.onclick=()=>openLightbox(`assets/gallery/${key}.webp`,label);$('#memeWall').appendChild(b);});
 MIXED.forEach(m=>{const b=document.createElement('button');b.type='button';b.className='mixed-card';b.innerHTML=`<img loading="lazy" src="${pathMix(m.key)}" alt="Trogebob mixed expression ${m.name}"><span>${m.name}</span>`;b.onclick=()=>openLightbox(pathMix(m.key),m.name);$('#mixedWall').appendChild(b);});
}
function openLightbox(src,caption){const dialog=$('#lightbox');$('#lightboxImage').src=src;$('#lightboxImage').alt=caption;$('#lightboxCaption').textContent=caption;if(!dialog.open)dialog.showModal();}
function setupNavigation(){
 const menu=$('#menuToggle'),mob=$('#mobileMenu');menu.addEventListener('click',()=>{mob.hidden=!mob.hidden;menu.setAttribute('aria-expanded',String(!mob.hidden));});
 $$('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>{mob.hidden=true;menu.setAttribute('aria-expanded','false');}));
 const rail=$('#comicRail');$('#storyPrev').onclick=()=>rail.scrollBy({left:-rail.clientWidth*.75,behavior:'smooth'});$('#storyNext').onclick=()=>rail.scrollBy({left:rail.clientWidth*.75,behavior:'smooth'});
 $('#closeLightbox').onclick=()=>$('#lightbox').close();$('#lightbox').addEventListener('click',e=>{if(e.target===$('#lightbox'))$('#lightbox').close();});
}
function isValidAddress(addr){return /^0x[a-f\d]{40}$/i.test(addr||'');}
function isValidURL(url){try{const u=new URL(url);return u.protocol==='https:'&&u.hostname.length>3;}catch{return false;}}
function setupTrading(){
 const cfg=window.TROGEBOB_CONFIG||{};const address=isValidAddress(cfg.ethereumContract)?cfg.ethereumContract:'';const ready=Boolean(address)&&isValidURL(cfg.officialBuyUrl);
 if(address){$('#contractDisplay').textContent=address;$('#copyContract').disabled=false;$('#copyContract').onclick=()=>navigator.clipboard.writeText(address).then(()=>{const b=$('#copyContract');b.textContent='COPIED ✓';setTimeout(()=>b.textContent='COPY ADDRESS',1300);});}
 if(ready){$('#launchStatus').textContent='Confirm the contract matches the verified official listing before trading.';}
 $$('.trading-link').forEach(a=>{
  if(ready){a.href=cfg.officialBuyUrl;a.target='_blank';a.rel='noopener noreferrer';a.removeAttribute('aria-disabled');}
  else{a.setAttribute('aria-disabled','true');a.addEventListener('click',e=>{e.preventDefault();$('#info').scrollIntoView({behavior:'smooth'});});}
 });
}
async function createShareablePNG(){
  const img=new Image();img.decoding='async';img.src=current.image;
  await new Promise((resolve,reject)=>{if(img.complete&&img.naturalWidth)resolve();else{img.onload=resolve;img.onerror=reject;}});
  const cv=document.createElement('canvas');cv.width=cv.height=1080;const ctx=cv.getContext('2d');
  ctx.fillStyle='#fff8db';ctx.fillRect(0,0,1080,1080);
  ctx.fillStyle='#17112e';ctx.fillRect(0,0,1080,140);ctx.fillStyle='#f2ff39';ctx.font='bold 70px Impact,Arial Black,sans-serif';ctx.fillText('TROGEBOB',52,95);
  ctx.font='bold 27px sans-serif';ctx.fillStyle='#fff';ctx.fillText('THREE FACES. ONE MIND — OR THREE?!',52,128);
  let sx=64,sy=170,sw=952,sh=728;const r=Math.min(sw/img.width,sh/img.height);const w=img.width*r,h=img.height*r;
  ctx.fillStyle='#ffffff';ctx.fillRect(sx,sy,sw,sh);ctx.drawImage(img,sx+(sw-w)/2,sy+(sh-h)/2,w,h);
  if(!current.exact){
    ctx.fillStyle='rgba(23,17,46,.88)';ctx.fillRect(sx,sy+sh-185,sw,185);
    const images=await Promise.all(['v','a','r'].map(id=>new Promise(resolve=>{const p=new Image();p.src=pathMood(id,state[id]);p.onload=()=>resolve(p);p.onerror=()=>resolve(null)})));
    images.forEach((p,i)=>{if(p)ctx.drawImage(p,145+i*295,sy+sh-178,150,133);});
    ctx.fillStyle='#edff40';ctx.font='bold 29px Impact,sans-serif';ctx.fillText('UNRELEASED COMBO · SAMPLE IMAGE ABOVE',115,sy+sh-13);
  }
  ctx.fillStyle='#17112e';ctx.fillRect(0,916,1080,164);ctx.fillStyle='#edff40';ctx.font='bold 50px Impact,sans-serif';ctx.fillText(current.title.slice(0,34),52,990);
  ctx.fillStyle='white';ctx.font='bold 23px sans-serif';ctx.fillText('$TROGEBOB · INDEPENDENT PARODY',52,1035);
  return new Promise(resolve=>cv.toBlob(resolve,'image/png'));
}
async function saveMeme(){
 try{const blob=await createShareablePNG();if(!blob)throw Error('Image export unavailable');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`trogebob-${current.key}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}catch{alert('Could not export this image. Try a screenshot instead.');}
}
async function shareMeme(){const str=`$TROGEBOB: ${current.title} — Three faces. One mind or three?! (independent parody)`;
 try{if(navigator.share){await navigator.share({title:'Trogebob',text:str,url:location.href.split('#')[0]+'#lab'});return;}
 if(navigator.clipboard){await navigator.clipboard.writeText(str+' '+location.href.split('#')[0]+'#lab');$('#shareBtn').textContent='COPIED! ✓';setTimeout(()=>$('#shareBtn').textContent='↗ SHARE',1200);return;}
 }catch(e){if(e.name==='AbortError')return;}prompt('Copy this meme caption:',str);
}
window.addEventListener('DOMContentLoaded',()=>{
 createMoodButtons();updateSelection();renderResult();populatePrints();setupNavigation();setupTrading();
 $$('.preset').forEach(b=>b.addEventListener('click',()=>setAll(b.dataset.preset)));
 $('#randomizeBtn').onclick=randomize;$('#downloadBtn').onclick=saveMeme;$('#shareBtn').onclick=shareMeme;
});
