const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
if(!window.confetti)window.confetti=()=>{}; // site still works if the confetti CDN is blocked
const fx={z:10}; // camera depth per scene

/* ===== 1. Three.js: glowing heart, halo, orbiting hearts, particles ===== */
if(window.THREE)(function(){ // skipped gracefully if the CDN is blocked
  const r=new THREE.WebGLRenderer({canvas:$('#bg'),antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
  const scn=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,200);
  const sh=new THREE.Shape();sh.moveTo(0,-2.2);sh.bezierCurveTo(-3.6,.4,-2.2,3,0,1.4);sh.bezierCurveTo(2.2,3,3.6,.4,0,-2.2);
  const geo=new THREE.ExtrudeGeometry(sh,{depth:1.1,bevelEnabled:true,bevelThickness:.5,bevelSize:.45,bevelSegments:10,curveSegments:36});geo.center();
  const heart=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:0xff4fa3,emissive:0x5a0a3a,metalness:.3,roughness:.25,clearcoat:1}));
  heart.position.set(0,.2,-3);scn.add(heart);
  scn.add(new THREE.AmbientLight(0x4b1d8f,1.1));
  const L=[[0xff4fa3,-6,4,6],[0xffd9a0,6,-3,5],[0x8a4dff,0,6,-4]].map(([c,x,y,z])=>{const l=new THREE.PointLight(c,2.4,40);l.position.set(x,y,z);scn.add(l);return l});
  const hc=document.createElement('canvas');hc.width=hc.height=128;const hx=hc.getContext('2d'),g=hx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,79,163,.9)');g.addColorStop(.4,'rgba(255,79,163,.25)');g.addColorStop(1,'rgba(255,79,163,0)');hx.fillStyle=g;hx.fillRect(0,0,128,128);
  const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(hc),blending:THREE.AdditiveBlending,depthWrite:false}));halo.scale.set(14,14,1);halo.position.set(0,.2,-4.5);scn.add(halo);
  const orbit=new THREE.Group();orbit.position.set(0,.2,-3);
  for(let i=0;i<14;i++){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:i%2?0xffd9a0:0xff8cc6}));const a=i/14*6.283;m.position.set(Math.cos(a)*5.5,Math.sin(a*2)*.8,Math.sin(a)*5.5);m.scale.setScalar(.09);orbit.add(m)}
  scn.add(orbit);
  const N=1500,P=new Float32Array(N*3),C=new Float32Array(N*3),pal=[0xff4fa3,0xffd9a0,0x9b6bff].map(c=>new THREE.Color(c));
  for(let i=0;i<N;i++){P.set([(Math.random()-.5)*50,(Math.random()-.5)*34,(Math.random()-.5)*40-4],i*3);C.set([pal[i%3].r,pal[i%3].g,pal[i%3].b],i*3)}
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(P,3));pg.setAttribute('color',new THREE.BufferAttribute(C,3));
  const stars=new THREE.Points(pg,new THREE.PointsMaterial({size:.12,vertexColors:true,transparent:true,opacity:.85,depthWrite:false,blending:THREE.AdditiveBlending}));scn.add(stars);
  const m={x:0,y:0,tx:0,ty:0},mv=(x,y)=>{m.tx=(x/innerWidth-.5)*2;m.ty=(y/innerHeight-.5)*2};
  addEventListener('mousemove',e=>mv(e.clientX,e.clientY));addEventListener('touchmove',e=>mv(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
  const rz=()=>{r.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',rz);rz();
  const clk=new THREE.Clock();
  (function loop(){
    const t=clk.getElapsedTime();m.x+=(m.tx-m.x)*.05;m.y+=(m.ty-m.y)*.05;
    cam.position.z+=(fx.z-cam.position.z)*.04;cam.position.x=m.x*.8;cam.position.y=-m.y*.5;cam.lookAt(0,0,0);
    heart.rotation.y=t*.45+m.x*.6;heart.rotation.x=m.y*.35;heart.position.y=.2+Math.sin(t)*.25;
    heart.scale.setScalar(.8+Math.pow(Math.sin(t*2.6),8)*.07);
    orbit.rotation.y=t*.35;orbit.rotation.z=.25;orbit.children.forEach(c=>c.rotation.y=t*2);
    halo.material.opacity=.75+Math.sin(t*2.6)*.25;halo.position.y=heart.position.y;
    stars.rotation.y=t*.02+m.x*.08;stars.rotation.x=m.y*.05;
    L[0].position.x=Math.sin(t*.7)*7;L[1].position.y=Math.cos(t*.6)*5;
    r.render(scn,cam);requestAnimationFrame(loop);
  })();
})();

/* ===== 2. Ambient layers: blurred rising hearts + cursor sparkles ===== */
for(let i=0;i<16;i++){const h=document.createElement('span');h.className='h';h.textContent='♥';
  h.style.cssText=`left:${Math.random()*100}%;font-size:${20+Math.random()*60}px;filter:blur(${1+Math.random()*3}px);animation-duration:${14+Math.random()*16}s;animation-delay:${-Math.random()*20}s`;document.body.appendChild(h)}
const spk=$('#spark'),sx=spk.getContext('2d');let sp=[];
const rs=()=>{spk.width=innerWidth;spk.height=innerHeight};rs();addEventListener('resize',rs);
const addSp=(x,y)=>{for(let i=0;i<2;i++)sp.push({x,y,vx:(Math.random()-.5)*1.2,vy:Math.random()*1.2+.3,l:1,c:Math.random()<.5?'255,217,160':'255,79,163'})};
addEventListener('mousemove',e=>addSp(e.clientX,e.clientY));addEventListener('touchmove',e=>addSp(e.touches[0].clientX,e.touches[0].clientY),{passive:true});
(function d(){sx.clearRect(0,0,spk.width,spk.height);sp=sp.filter(p=>p.l>0);sp.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.l-=.02;sx.fillStyle='rgba('+p.c+','+p.l+')';sx.beginPath();sx.arc(p.x,p.y,2.5*p.l+.5,0,7);sx.fill()});requestAnimationFrame(d)})();
$$('.tilt').forEach(el=>{el.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform=`perspective(900px) rotateY(${x*9}deg) rotateX(${-y*9}deg)`});el.addEventListener('pointerleave',()=>el.style.transform='')});

/* ===== 3. Confetti + fireworks ===== */
const COL=['#ff4fa3','#ffd9a0','#9b6bff','#ffffff'];
function burst(){confetti({particleCount:150,spread:100,origin:{y:.6},colors:COL});setTimeout(()=>{confetti({particleCount:80,angle:60,spread:70,origin:{x:0,y:.7},colors:COL});confetti({particleCount:80,angle:120,spread:70,origin:{x:1,y:.7},colors:COL})},250)}
function fireworks(ms=5000){const end=Date.now()+ms,R=(a,b)=>Math.random()*(b-a)+a;const iv=setInterval(()=>{if(Date.now()>end)return clearInterval(iv);confetti({startVelocity:32,spread:360,ticks:70,zIndex:100,particleCount:55,origin:{x:R(.1,.9),y:Math.random()*.5},colors:COL})},320)}

/* ===== 4. Photos (SVG placeholders — replace src values with real photos) ===== */
const MEM=CONFIG.photos.length?CONFIG.photos.map(p=>[p.cap||'','#ff4fa3','#8a4dff']):[['First hello','#ff4fa3','#8a4dff'],['Sunsets','#ffb347','#ff4fa3'],['Silly faces','#8a4dff','#2ad4ff'],['That trip','#ff6aa8','#ffd9a0'],['Late talks','#3b1b8f','#ff4fa3'],['Coffee dates','#ffd9a0','#ff4fa3'],['Our song','#ff8cc6','#6a3cff'],['Forever','#ff4fa3','#ffd9a0']];
const art=(a,b,i)=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="${90+i*35}" cy="110" r="60" fill="#fff" opacity=".18"/><path d="M200 330c-90-60-60-130 0-95 60-35 90 35 0 95z" fill="#fff" opacity=".9"/></svg>`);
const pic=i=>{const k=i%MEM.length,p=CONFIG.photos[k];return(p&&p.src)||art(MEM[k][1],MEM[k][2],k)};
const lb=$('#lb');
MEM.forEach(([cap0,a,b],i)=>{const cap=(CONFIG.photos[i]&&CONFIG.photos[i].cap)||cap0;const p=document.createElement('button');p.className='pl';p.style.cssText=`--r:${[-4,3,-2,5,-5,2,-3,4][i%8]}deg;--i:${i%8}`;
  p.innerHTML=`<img loading="lazy" src="${pic(i)}" alt="${cap||'Photo '+(i+1)}"><em>${cap}</em>`;
  p.onclick=()=>openLb(i);$('#wall').appendChild(p)});
lb.onclick=()=>lb.classList.remove('show');
let lbI=0;
function openLb(i){lbI=(i+MEM.length)%MEM.length;const im=$$('#wall .pl img')[lbI];$('#lbImg').src=im.src;$('#lbImg').alt=im.alt;$('#lbCap').textContent=MEM[lbI][0];lb.classList.add('show')}
$('#lbPrev').onclick=e=>{e.stopPropagation();openLb(lbI-1)};$('#lbNext').onclick=e=>{e.stopPropagation();openLb(lbI+1)};
// polaroids that fly into the corners on scene 2
[[4,3,-60,-50,-10],[3,70,60,-40,8],[62,4,40,-60,-6],[64,76,70,50,9],[40,80,0,60,-4],[8,40,-70,10,6]].forEach(([t,l,x,y,rot],i)=>{
  const f=document.createElement('div');f.className='fp';f.style.cssText=`top:${t}%;left:${l}%;--fx:${x}vw;--fy:${y}vh;--r:${rot}deg;--d:${.3+i*.25}s`;
  f.innerHTML=`<img src="${pic(i)}" alt="">`;$('#s2').appendChild(f)});

/* ===== 5. Scene director ===== */
const scenes=$$('.scene');let cur=0,timers=[];
const Z=[10,8,9,11,12,12,11,7];
/* Background clips: one <video> per mood, cross-faded with the scenes (mix-blend screen over the 3D heart) */
const VK={0:'moon',1:'gift',2:'hearts',3:'lanterns',5:'lanterns',6:'balloons',7:'fireworks'};
const vids=$$('.bgv');let autoMusic=false;
const needV=v=>{if(v&&!v.src)v.src=v.dataset.src};
function showBg(k){vids.forEach(v=>{if(v.dataset.k===k){needV(v);v.classList.add('on');v.play().catch(()=>{})}else{v.classList.remove('on');setTimeout(()=>{if(!v.classList.contains('on'))v.pause()},1400)}})}
function go(n){
  const prev=cur;if(prev===5&&n!==5)cakeStop();
  timers.forEach(clearTimeout);timers=[];cur=n;
  scenes.forEach((s,i)=>s.classList.toggle('on',i===n));fx.z=Z[n];
  showBg(VK[n]);needV(vids.find(v=>v.dataset.k===VK[n+1]));
  if(n===1&&prev===0&&!autoMusic){autoMusic=true;if(!playing)playBtn.click()} // start the song after the first tap
  if(enter[n])enter[n]();
}
showBg('moon');
document.addEventListener('click',e=>{if(e.target.closest('[data-next]:not(:disabled)'))go(cur+1)});
const seg=window.Intl&&Intl.Segmenter?new Intl.Segmenter('si',{granularity:'grapheme'}):null;
const chars=s=>seg?[...seg.segment(s)].map(x=>x.segment):Array.from(s);
async function typeLetter(){
  const ps=$$('#s3 [data-t]'),nx=$('#s3 .next');nx.classList.remove('show');
  ps.forEach(p=>{p.dataset.full=p.dataset.full||p.textContent;p.textContent=''});
  for(const p of ps)for(const c of chars(p.dataset.full)){if(cur!==3)return;p.textContent+=c;await new Promise(r=>setTimeout(r,30))}
  nx.classList.add('show');
}
const enter={
  2(){burst();timers.push(setTimeout(()=>go(3),9000))},
  3(){typeLetter()},
  5(){cakeStart()},
  7(){fireworks(6000);burst()}
};

/* S0: flip-card countdown to 20 Oct 2026 + MMDD unlock */
const target=new Date(...CONFIG.birthday).getTime(),goBtn=$('#goBtn');
function tick(){
  const d=Math.max(0,target-Date.now()),v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
  $$('#flip b').forEach((b,i)=>{const t=String(v[i]).padStart(2,'0');if(b.textContent!==t){b.textContent=t;b.classList.remove('f');void b.offsetWidth;b.classList.add('f')}});
  goBtn.disabled=d>0;goBtn.textContent=d>0?'Waiting for the moment…':'Open your surprise';
}
tick();setInterval(tick,1000);
$('#code').addEventListener('input',e=>{
  const c=e.target;c.value=c.value.replace(/\D/g,'');if(c.value.length<4){$('#hint').textContent='';return}
  if(c.value===CONFIG.code){burst();setTimeout(()=>go(1),600)}
  else{$('#hint').textContent='Not quite, think of a very special day 💭';c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');c.value=''}
});
/* S1: gift */
$('#gift').onclick=function(){
  if(this.dataset.busy)return;this.dataset.busy=1;
  if(!playing&&!userPaused)playBtn.click(); // phones only allow audio after a real tap
  const o=vids.find(v=>v.dataset.k==='giftopen');needV(o);
  vids.forEach(v=>{if(v.dataset.k==='gift')v.classList.remove('on')});
  o.currentTime=0;o.classList.add('on');o.play().catch(()=>{});
  setTimeout(burst,1200);
  let done=false;const fin=()=>{if(done)return;done=true;o.classList.remove('on');delete this.dataset.busy;go(2)};
  o.onended=fin;setTimeout(fin,4600);
};
/* S6/S7 */
$('#reveal').onclick=()=>{fireworks();setTimeout(()=>$('#secret').classList.add('show'),500)};
const closeS=()=>$('#secret').classList.remove('show');$('#closeS').onclick=closeS;
addEventListener('keydown',e=>{if(e.key==='Escape'){closeS();lb.classList.remove('show')}if(lb.classList.contains('show')){if(e.key==='ArrowRight')openLb(lbI+1);if(e.key==='ArrowLeft')openLb(lbI-1)}});
$('#replay').onclick=()=>go(1);

/* ===== 5b. CAKE: blow into the mic (or tap). 1st and 2nd blow = hint, 3rd blow = candles out + flower rain ===== */
const cakeEl=$('#cake'),msgEl=$('#cakeMsg'),hintEl=$('#cakeHint');
(function drawCake(){
  const ic=(id,x0,x1,y)=>{let h=`<rect x="${x0}" y="${y-4}" width="${x1-x0}" height="14" rx="7" fill="#fff6fb"/>`;
    for(let x=x0+14;x<x1-8;x+=22){const L=8+((x*7)%22);h+=`<line x1="${x}" x2="${x}" y1="${y+6}" y2="${y+6+L}" stroke="#fff6fb" stroke-width="11" stroke-linecap="round"/>`}$(id).innerHTML=h};
  ic('#ic1',38,282,228);ic('#ic2',68,252,158);ic('#ic3',100,220,98);
  let d='';for(let x=56;x<270;x+=20)d+=`<circle cx="${x}" cy="304" r="4.5" fill="url(#gd)"/>`;
  [[112,100],[208,100],[84,160],[236,160],[52,230],[268,230]].forEach(([x,y])=>{d+=`<path d="M${x} ${y-8}q4-10 9-12" stroke="#4a8a3a" stroke-width="2" fill="none"/><circle cx="${x}" cy="${y}" r="8" fill="#e0203f"/><circle cx="${x-3}" cy="${y-3}" r="2.2" fill="#fff" opacity=".6"/>`});
  $('#deco').innerHTML=d;
})();
const cake={blows:0,out:false,cool:0,raf:0,stream:null,ac:null,was:false};
const setMsg=(t,big)=>{msgEl.textContent=t;msgEl.classList.toggle('big',!!big)};
function wobble(on){cakeEl.classList.toggle('bl',on)}
function flowerRain(ms=8000){
  const sh=confetti.shapeFromText?['🌸','🌹','🌷','🌺','💮','🌼'].map(text=>confetti.shapeFromText({text,scalar:4})):undefined,end=Date.now()+ms;
  const iv=setInterval(()=>{if(Date.now()>end)return clearInterval(iv);
    confetti({particleCount:2,angle:90,spread:160,startVelocity:0,gravity:.45,ticks:420,scalar:sh?4:1.2,drift:Math.random()-.5,origin:{x:Math.random(),y:-.05},zIndex:100,...(sh?{shapes:sh}:{colors:COL})})},70);
}
function blow(){
  const now=Date.now();if(cake.out||now<cake.cool)return;cake.cool=now+1500;cake.blows++;
  wobble(true);setTimeout(()=>wobble(false),1100);
  if(cake.blows<3){setMsg('හිනාවෙලා හයියෙන් පිඹින්න 😊');return}
  cake.out=true;
  $$('.fm').forEach(f=>f.classList.add('out'));$$('.sm').forEach(m=>m.classList.add('show'));
  setTimeout(()=>{setMsg('මම ඔයාට ගොඩාක් ආදරෙයි චුටී ❤️',true);hintEl.style.display='none';flowerRain();burst();$('#cakeNext').classList.add('show')},700);
  cakeStop(true);
}
cakeEl.addEventListener('click',blow);
async function cakeStart(){
  cake.blows=0;cake.out=false;cake.cool=0;setMsg('');hintEl.style.display='';$('#cakeNext').classList.remove('show');
  $$('.fm').forEach(f=>f.classList.remove('out'));$$('.sm').forEach(m=>m.classList.remove('show'));
  cake.was=playing;if(playing)playBtn.click(); // pause the song so the mic only hears the blow
  try{
    const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    if(cur!==5){st.getTracks().forEach(t=>t.stop());return}
    cake.stream=st;cake.ac=new (window.AudioContext||window.webkitAudioContext)();
    const an=cake.ac.createAnalyser();an.fftSize=1024;cake.ac.createMediaStreamSource(st).connect(an);
    const buf=new Float32Array(an.fftSize);let base=0,n=0,loud=0;const t0=performance.now();let last=t0;
    (function loop(){
      if(cur!==5||cake.out)return;cake.raf=requestAnimationFrame(loop);
      an.getFloatTimeDomainData(buf);let sum=0;for(const x of buf)sum+=x*x;const rms=Math.sqrt(sum/buf.length);
      const now=performance.now(),dt=now-last;last=now;
      if(now-t0<700){base+=rms;n++;return} // measure room noise first
      const th=Math.max(.04,(base/n)*4+.02);
      if(rms>th){loud+=dt;wobble(true);if(loud>350){loud=0;blow()}}else{loud=Math.max(0,loud-dt*2);if(Date.now()>cake.cool)wobble(false)}
    })();
  }catch(e){hintEl.textContent='Mic එක allow කරලා නෑ, ඒ නිසා කේක් එක touch කරන්න 👆'}
}
function cakeStop(done){
  cancelAnimationFrame(cake.raf);
  if(cake.stream){cake.stream.getTracks().forEach(t=>t.stop());cake.stream=null}
  if(cake.ac){cake.ac.close().catch(()=>{});cake.ac=null}
  if(cake.was&&!playing){cake.was=false;playBtn.click()} // song comes back
}


/* ===== 6. Music: synth lullaby, or load your own song ===== */
const viz=$('#viz'),bars=[];for(let i=0;i<16;i++){const b=document.createElement('i');viz.appendChild(b);bars.push(b)}
let ctx,master,timer,vt,playing=false,step=0,el=null,an,data;
const notes=[261.6,329.6,392,523.3,392,329.6,293.7,349.2,440,587.3,440,349.2];
function note(f){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(.25,ctx.currentTime+.04);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+1.6);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+1.7)}
function start(){
  ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
  if(!master){master=ctx.createGain();master.gain.value=.5;master.connect(ctx.destination)}
  ctx.resume();
  if(el){el.play().catch(()=>{playing=false;playBtn.textContent='▶';stop()});vt=setInterval(()=>{an.getByteFrequencyData(data);bars.forEach((b,i)=>b.style.height=(4+data[i%data.length]/255*24)+'px')},60);return}
  timer=setInterval(()=>note(notes[step++%notes.length]),520);
  vt=setInterval(()=>bars.forEach((b,i)=>b.style.height=(4+Math.abs(Math.sin(Date.now()/260+i))*Math.random()*24)+'px'),120);
}
function stop(){if(el)el.pause();clearInterval(timer);clearInterval(vt);bars.forEach(b=>b.style.height='4px')}
const playBtn=$('#play');
playBtn.onclick=()=>{playing=!playing;playBtn.textContent=playing?'❚❚':'▶';playBtn.setAttribute('aria-label',playing?'Pause music':'Play music');playing?start():stop()};
function loadSong(url,name){
  if(playing)playBtn.click();
  ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
  const a=new Audio(url);a.loop=true;
  a.addEventListener('error',()=>{if(el===a){el=null;$('#sname').textContent='Birthday melody'}}); // missing file: fall back to synth melody
  const src=ctx.createMediaElementSource(a);an=ctx.createAnalyser();an.fftSize=64;data=new Uint8Array(an.frequencyBinCount);src.connect(an);an.connect(ctx.destination);
  el=a;$('#sname').textContent=name.slice(0,20);
}
let userPaused=false;
playBtn.addEventListener('click',e=>{if(e.isTrusted)userPaused=!playing});
$('#song').onchange=e=>{const f=e.target.files[0];if(f)loadSong(URL.createObjectURL(f),f.name)};
if(CONFIG.song)loadSong(CONFIG.song,CONFIG.songTitle||'Our song');
