(()=>{
const C=window.CFG||{};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const scenes=$$('.scene');let cur=0;
const conf=o=>{try{window.confetti&&confetti(o)}catch(e){}};

/* ---------- VIDEO MANAGER (fix) ---------- */
const VMAP=Object.assign({0:'moon',1:'gift',2:'hearts',3:'hearts',4:'lanterns',5:'balloons',6:'hearts',7:'fireworks',8:'moon',9:'lanterns'},C.sceneVideo||{});
const vids={};$$('.bgv').forEach(v=>{vids[v.dataset.k]=v;
  v.muted=true;v.setAttribute('playsinline','');
  v.addEventListener('playing',()=>{if(vcur===v.dataset.k)v.classList.add('on')});
  v.addEventListener('canplay',()=>{if(vcur===v.dataset.k&&v.paused)v.play().catch(()=>{})});
  v.addEventListener('error',()=>v.classList.remove('on'));
});
let vcur=null;
function playVideo(k){
  vcur=k;
  for(const key in vids){const v=vids[key];
    if(key!==k){v.classList.remove('on');v.pause();continue}
    if(!v.getAttribute('src')){v.src=v.dataset.src;v.load()}
    if(!v.loop){try{v.currentTime=0}catch(e){}}
    v.muted=true;const p=v.play();if(p&&p.catch)p.catch(()=>{});
  }
}
const retry=()=>{if(vcur)playVideo(vcur)};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)retry()});
['pointerdown','touchstart','keydown'].forEach(e=>addEventListener(e,retry,{once:true,passive:true}));

/* ---------- SCENES ---------- */
function go(n){
  if(n<0||n>=scenes.length)return;
  scenes[cur].classList.remove('on');cur=n;
  const s=scenes[n];s.classList.add('on');s.scrollTop=0;
  playVideo(VMAP[n]);
  if($('[data-t]',s))typeScene(s);
  const id=s.id;
  if(id==='s2'||id==='s7')burst();
  if(id==='s2')flyPols();
  if(id==='s5')startCake();
  if(id==='s6'&&env)resetEnv();
  if(id==='s9')startArt();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-next]');if(!b||b.disabled)return;
  go(cur+1);
});
function burst(){conf({particleCount:120,spread:90,origin:{y:.6}});setTimeout(()=>conf({particleCount:80,angle:60,spread:60,origin:{x:0,y:.7}}),300);setTimeout(()=>conf({particleCount:80,angle:120,spread:60,origin:{x:1,y:.7}}),500)}

/* ---------- TYPEWRITER ---------- */
let tw=0,skip=false;
async function typeScene(sc){
  const id=++tw;skip=false;
  const ps=$$('[data-t]',sc);
  ps.forEach(p=>{if(p._t==null)p._t=Array.from(p.textContent);p.textContent=''});
  const nx=$('.next',sc);if(nx)nx.classList.remove('show');
  for(const p of ps){
    for(let i=1;i<=p._t.length;i++){
      if(id!==tw)return;
      if(skip)break;
      p.textContent=p._t.slice(0,i).join('');
      await sleep(32);
    }
    p.textContent=p._t.join('');
  }
  if(id===tw&&nx)nx.classList.add('show');
}
$$('.card').forEach(c=>c.addEventListener('click',()=>{skip=true}));

/* ---------- COUNTDOWN GATE ---------- */
const target=new Date(C.unlock||Date.now()).getTime();
const fl=$$('#flip .fl b'),code=$('#code'),hint=$('#hint'),goBtn=$('#goBtn');
const pad=n=>String(n).padStart(2,'0');
function tick(){
  let d=Math.max(0,target-Date.now());
  const v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
  v.forEach((x,i)=>fl[i].textContent=pad(x));
  const timeOk=d===0,codeOk=code.value===String(C.code);
  if(code.value.length<4){hint.textContent='';}
  else if(!codeOk)hint.textContent='වැරදියි 💔 ආයෙ try කරන්න';
  else if(!timeOk)hint.textContent='Code එක හරි ❤️ ටිකක් ඉන්න, වෙලාව තාම ඇවිත් නෑ';
  else hint.textContent='හරි! ❤️';
  const ok=timeOk&&codeOk;
  goBtn.disabled=!ok;
  goBtn.textContent=ok?'Open your surprise 💖':'Waiting for the moment…';
}
setInterval(tick,1000);code.addEventListener('input',tick);tick();

/* ---------- BACKGROUND PARTICLES ---------- */
const bg=$('#bg'),bx=bg.getContext('2d');let P=[];
function rs(){bg.width=innerWidth;bg.height=innerHeight}rs();addEventListener('resize',rs);
for(let i=0;i<60;i++)P.push({x:Math.random(),y:Math.random(),s:Math.random()*10+6,v:Math.random()*.0006+.0002,a:Math.random()*.5+.2});
(function loop(){
  bx.clearRect(0,0,bg.width,bg.height);
  for(const p of P){p.y-=p.v;if(p.y<-.05){p.y=1.05;p.x=Math.random()}
    bx.globalAlpha=p.a;bx.font=p.s+'px serif';bx.fillText('♥',p.x*bg.width,p.y*bg.height);bx.fillStyle='#ff7eb3'}
  requestAnimationFrame(loop);
})();

/* ---------- TAP SPARKLES ---------- */
const sp=$('#spark'),sx=sp.getContext('2d');let SP=[];
function rs2(){sp.width=innerWidth;sp.height=innerHeight}rs2();addEventListener('resize',rs2);
addEventListener('pointerdown',e=>{for(let i=0;i<10;i++)SP.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*5,vy:(Math.random()-.8)*5,l:1})});
(function sl(){sx.clearRect(0,0,sp.width,sp.height);
  SP=SP.filter(p=>p.l>0);for(const p of SP){p.x+=p.vx;p.y+=p.vy;p.vy+=.12;p.l-=.02;sx.globalAlpha=Math.max(p.l,0);sx.font='16px serif';sx.fillText(p.c||'💖',p.x,p.y)}
  requestAnimationFrame(sl)})();

/* ---------- GIFT ---------- */
let gifted=false;
$('#gift').addEventListener('click',async()=>{
  if(gifted)return;gifted=true;
  const v=vids.giftopen;playVideo('giftopen');conf({particleCount:80,spread:70,origin:{y:.6}});
  await Promise.race([new Promise(r=>{v.addEventListener('ended',r,{once:true})}),sleep(4000)]);
  gifted=false;go(2);
});

/* ---------- POLAROID WALL + LIGHTBOX ---------- */
const photos=(C.photos&&C.photos.length?C.photos:[{src:'',cap:'Memory'}]);
const wall=$('#wall'),lb=$('#lb');let li=0;
photos.forEach((p,i)=>{
  const d=document.createElement('div');d.className='pol';d.style.setProperty('--r',((i%2?1:-1)*(2+i%3*2))+'deg');
  const ph=document.createElement('div');ph.className='ph';ph.textContent='💖';
  const im=new Image();im.loading='lazy';im.alt=p.cap||'';im.src=p.src;im.onload=()=>ph.replaceWith(im);
  d.append(ph);const c=document.createElement('small');c.textContent=p.cap||'';d.append(c);
  d.onclick=()=>openLb(i);wall.append(d);
});
function openLb(i){li=(i+photos.length)%photos.length;const p=photos[li];
  $('#lbImg').src=p.src;$('#lbImg').alt=p.cap||'';$('#lbCap').textContent=p.cap||'';lb.classList.add('on')}
$('#lbPrev').onclick=e=>{e.stopPropagation();openLb(li-1)};
$('#lbNext').onclick=e=>{e.stopPropagation();openLb(li+1)};
lb.onclick=()=>lb.classList.remove('on');
addEventListener('keydown',e=>{if(!lb.classList.contains('on'))return;
  if(e.key==='Escape')lb.classList.remove('on');if(e.key==='ArrowLeft')openLb(li-1);if(e.key==='ArrowRight')openLb(li+1)});

/* ---------- 3D CAKE ---------- */
const ck={};
function flameTex(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const r=g.createRadialGradient(32,32,2,32,32,30);r.addColorStop(0,'#fff');r.addColorStop(.3,'#ffd54a');r.addColorStop(1,'#ff6a0000');g.fillStyle=r;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
function startCake(){
  $('#cakeMsg').textContent='';$('#cakePop').textContent='';$('#cakeHint').style.display='';$('#cakeNext').classList.remove('show');
  if(!window.THREE)return;
  if(!ck.init){
    ck.init=true;const cv=$('#cake3d');
    const R=ck.r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
    const S=ck.s=new THREE.Scene(),cam=ck.c=new THREE.PerspectiveCamera(40,1,.1,50);cam.position.set(0,3.4,8);cam.lookAt(0,1.4,0);
    S.add(new THREE.AmbientLight(0xffffff,.7));const dl=new THREE.DirectionalLight(0xffffff,.8);dl.position.set(3,6,4);S.add(dl);
    ck.pl=new THREE.PointLight(0xffaa33,1.2,8);ck.pl.position.set(0,3,0);S.add(ck.pl);
    const g=ck.g=new THREE.Group();S.add(g);
    const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.5});
    const t1=new THREE.Mesh(new THREE.CylinderGeometry(2,2,1,48),M(0xff7eb3));t1.position.y=.5;
    const t2=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,.9,48),M(0xfff0f5));t2.position.y=1.45;
    const ic=(r,y)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(r,.1,12,48),M(0xffffff));m.rotation.x=Math.PI/2;m.position.y=y;return m};
    g.add(t1,t2,ic(2,1),ic(1.4,1.9));
    const plate=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,.1,48),M(0xe8c27a));plate.position.y=-.05;g.add(plate);
    ck.fl=[];const ft=flameTex();
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=Math.cos(a)*.85,z=Math.sin(a)*.85;
      const cd=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.6,12),M(i%2?0x7ec8ff:0xffd54a));cd.position.set(x,2.2,z);g.add(cd);
      const f=new THREE.Sprite(new THREE.SpriteMaterial({map:ft,blending:THREE.AdditiveBlending,depthWrite:false}));f.scale.set(.5,.7,1);f.position.set(x,2.75,z);g.add(f);ck.fl.push(f)}
    const tc=document.createElement('canvas');tc.width=256;tc.height=128;const x2=tc.getContext('2d');x2.font='700 110px Cormorant Garamond,serif';x2.textAlign='center';x2.fillStyle='#ffd54a';x2.shadowColor='#ff4d8d';x2.shadowBlur=18;x2.fillText('24',128,100);
    const n=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(tc),transparent:true}));n.scale.set(2.4,1.2,1);n.position.set(0,3.9,0);S.add(n);
    const resize=()=>{const w=cv.clientWidth||300;R.setSize(w,w,false)};resize();addEventListener('resize',resize);
    const box=$('#cakeBox');box.addEventListener('click',blow);box.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')blow()});
  }
  ck.out=false;ck.fl.forEach(f=>f.visible=true);ck.pl.intensity=1.2;ck.run=true;
  (function draw(t){if(cur!==5){ck.run=false;return}requestAnimationFrame(draw);
    ck.g.rotation.y+=.006;if(!ck.out){ck.fl.forEach((f,i)=>{const s=1+Math.sin(t/90+i)*.12;f.scale.set(.5*s,.7*s,1)});ck.pl.intensity=1.1+Math.sin(t/70)*.2}
    ck.r.render(ck.s,ck.c)})(0);
  startMic();
}
function blow(){
  if(ck.out||cur!==5)return;ck.out=true;
  ck.fl.forEach(f=>f.visible=false);ck.pl.intensity=0;
  $('#cakePop').textContent='🎉💨🎉';$('#cakeMsg').textContent='Happy Birthday Chuti! ❤️';$('#cakeHint').style.display='none';
  burst();$('#cakeNext').classList.add('show');stopMic();
}
async function startMic(){
  if(ck.mic||!navigator.mediaDevices)return;
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});ck.mic=st;
    const ac=new (window.AudioContext||window.webkitAudioContext)(),an=ac.createAnalyser();an.fftSize=512;ac.createMediaStreamSource(st).connect(an);
    const d=new Uint8Array(an.fftSize);let hot=0;ck.ac=ac;
    (function m(){if(!ck.mic)return;an.getByteTimeDomainData(d);let s=0;for(const v of d)s+=((v-128)/128)**2;
      hot=Math.sqrt(s/d.length)>.25?hot+1:0;if(hot>8)blow();requestAnimationFrame(m)})();
  }catch(e){}
}
function stopMic(){if(ck.mic){ck.mic.getTracks().forEach(t=>t.stop());ck.mic=null}if(ck.ac)ck.ac.close().catch(()=>{})}

/* ---------- ENVELOPE (full letter) ---------- */
const env=$('#env'),ecard=env&&$('.env-card',env);
function resetEnv(){env.classList.remove('open');env.style.marginTop='';$('#envHint').style.opacity=1}
function openEnv(){
  if(env.classList.contains('open'))return;
  const h=ecard.scrollHeight;ecard.style.setProperty('--h',h+'px');
  env.style.marginTop=Math.max(24,h-200)+'px';
  env.classList.add('open');$('#envHint').style.opacity=0;
  setTimeout(()=>{scenes[6].scrollTo({top:0,behavior:'smooth'})},300);
  setTimeout(()=>conf({particleCount:60,spread:70,origin:{y:.5}}),900);
}
if(env){env.addEventListener('click',openEnv);env.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openEnv()}})}
const rp=$('#replay');if(rp)rp.addEventListener('click',e=>{e.stopPropagation();go(2)});
$('#reveal').onclick=()=>{$('#secret').classList.add('on');burst()};
$('#closeS').onclick=()=>$('#secret').classList.remove('on');

/* ---------- 3D HEARTS (final scene) ---------- */
const ar={};
function startArt(){
  if(!window.THREE||!$('#art3d'))return;
  if(!ar.init){ar.init=true;const cv=$('#art3d');
    const R=ar.r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));
    const S=ar.s=new THREE.Scene(),cam=ar.c=new THREE.PerspectiveCamera(60,1,.1,100);cam.position.z=14;
    S.add(new THREE.AmbientLight(0xffffff,.8));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(2,4,6);S.add(dl);
    const sh=new THREE.Shape();sh.moveTo(0,0);sh.bezierCurveTo(0,.6,-.9,.9,-.9,.3);sh.bezierCurveTo(-.9,-.3,-.3,-.6,0,-1.1);sh.bezierCurveTo(.3,-.6,.9,-.3,.9,.3);sh.bezierCurveTo(.9,.9,0,.6,0,0);
    const geo=new THREE.ExtrudeGeometry(sh,{depth:.3,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:2});
    ar.h=[];for(let i=0;i<28;i++){const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:[0xff4d8d,0xff7eb3,0xffc2d9,0xe91e63][i%4],roughness:.35}));
      m.position.set((Math.random()-.5)*26,(Math.random()-.5)*18,(Math.random()-.5)*10-2);const s=.5+Math.random()*1.1;m.scale.set(s,s,s);m.userData.v=.01+Math.random()*.02;m.userData.r=(Math.random()-.5)*.03;S.add(m);ar.h.push(m)}
    const rz=()=>{R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};rz();addEventListener('resize',rz);
  }
  (function d(){if(cur!==9)return;requestAnimationFrame(d);
    ar.h.forEach(m=>{m.position.y+=m.userData.v;m.rotation.y+=m.userData.r*2;m.rotation.z+=m.userData.r/2;if(m.position.y>10)m.position.y=-10});
    ar.r.render(ar.s,ar.c)})();
}

/* ---------- MUSIC PLAYER ---------- */
const au=new Audio();au.loop=true;au.preload='auto';if(C.song)au.src=C.song;
const pb=$('#play'),viz=$('#viz');
viz.innerHTML='<i></i><i></i><i></i><i></i><i></i>';
const ui=()=>{pb.textContent=au.paused?'▶':'❚❚';viz.classList.toggle('on',!au.paused)};
au.addEventListener('play',ui);au.addEventListener('pause',ui);
au.addEventListener('error',()=>{$('#sname').textContent='Song එක නෑ — "Add song" ඔබන්න'});
pb.onclick=()=>{au.paused?au.play().catch(()=>{}):au.pause()};
$('#song').onchange=e=>{const f=e.target.files[0];if(!f)return;au.src=URL.createObjectURL(f);$('#sname').textContent=f.name.slice(0,22);au.play().catch(()=>{})};
goBtn.addEventListener('click',()=>{if(au.src)au.play().catch(()=>{})}); // unlock click = user gesture

/* ---------- MOUSE / TOUCH ANIMATIONS (tilt, parallax, trail) ---------- */
const tilts=$$('.tilt'),vl=$('#vl');
function tiltTo(x,y){
  tilts.forEach(el=>{el.style.transform='perspective(900px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg)'});
  vl.style.transform='scale(1.08) translate('+(-x*14)+'px,'+(-y*14)+'px)';
}
let lastT=0;
addEventListener('pointermove',e=>{
  tiltTo(e.clientX/innerWidth*2-1,e.clientY/innerHeight*2-1);
  const n=performance.now();if(n-lastT<45)return;lastT=n;
  SP.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*1.5,vy:Math.random()*1.5-.5,l:.8,c:Math.random()<.5?'✨':'💗'});
},{passive:true});
document.addEventListener('pointerleave',()=>tiltTo(0,0));
// phones: tilt the phone to move the cards (iOS needs permission on first tap)
const clamp=v=>Math.max(-1,Math.min(1,v));
addEventListener('deviceorientation',e=>{if(e.gamma==null)return;tiltTo(clamp(e.gamma/30),clamp((e.beta-45)/30))});
addEventListener('pointerdown',()=>{if(window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)DeviceOrientationEvent.requestPermission().catch(()=>{})},{once:true});

/* ---------- FLYING POLAROIDS (title scene) ---------- */
let flown=false;
function flyPols(){
  if(flown)return;flown=true;
  const f=document.createElement('div');f.className='fly';
  for(let i=0;i<8;i++){
    const p=photos[i%photos.length],d=document.createElement('div');d.className='fp';
    d.style.cssText='left:'+(4+i*12)+'%;--d:'+(14+i%3*4)+'s;--dl:'+(-i*2.2)+'s;--r:'+((i%2?1:-1)*(6+i*2))+'deg';
    const im=new Image();im.src=p.src;im.onerror=()=>{im.remove();d.textContent='💖'};d.append(im);f.append(d);
  }
  scenes[2].prepend(f);
}

/* ---------- START ---------- */
playVideo(VMAP[0]);ui();
})();
