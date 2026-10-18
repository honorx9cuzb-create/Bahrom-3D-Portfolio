import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const canvas=document.querySelector('#webgl');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.47;
const scene=new THREE.Scene();scene.background=new THREE.Color('#080e19');scene.fog=new THREE.FogExp2('#080e19',.019);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,150); camera.position.set(9.2,4.1,10.9);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.055;controls.target.set(2.55,2.52,-3.9);controls.maxPolarAngle=Math.PI/2-.035;controls.minDistance=3.3;controls.maxDistance=21;controls.enablePan=false;
const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(new RoomEnvironment(),.04).texture;pmrem.dispose();
const ambientLight=new THREE.HemisphereLight(0x97c7ff,0x0f1723,1.35);scene.add(ambientLight);
function lamp(color,intensity,x,y,z,range=14,shadow=false){const light=new THREE.PointLight(color,intensity,range,2);light.position.set(x,y,z);light.castShadow=shadow;if(shadow){light.shadow.mapSize.set(1024,1024);light.shadow.bias=-.0003}scene.add(light);return light;}
const keyLamp=lamp(0xa4dfff,42,-4.5,6.4,2,18,true);lamp(0x8c7dff,12,5.5,5.4,-5,12);lamp(0xffd4ad,16,.5,4.4,3,11);lamp(0x38d9ff,8,2.5,2.9,-4.1,6);
const MAT=(color,metalness=0,roughness=.65)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
const wall=MAT('#1b2a39',.06,.93),floor=MAT('#111a24',.18,.72),metal=MAT('#232f3d',.9,.28),black=MAT('#070b12',.35,.38),wood=MAT('#5a4439',.08,.47),chair=MAT('#111923',.12,.65);
const blue=new THREE.MeshStandardMaterial({color:0x42c7ff,emissive:0x0a8ad5,emissiveIntensity:2.1,metalness:.18,roughness:.25});
function mesh(geo,mat,x=0,y=0,z=0,parent=scene){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(w,h,d,mat,x,y,z,parent=scene){return mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,parent)}
function cyl(rt,rb,h,mat,x,y,z){return mesh(new THREE.CylinderGeometry(rt,rb,h,24),mat,x,y,z)}
const woodCanvas=document.createElement('canvas');woodCanvas.width=512;woodCanvas.height=512;const wc=woodCanvas.getContext('2d');wc.fillStyle='#28303a';wc.fillRect(0,0,512,512);for(let i=0;i<66;i++){const y=i*8;wc.fillStyle=i%3===0?'#323945':'#242c35';wc.fillRect(0,y,512,2);wc.strokeStyle='rgba(115,135,155,.14)';wc.beginPath();wc.moveTo(0,y+4);wc.lineTo(512,y+4);wc.stroke()}const floorTex=new THREE.CanvasTexture(woodCanvas);floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(5,5);floorTex.colorSpace=THREE.SRGBColorSpace;floor.map=floorTex;floor.needsUpdate=true;
box(22,.35,17,floor,0,-.17,0);box(22,9,.3,wall,0,4.3,-7.6);box(.3,9,17,wall,-11,4.3,0);
// Large concrete wall panels and floor grids
for(let i=-10;i<=10;i+=2){box(.012,7,.05,MAT('#29394b'),i,3.6,-7.43)}
for(let i=-7;i<=7;i+=2){box(21,.008,.011,MAT('#243747'),0,.014,i)}
// Wall acoustic panels and diffusers
for(let i=0;i<9;i++){const p=box(.14,2.7,.18,MAT(i%2?'#263b50':'#1b2b3d'),-7.3+i*.43,3.55,-7.30);p.castShadow=true;}
// Workstation L desk
box(7.5,.15,2.55,wood,2.0,1.58,-3.75);box(7.72,.06,2.68,metal,2.0,1.45,-3.75);
for(const x of [-1.1,5.1]){box(.17,1.46,.17,metal,x,.75,-4.72);box(.17,1.46,.17,metal,x,.75,-2.79)}
box(7.35,.08,.18,blue,2.0,1.43,-4.88);box(7.18,.03,.13,new THREE.MeshBasicMaterial({color:'#8de9ff'}),2.0,1.49,-4.89);
// Detailed keyboard and mouse
box(1.7,.05,.62,black,1.88,1.72,-2.95);
for(let r=0;r<4;r++)for(let c=0;c<13;c++){const k=box(.09,.015,.09,MAT((r+c)%7===0?'#1a8cbd':'#586879'),.96+c*.115,1.755,-3.15+r*.125);k.castShadow=false;}
const mouse=mesh(new THREE.SphereGeometry(.125,18,12),black,3.12,1.715,-2.98);mouse.scale.set(.72,.32,1.18);
// Desk mat
box(3.55,.014,1.2,MAT('#10151d'),2.0,1.66,-3.12);
// Screen textures (canvas painted locally, no third-party art)
function monitorTex(title,accent,lines){
 const c=document.createElement('canvas');c.width=1024;c.height=576;const g=c.getContext('2d');
 const gr=g.createLinearGradient(0,0,1024,576);gr.addColorStop(0,'#071724');gr.addColorStop(1,'#102741');g.fillStyle=gr;g.fillRect(0,0,1024,576);
 g.fillStyle='#14273a';g.fillRect(0,0,1024,58);g.fillStyle='#375873';for(let i=0;i<3;i++){g.beginPath();g.arc(28+i*23,29,5,0,Math.PI*2);g.fill();}
 g.fillStyle='#9cbacf';g.font='600 17px Arial';g.fillText('BAHROM.DEV / PROJECTS',123,36);
 g.fillStyle=accent;g.fillRect(36,92,6,350);g.fillStyle='#8caabe';g.font='bold 23px Arial';g.fillText('FEATURED WORK  /  2026',72,130);
 g.fillStyle='#f0f8ff';g.font='bold 91px Arial';g.fillText(title,70,267);
 g.fillStyle='#a1b9cb';g.font='26px Arial';lines.forEach((l,i)=>g.fillText(l,74,337+i*44));
 g.fillStyle=accent;g.fillRect(72,472,255,54);g.fillStyle='#071521';g.font='bold 22px Arial';g.fillText('EXPLORE  ↗',106,507);
 for(let i=0;i<8;i++){g.fillStyle=accent;g.globalAlpha=.08+i*.055;g.fillRect(734+i*28,385-i*35,16,128+i*35)}g.globalAlpha=1;
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
}
const clickable=[];
const info={Xabar:{type:'SOCIAL PLATFORM',title:'Xabar',text:'An ambitious multi-platform social network concept featuring real-time chat, stories, wallet, creator tools and marketplace modules. Development in progress.',tags:['Node.js','MongoDB','WebSocket','Android']},NurLevel:{type:'ANDROID APPLICATION',title:'NurLevel',text:'Native Android application developed with Kotlin and Jetpack Compose. Built around modern Android UI patterns and Google Play billing integrations.',tags:['Kotlin','Jetpack Compose','Android','Billing']},Fastpay:{type:'FULL-STACK WEB',title:'Fastpay',text:'Web development project exploring practical full-stack functionality using Laravel and React. Source repository available on GitHub.',tags:['Laravel','React','PHP','MySQL']},About:{type:'ABOUT ME',title:'Bahrom Nabiyev',text:'Software Engineering student at Turin Polytechnic University in Tashkent. Interested in app development, backend systems, testing and immersive digital experiences.',tags:['Software Engineering','Uzbekistan','Web','Mobile']}};
function monitor(x,y,z,w,h,angle,title,color,lines){const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=angle;scene.add(group);
box(w+.22,h+.18,.18,black,0,0,0,group);box(w+.08,h+.04,.03,metal,0,0,.084,group);const s=box(w,h,.012,new THREE.MeshBasicMaterial({map:monitorTex(title,color,lines),toneMapped:false}),0,0,.098,group);s.userData.project=title;clickable.push(s);
const glow=box(w+.03,h+.03,.01,new THREE.MeshBasicMaterial({color,transparent:true,opacity:.12}),0,0,.092,group);glow.castShadow=false;glow.receiveShadow=false;
box(.11,.58,.11,metal,0,-h/2-.31,-.19,group);box(.84,.05,.42,metal,0,-h/2-.53,-.14,group);box(.32,.02,.12,new THREE.MeshBasicMaterial({color:'#9feaff'}),0,-h/2-.5,.085,group);return group}
monitor(2.05,3.22,-4.62,2.72,1.56,0,'Xabar','#38dbff',['SOCIAL NETWORK','WEB / MOBILE / CHAT']);monitor(-.55,3.08,-4.12,2.08,1.28,.18,'NurLevel','#a987ff',['ANDROID APPLICATION','KOTLIN / COMPOSE']);monitor(4.75,3.07,-4.17,2.08,1.28,-.2,'Fastpay','#33e8b6',['FULL STACK PROJECT','LARAVEL / REACT']);
// Tower with tempered-glass style window
box(1.0,1.84,1.72,black,5.58,2.58,-3.74);box(.92,1.76,.08,metal,5.58,2.58,-4.56);box(.03,1.48,1.28,new THREE.MeshPhysicalMaterial({color:0x17314a,transparent:true,opacity:.46,metalness:.45,roughness:.08,transmission:.18}),6.11,2.62,-3.74);for(let i=0;i<3;i++){const ring=mesh(new THREE.TorusGeometry(.22,.02,12,44),blue,6.12,2.11+i*.49,-3.74);ring.rotation.y=Math.PI/2;const hub=mesh(new THREE.CylinderGeometry(.05,.05,.015,20),metal,6.12,2.11+i*.49,-3.74);hub.rotation.z=Math.PI/2;}box(.66,.05,.66,metal,5.58,1.69,-3.74);for(const z of [-4.38,-3.1])box(.08,.08,.14,metal,5.16,1.71,z);
// Workstation details: mesh ventilation, monitor webcam, desk hardware
for(let j=0;j<11;j++){box(.012,.56,.035,metal,5.19,2.0+j*.1,-4.24).castShadow=false;}
box(.16,.075,.13,black,2.05,4.13,-4.57);box(.022,.022,.016,blue,2.05,4.14,-4.48);
for(const x of [0.5,3.5])box(.58,.045,.15,metal,x,1.73,-4.48);
// Chair with wheels / ergonomic back
cyl(.58,.58,.18,chair,1.68,.84,.42);cyl(.08,.08,.58,metal,1.68,.48,.42);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const leg=box(.82,.09,.13,metal,1.68+Math.cos(a)*.34,.17,.42+Math.sin(a)*.34);leg.rotation.y=-a;}const seat=box(1.2,.18,1.02,chair,1.68,1.18,.3);seat.rotation.x=.02;const back=box(1.18,1.58,.2,chair,1.68,1.95,.98);back.rotation.x=-.22;box(1.2,.11,.2,metal,1.68,1.4,.75);box(.12,.8,.12,metal,1.1,1.42,.38);box(.12,.8,.12,metal,2.26,1.42,.38);
// Decorative shelving, books, glowing practicals
for(let j=0;j<3;j++)box(2.9,.12,.5,wood,-6.2,2.18+j*1.1,-6.9);
for(let j=0;j<15;j++){const b=box(.11+Math.random()*.13,.4+Math.random()*.34,.31,MAT(j%4===0?'#245378':j%3===0?'#706052':'#263748'),-7.45+j*.16,2.52+Math.floor(j/6)*1.1,-6.55);b.rotation.z=(Math.random()-.5)*.07;}
const globe=mesh(new THREE.IcosahedronGeometry(.26,2),new THREE.MeshStandardMaterial({color:0x91e7ff,emissive:0x168fd9,emissiveIntensity:2}),-5.7,4.49,-6.48);
// Floor lamp and extra wall decor for a fuller studio
const lampStem=box(.06,1.95,.06,metal,-2.9,1.1,-2.25);const lampHead=mesh(new THREE.ConeGeometry(.34,.42,24),MAT('#bca68a',.76,.24),-2.9,2.32,-2.25);lampHead.rotation.z=Math.PI;lamp(0xffc28a,5.2,-2.9,2.1,-2.25,6);box(1.6,.08,.22,wood,-3.4,4.9,-6.92);for(let i=0;i<7;i++){const b=box(.16,.42+((i*17)%3)*.11,.2,MAT(i%2?'#355977':'#5f6d7a'),-4.0+i*.18,5.19,-6.78);b.rotation.z=(i%2?-.06:.04);}box(1.4,1.0,.06,black,-2.7,3.25,-7.28);box(1.18,.02,.05,new THREE.MeshBasicMaterial({color:'#78dfff'}),-2.7,3.56,-7.22);
// V9: room furnishing and PC detailing (real-time procedural geometry)
const brushed=MAT('#687d91',.8,.32),trimMat=MAT('#3b5365',.7,.3),warm=MAT('#d4b58f',.15,.53);
for(let i=0;i<3;i++){
 const y=2.12+i*.49;
 const fanRing=mesh(new THREE.TorusGeometry(.205,.018,10,48),blue,6.145,y,-3.74);fanRing.rotation.y=Math.PI/2;
 const fanHub=mesh(new THREE.SphereGeometry(.055,16,12),brushed,6.158,y,-3.74);fanHub.scale.x=.3;
 for(let j=0;j<5;j++){const ang=j*Math.PI*2/5;const blade=mesh(new THREE.SphereGeometry(.12,10,8),trimMat,6.16,y+Math.cos(ang)*.11,-3.74+Math.sin(ang)*.11);blade.scale.set(.15,.6,.32);blade.rotation.x=ang;}
}
// A small extra shelf, framed wall decoration and practical floor trim.
box(3.1,.08,.44,wood,-6.15,5.5,-6.75);
for(let i=0;i<6;i++)box(.18,.34+(i%3)*.08,.22,MAT(i%2?'#587c8c':'#c7a079'),-7.22+i*.34,5.74,-6.65);
box(2.9,.045,.045,brushed,-6.15,4.3,-7.26);
box(2.0,1.08,.075,black,8.25,4.4,-7.24);
box(1.7,.76,.023,MAT('#20435b',.18,.4),8.25,4.4,-7.18);
for(const x of [-10.7,10.7])box(.05,.15,16,MAT('#506070',.3,.5),x,.12,0);

// CC0 downloadable third-party GLB models. Download them locally to /assets/ for the reliable offline-hosted variant.
// Remote endpoints may block CORS; the procedural room remains in place as a graceful fallback.
const gltfLoader = new GLTFLoader();
const models = [
  {name:'Realistic steel office desk', local:'assets/steel-office-desk.glb', remote:null, position:[-5.15,0,-2.7], width:3.1, rotate:Math.PI/2},
  {name:'Sheen lounge chair', local:'assets/sheen-chair.glb', remote:'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb', position:[-5.1,0,.45], width:1.45, rotate:Math.PI}
];
const loadingStatus=document.querySelector('#assetStatus');
function loadModel(def){
 const install=(gltf)=>{
   const object=gltf.scene;
   const bb=new THREE.Box3().setFromObject(object);
   const size=new THREE.Vector3();bb.getSize(size);
   if(!size.x||!Number.isFinite(size.x))throw Error('Invalid model dimensions');
   object.scale.setScalar(def.width/size.x);
   object.updateMatrixWorld(true);
   const fitted=new THREE.Box3().setFromObject(object);
   const center=new THREE.Vector3();fitted.getCenter(center);
   object.position.set(def.position[0]-center.x,def.position[1]-fitted.min.y,def.position[2]-center.z);
   object.rotation.y=def.rotate;
   object.traverse(child=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true;}});
   scene.add(object);
   if(loadingStatus)loadingStatus.textContent='3D assets: loaded '+def.name;
 };
 gltfLoader.load(def.local,install,undefined,()=>{
  if(def.remote){gltfLoader.load(def.remote,install,undefined,()=>{if(loadingStatus)loadingStatus.textContent='Detailed 3D studio active • optional assets unavailable';});}else if(loadingStatus)loadingStatus.textContent='Detailed 3D studio active • locally modeled furniture';
 });
}
models.forEach(loadModel);
// Luminous ceiling strips and wall art
box(9,.055,.085,blue,1.6,6.65,-6.9);box(.09,3.4,.07,blue,6,3.9,-7.32);
box(2.3,1.25,.06,black,7.3,3.7,-7.31);box(1.9,.03,.06,blue,7.3,3.9,-7.23);
// Rug
box(6,.02,3.2,MAT('#192837'),1.1,.02,.45);
const particles=[];const pgeom=new THREE.BufferGeometry(),positions=new Float32Array(250*3);for(let i=0;i<250;i++){positions[i*3]=(Math.random()-.5)*19;positions[i*3+1]=Math.random()*7;positions[i*3+2]=(Math.random()-.5)*14;}pgeom.setAttribute('position',new THREE.BufferAttribute(positions,3));const pts=new THREE.Points(pgeom,new THREE.PointsMaterial({size:.025,color:0x75ceff,transparent:true,opacity:.3}));scene.add(pts);

// V5 — architectural glass, emissive details and physically-based studio dressing.
const glass=new THREE.MeshPhysicalMaterial({color:0x92c9e3,roughness:.085,metalness:.04,transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
const gold=MAT('#bca68a',.76,.24),concrete=MAT('#29313e',.1,.94),neonViolet=new THREE.MeshStandardMaterial({color:0x9679ff,emissive:0x6248e6,emissiveIntensity:1.8});
// Panoramic window: moonlight beyond the glazing; custom city skyline outside.
box(7.45,3.55,.12,metal,6.3,4.0,-7.38);box(7.1,3.25,.015,glass,6.3,4.0,-7.26);
for(const x of [3.95,6.3,8.65])box(.06,3.28,.07,metal,x,4,-7.20);
box(7.12,.07,.1,metal,6.3,4,-7.19);
const skyline=new THREE.Group();skyline.position.set(3.0,2.5,-8.9);scene.add(skyline);
const skymat=[MAT('#152a47'),MAT('#0f1d34'),MAT('#213452')];
for(let i=0;i<29;i++){const h=.45+(i*7%11)*.21,w=.18+(i*5%7)*.075,x=i*.22;box(w,h,.13,skymat[i%3],x,h/2,0,skyline);
 for(let j=0;j<Math.floor(h/.24);j++)if((i+j)%3===0){const e=box(.035,.065,.01,i%4===0?gold:blue,x,h*.16+j*.2,.075,skyline);e.castShadow=false;}}
// Overhead lighting banks and ceiling rails
for(const x of [-6,-2,2,6]){box(2.7,.1,.45,metal,x,7.25,-3.9);box(2.48,.012,.28,new THREE.MeshBasicMaterial({color:'#a9dfff'}),x,7.18,-3.9);}
// Loudspeaker pair with sculpted cones
for(const x of [-2.72,5.35]){const speaker=box(.37,.92,.43,black,x,2.07,-4.1);for(const y of [1.89,2.28]){const cone=mesh(new THREE.CylinderGeometry(.145,.145,.018,32),metal,x,y,-3.87);cone.rotation.x=Math.PI/2;}}
// Desk lamp (warm key light), books and small leafy plant
box(.9,.045,.38,metal,-1.35,1.74,-3.15);cyl(.035,.045,.76,metal,-1.35,2.14,-3.15);
const shade=mesh(new THREE.ConeGeometry(.30,.32,24),gold,-1.35,2.54,-3.15);shade.rotation.z=Math.PI;lamp(0xffbb8a,9,-1.35,2.38,-3.15,4);
const pot=cyl(.24,.18,.3,concrete,3.4,1.87,-3.0);
for(let i=0;i<12;i++){const a=i*2.4,stem=mesh(new THREE.CylinderGeometry(.017,.022,.55,6),MAT('#2d7a60'),3.4+Math.cos(a)*.11,2.21,-3+Math.sin(a)*.09);stem.rotation.z=Math.sin(a)*.46;const leaf=mesh(new THREE.SphereGeometry(.14,8,8),MAT(i%2?'#24785d':'#3b9a74'),3.4+Math.cos(a)*.2,2.47+(i%3)*.055,-3+Math.sin(a)*.18);leaf.scale.set(.65,.32,1.35);leaf.rotation.y=a;}
// Dynamic glow around the monitors: cheap edge lighting, without GPU-heavy postprocessing.
for(const [x,w] of [[1.2,2.58],[-1.62,2],[3.85,2]]){const strip=box(w+.12,.025,.05,blue,x,2.34,-4.64);strip.castShadow=false;}
// Floating wayfinding labels in world space; use canvas textures to remain GPU-friendly
function placard(label,x,y,z){const c=document.createElement('canvas');c.width=512;c.height=110;const ctx=c.getContext('2d');ctx.fillStyle='rgba(6,19,32,.88)';ctx.fillRect(0,0,512,110);ctx.strokeStyle='#38cfff';ctx.lineWidth=4;ctx.strokeRect(2,2,508,106);ctx.font='bold 32px Arial';ctx.fillStyle='#e9f9ff';ctx.fillText(label,30,70);const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;const plane=mesh(new THREE.PlaneGeometry(1.5,.32),new THREE.MeshBasicMaterial({map:tx,transparent:true,side:THREE.DoubleSide,depthWrite:false}),x,y,z);plane.castShadow=false;return plane;}
placard('INTERACTIVE • CLICK',1.2,4.2,-4.45);
// Soft decorative slow-spinning holo ring near ceiling
const ring=mesh(new THREE.TorusGeometry(.44,.013,8,80),neonViolet,-5.5,5.56,-5.5);ring.rotation.x=1.1;
const ring2=mesh(new THREE.TorusGeometry(.3,.015,8,80),blue,-5.5,5.56,-5.5);ring2.rotation.y=.6;

const views={wide:{pos:[9.2,4.1,10.9],target:[2.55,2.52,-3.9],label:'THE STUDIO',num:'01 / 04'},desk:{pos:[5.95,3.5,3.75],target:[2.25,2.45,-3.95],label:'WORKSPACE',num:'02 / 04'},projects:{pos:[3.9,3.45,2.5],target:[2.05,3.07,-4.45],label:'PROJECTS',num:'03 / 04'},about:{pos:[-3.7,3.9,5.1],target:[-2.75,2.95,-5.2],label:'ABOUT ME',num:'04 / 04'}};
let active='wide',move=null,quality=true;const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
function view(k){if(walkMode){walkMode=false;held.clear();controls.enableZoom=true;controls.minDistance=3.3;controls.maxDistance=21;modeButton.textContent='MODE: ORBIT';modeHelp.textContent='Orbit mode · drag to look · scroll to zoom';}active=k;const v=views[k];move={startPos:camera.position.clone(),startTarget:controls.target.clone(),endPos:new THREE.Vector3(...v.pos),endTarget:new THREE.Vector3(...v.target),start:performance.now()};document.querySelectorAll('.navbtn').forEach(b=>b.classList.toggle('selected',b.dataset.view===k));document.querySelector('.stats span').textContent=v.num;document.querySelector('#viewname').textContent=v.label;document.querySelector('nav').classList.remove('open');if(k==='about')openPanel('About');}
function openPanel(id){const p=info[id];if(!p)return;document.querySelector('#panelType').textContent=p.type;document.querySelector('#panelTitle').textContent=p.title;document.querySelector('#panelText').textContent=p.text;document.querySelector('#tags').innerHTML=p.tags.map(t=>`<span>${t}</span>`).join('');document.querySelector('#panelLink').href=id==='Fastpay'?'https://github.com/honorx9cuzb-create/Fastpay':id==='NurLevel'?'https://github.com/honorx9cuzb-create/NurLevel':'https://github.com/honorx9cuzb-create';document.querySelector('#panel').classList.add('open');document.querySelector('#panel').setAttribute('aria-hidden','false');}
function closePanel(){document.querySelector('#panel').classList.remove('open');document.querySelector('#panel').setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));document.querySelector('#explore').onclick=()=>view('projects');document.querySelector('#about').onclick=()=>view('about');document.querySelector('#reset').onclick=()=>{closePanel();view('wide')};document.querySelector('#close').onclick=closePanel;document.querySelector('#menu').onclick=()=>document.querySelector('nav').classList.toggle('open');document.querySelector('#quality').onclick=()=>{quality=!quality;renderer.setPixelRatio(quality?Math.min(devicePixelRatio,2):1);renderer.shadowMap.enabled=quality;renderer.toneMappingExposure=quality?1.47:1.35;document.querySelector('#quality').textContent=`QUALITY: ${quality?'HIGH':'ECO'}`};let daytime=false;
const dayButton=document.querySelector('#daynight');dayButton.onclick=()=>{daytime=!daytime;ambientLight.intensity=daytime?2.7:1.35;keyLamp.intensity=daytime?15:30;scene.background.set(daytime?'#243648':'#080e19');scene.fog.color.set(daytime?'#243648':'#080e19');renderer.toneMappingExposure=daytime?1.8:(quality?1.47:1.35);dayButton.textContent=daytime?'LIGHT: DAY':'LIGHT: NIGHT';};
let audioCtx=null,osc=null,gain=null;
document.querySelector('#sound').onclick=()=>{const button=document.querySelector('#sound');if(osc){osc.stop();osc.disconnect();gain.disconnect();osc=null;button.textContent='SOUND: OFF';return;}try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();audioCtx.resume();osc=audioCtx.createOscillator();gain=audioCtx.createGain();osc.type='sine';osc.frequency.value=95;gain.gain.value=.012;osc.connect(gain);gain.connect(audioCtx.destination);osc.start();button.textContent='SOUND: ON';}catch(e){button.textContent='SOUND UNAVAILABLE';}};
let down;canvas.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);canvas.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>7)return;pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(clickable)[0];if(hit)openPanel(hit.object.userData.project)});canvas.addEventListener('pointermove',e=>{pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(pointer,camera);canvas.style.cursor=ray.intersectObjects(clickable).length?'pointer':'grab'});
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?61:48;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}addEventListener('resize',resize);resize();

// V6: dual interaction — a comfortable orbit camera and bounded WASD walk mode.
let walkMode=false;const held=new Set();
const modeButton=document.querySelector('#mode'),modeHelp=document.querySelector('#modeHelp');
function setMode(value){
 walkMode=value;held.clear();move=null;
 controls.enableZoom=!walkMode;
 controls.enablePan=false;
 controls.minDistance=walkMode?0.15:3.3;
 controls.maxDistance=walkMode?0.19:21;
 modeButton.textContent=walkMode?'MODE: WALK':'MODE: ORBIT';
 modeHelp.textContent=walkMode?'W A S D move · drag to look · SHIFT sprint · ESC exit':'Orbit mode · drag to look · scroll to zoom';
 if(walkMode){camera.position.set(2.8,1.7,5.8);controls.target.set(2.8,1.7,3.8);controls.update();}
 else view('wide');
}
modeButton.onclick=()=>setMode(!walkMode);
window.addEventListener('keydown',e=>{
 if(e.target.matches('input,textarea,[contenteditable="true"]'))return;
 const key=e.key.toLowerCase();
 if(['w','a','s','d','shift','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){held.add(key);if(walkMode)e.preventDefault();}
 if(e.key==='Escape'&&walkMode)setMode(false);
});
window.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>held.clear());
function walkStep(dt){
 if(!walkMode)return;
 const fwd=new THREE.Vector3().subVectors(controls.target,camera.position);
 fwd.y=0;fwd.normalize();
 if(fwd.lengthSq()<.1)fwd.set(0,0,-1);
 const right=new THREE.Vector3(-fwd.z,0,fwd.x);
 const delta=new THREE.Vector3();
 if(held.has('w')||held.has('arrowup'))delta.add(fwd);
 if(held.has('s')||held.has('arrowdown'))delta.sub(fwd);
 if(held.has('d')||held.has('arrowright'))delta.add(right);
 if(held.has('a')||held.has('arrowleft'))delta.sub(right);
 if(delta.lengthSq()===0)return;
 delta.normalize().multiplyScalar((held.has('shift')?5.0:2.7)*Math.min(dt,.05));
 const next=camera.position.clone().add(delta);
 next.x=THREE.MathUtils.clamp(next.x,-9.7,9.7);
 next.z=THREE.MathUtils.clamp(next.z,-5.85,7.1);
 // Prevent walking through the workstation, leaving a front-side path.
 if(next.x>-0.9&&next.x<6.5&&next.z>-5.85&&next.z<-2.2) return;
 next.y=1.7;
 const offset=next.sub(camera.position);
 camera.position.add(offset);controls.target.add(offset);
}

if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const endPos=camera.position.clone(),endTarget=controls.target.clone();camera.position.add(new THREE.Vector3(0,1.3,3.4));controls.target.add(new THREE.Vector3(0,.15,0));move={startPos:camera.position.clone(),startTarget:controls.target.clone(),endPos,endTarget,start:performance.now()};}
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const dt=clock.getDelta(),t=clock.elapsedTime;walkStep(dt);if(move){const alpha=Math.min(1,(performance.now()-move.start)/1450),ease=1-Math.pow(1-alpha,3);camera.position.lerpVectors(move.startPos,move.endPos,ease);controls.target.lerpVectors(move.startTarget,move.endTarget,ease);if(alpha>=1)move=null;}ring.rotation.z+=.002;ring2.rotation.x+=.0025;globe.rotation.y+=.003;globe.position.y=4.49+Math.sin(t*1.3)*.075;pts.rotation.y=t*.003;controls.update();renderer.render(scene,camera)}animate();setTimeout(()=>{const l=document.querySelector('#loading');l.style.opacity=0;setTimeout(()=>l.remove(),650)},900);