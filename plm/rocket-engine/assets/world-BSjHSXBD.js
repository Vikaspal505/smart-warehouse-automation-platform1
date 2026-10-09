import{$t as e,B as t,Ct as n,F as r,Gt as i,H as a,It as o,Jt as s,Lt as c,Mt as l,Nt as u,O as d,Pt as f,S as p,St as m,Ut as h,X as g,Y as _,_t as v,bn as y,dn as b,et as x,g as S,gt as C,h as w,hn as T,jt as E,m as D,mn as ee,mt as O,ot as te,p as k,q as ne,qt as re,r as ie,vt as A,y as j,yt as M}from"./Pass-mJhgIX3K.js";import{n as N}from"./BufferGeometryUtils-DL_sQ4BQ.js";import{A as P,C as F,E as ae,M as oe,T as I,_ as se,a as ce,b as le,c as L,d as R,g as z,h as ue,i as de,l as B,n as V,o as fe,t as pe,u as me,v as he,w as H,x as ge,y as U}from"./layout-B91VFmhI.js";import{a as _e,d as ve,g as ye,i as be,l as xe,m as Se,o as Ce,s as we,t as W,u as Te}from"./textures-S90URTk9.js";import{S as Ee,_ as De,a as G,b as K,h as Oe,m as ke,o as Ae,r as je,s as q,v as J,y as Y}from"./models-CwmgIZnv.js";var X=class e extends v{constructor(){let t=e.SkyShader,n=new s({name:t.name,uniforms:b.clone(t.uniforms),vertexShader:t.vertexShader,fragmentShader:t.fragmentShader,side:1,depthWrite:!1});super(new k(1,1,1),n),this.isSky=!0}};X.SkyShader={name:`SkyShader`,uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new T},up:{value:new T(0,1,0)},cloudScale:{value:2e-4},cloudSpeed:{value:1e-4},cloudCoverage:{value:.4},cloudDensity:{value:.4},cloudElevation:{value:.5},showSunDisc:{value:1},time:{value:0}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calculation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorption + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;
		uniform float cloudScale;
		uniform float cloudSpeed;
		uniform float cloudCoverage;
		uniform float cloudDensity;
		uniform float cloudElevation;
		uniform float showSunDisc;
		uniform float time;

		// Cloud noise functions
		float hash( vec2 p ) {
			return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453123 );
		}

		float noise( vec2 p ) {
			vec2 i = floor( p );
			vec2 f = fract( p );
			f = f * f * ( 3.0 - 2.0 * f );
			float a = hash( i );
			float b = hash( i + vec2( 1.0, 0.0 ) );
			float c = hash( i + vec2( 0.0, 1.0 ) );
			float d = hash( i + vec2( 1.0, 1.0 ) );
			return mix( mix( a, b, f.x ), mix( c, d, f.x ), f.y );
		}

		float fbm( vec2 p ) {
			float value = 0.0;
			float amplitude = 0.5;
			for ( int i = 0; i < 5; i ++ ) {
				value += amplitude * noise( p );
				p *= 2.0;
				amplitude *= 0.5;
			}
			return value;
		}

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisc = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta ) * showSunDisc;
			L0 += ( vSunE * 19000.0 * Fex ) * sundisc;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			// Clouds
			if ( direction.y > 0.0 && cloudCoverage > 0.0 ) {

				// Project to cloud plane (higher elevation = clouds appear lower/closer)
				float elevation = mix( 1.0, 0.1, cloudElevation );
				vec2 cloudUV = direction.xz / ( direction.y * elevation );
				cloudUV *= cloudScale;
				cloudUV += time * cloudSpeed;

				// Multi-octave noise for fluffy clouds
				float cloudNoise = fbm( cloudUV * 1000.0 );
				cloudNoise += 0.5 * fbm( cloudUV * 2000.0 + 3.7 );
				cloudNoise = cloudNoise * 0.5 + 0.5;

				// Apply coverage threshold
				float cloudMask = smoothstep( 1.0 - cloudCoverage, 1.0 - cloudCoverage + 0.3, cloudNoise );

				// Fade clouds near horizon (adjusted by elevation)
				float horizonFade = smoothstep( 0.0, 0.1 + 0.2 * cloudElevation, direction.y );
				cloudMask *= horizonFade;

				// Cloud lighting based on sun position
				float sunInfluence = dot( direction, vSunDirection ) * 0.5 + 0.5;
				float daylight = max( 0.0, vSunDirection.y * 2.0 );

				// Base cloud color affected by atmosphere
				vec3 atmosphereColor = Lin * 0.04;
				vec3 cloudColor = mix( vec3( 0.3 ), vec3( 1.0 ), daylight );
				cloudColor = mix( cloudColor, atmosphereColor + vec3( 1.0 ), sunInfluence * 0.5 );
				cloudColor *= vSunE * 0.00002;

				// Blend clouds with sky
				texColor = mix( texColor, cloudColor, cloudMask * cloudDensity );

			}

			gl_FragColor = vec4( texColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var Me=y({CUT:()=>Z,Daylight:()=>ze,World:()=>Be,cutMat:()=>Q,cutMesh:()=>$}),Z={level:{value:0},time:{value:0}},Ne=V.h+2.2,Pe=`varying vec3 vCw;`,Fe=`{ vec4 cwp = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
cwp = instanceMatrix * cwp;
#endif
vCw = (modelMatrix * cwp).xyz; }`,Ie=`varying vec3 vCw; uniform float uCutLevel; uniform float uCutTime;
float ch(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float cn(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(ch(i), ch(i+vec3(1,0,0)), f.x), mix(ch(i+vec3(0,1,0)), ch(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(ch(i+vec3(0,0,1)), ch(i+vec3(1,0,1)), f.x), mix(ch(i+vec3(0,1,1)), ch(i+vec3(1,1,1)), f.x), f.y), f.z); }
float cutField(){
  float h = mix(${Ne.toFixed(2)}, ${fe.toFixed(2)}, uCutLevel);
  float n = cn(vCw * 0.55) * 0.65 + cn(vCw * 2.1) * 0.35;
  float amp = 2.4 * min(1.0, uCutLevel * 4.0) * (1.0 - smoothstep(0.85, 1.0, uCutLevel)) + 0.06;
  return h + (n - 0.5) * amp - vCw.y;
}`;function Le(e,t){e.uniforms.uCutLevel=Z.level,e.uniforms.uCutTime=Z.time,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Pe}`).replace(`#include <project_vertex>`,`#include <project_vertex>\n${Fe}`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Ie}`).replace(`#include <clipping_planes_fragment>`,`#include <clipping_planes_fragment>
float cutF = cutField(); if (uCutLevel > 0.001 && cutF < 0.0) discard;`),t&&(e.fragmentShader=e.fragmentShader.replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
  if (uCutLevel > 0.001) { float e = 1.0 - smoothstep(0.0, 0.12, cutF); float burn = 1.0 - smoothstep(0.85, 1.0, uCutLevel); totalEmissiveRadiance += vec3(0.25, 0.85, 1.0) * e * (0.9 + burn * 5.0); }`))}function Q(e){let t=e.onBeforeCompile;return e.onBeforeCompile=(n,r)=>{t?.call(e,n,r),Le(n,!0)},e.customProgramCacheKey=()=>`cut`+(t?t.toString().length:0),e}var Re=(()=>{let e=new M({depthPacking:c});return e.onBeforeCompile=e=>Le(e,!1),e})();function $(e){return e.customDepthMaterial=Re,e}var ze=class{renderer;scene;sky=new X;sun=new r(16777215,3);hemi=new _(12375039,5918784,.4);dir=new T;night=0;pmrem;envScene=new re;envRT=null;lastH=-1;stars;constructor(e,t){this.renderer=e,this.scene=t,this.sky.scale.setScalar(4e3);let n=this.sky.material.uniforms;n.turbidity.value=3.2,n.rayleigh.value=1.2,n.mieCoefficient.value=.004,n.mieDirectionalG.value=.82,t.add(this.sky),this.pmrem=new ie(e);let r=new X;r.scale.setScalar(1e3),r.material=this.sky.material,this.envScene.add(r);let i=new v(new j(900,32),new A({color:3947060}));i.rotation.x=-Math.PI/2,i.position.y=-2,this.envScene.add(i),this.envGround=i.material;let a=this.sun;a.castShadow=!0,a.shadow.mapSize.set(4096,4096);let o=a.shadow.camera;o.left=-78,o.right=78,o.top=78,o.bottom=-78,o.near=10,o.far=400,a.shadow.bias=-25e-5,a.shadow.normalBias=.035,a.target.position.set(4,0,26),t.add(a,a.target,this.hemi);let s=2500,c=new Float32Array(s*3);for(let e=0;e<s;e++){let t=new T().randomDirection();t.y=Math.abs(t.y)*.9+.05,t.normalize().multiplyScalar(1800),c.set([t.x,t.y,t.z],e*3)}let l=new w;l.setAttribute(`position`,new D(c,3)),this.stars=new u(l,new f({color:13623551,size:2.2,sizeAttenuation:!1,transparent:!0,opacity:0,depthWrite:!1,fog:!1})),t.add(this.stars)}envGround;set(e){let t=(e-6.2)/14.2,n=Math.sin(Math.PI*O.clamp(t,-.15,1.15))*O.degToRad(56),r=Math.PI*O.clamp(t,-.2,1.2);this.dir.set(Math.cos(r),Math.sin(n),Math.sin(r)*.85+.3).normalize(),this.sky.material.uniforms.sunPosition.value.copy(this.dir);let i=Math.asin(this.dir.y),a=O.smoothstep(i,-.1,.12);this.night=1-a;let o=1-O.smoothstep(i,.04,.5);this.sun.color.setRGB(1,.96-o*.32,.9-o*.55),this.sun.intensity=3.6*a,this.sun.position.copy(this.sun.target.position).addScaledVector(this.dir,200),this.sky.material.uniforms.rayleigh.value=1+o*1.6,this.sky.material.uniforms.turbidity.value=3+o*4,this.hemi.intensity=.12+a*.18,this.hemi.color.setRGB(.62+a*.12,.72+a*.1,1),this.hemi.groundColor.setRGB(.32*a+.04,.29*a+.04,.24*a+.05),this.stars.material.opacity=this.night*.9,this.envGround.color.setRGB(.24*a+.01,.23*a+.012,.2*a+.016),Math.abs(e-this.lastH)>.08&&(this.lastH=e,this.envRT?.dispose(),this.envRT=this.pmrem.fromScene(this.envScene,.02),this.scene.environment=this.envRT.texture,this.scene.environmentIntensity=.25+a*.42)}},Be=class{root=new ne;docks=[];stockLoad=[];stockWrap;pods;podCells=[];belts=[];nightMats=[];pools=[];barriers=[];interiorLights=[];pickers=[];packers=[];constructor(){this.ground(),this.shell(),this.docksBuild(),this.racks(),this.podField(),this.conveyors(),this.stations(),this.yardStuff(),this.surroundings()}ground(){let e=ye(),t=new v(new E(W.x1-W.x0,W.z1-W.z0),K(new n({map:e,roughness:.82,roughnessMap:xe(4,.6,1)}),.7,.4));t.material.roughnessMap.repeat.set(40,16),t.rotation.x=-Math.PI/2,t.position.set((W.x0+W.x1)/2,0,(W.z0+W.z1)/2),t.receiveShadow=!0,this.root.add(t);let r=new n({color:5596986,roughness:.97});r.onBeforeCompile=e=>{e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vGw;`).replace(`#include <worldpos_vertex>`,`#include <worldpos_vertex>
vGw = (modelMatrix * vec4(transformed,1.0)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vGw;
float gh2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float gn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(gh2(i), gh2(i+vec2(1,0)), f.x), mix(gh2(i+vec2(0,1)), gh2(i+vec2(1,1)), f.x), f.y); }`).replace(`#include <map_fragment>`,`#include <map_fragment>
float g1 = gn2(vGw.xz * 0.02) * 0.5 + gn2(vGw.xz * 0.11) * 0.3 + gn2(vGw.xz * 1.7) * 0.2;
diffuseColor.rgb *= mix(vec3(0.78, 0.86, 0.62), vec3(1.18, 1.08, 0.82), g1);
// mowing stripes near the site, fading out into rough grass further away
float near = 1.0 - smoothstep(110.0, 170.0, length(vGw.xz - vec2(0.0, 30.0)));
float stripe = step(0.5, fract((vGw.x + vGw.z * 0.15) / 7.0));
diffuseColor.rgb *= 1.0 + (stripe - 0.5) * 0.16 * near;`)};let i=new v(new E(2400,2400),r);i.rotation.x=-Math.PI/2,i.position.y=-.03,i.receiveShadow=!0,this.root.add(i)}shell(){let e=V.x1-V.x0,t=V.z1-V.z0,r=new v(J(e,B,t,0,B/2,0),K(new n({color:11117980,roughness:.85}),1.2,.8));r.receiveShadow=!0,this.root.add(r);let i=Ce(),a=new n({map:i,roughness:.42,roughnessMap:xe(17,.35,.95),metalness:0,envMapIntensity:1.1});a.roughnessMap.repeat.set(18,11);let o=new v(new E(e,t),a);o.rotation.x=-Math.PI/2,o.position.y=B+.003,o.receiveShadow=!0,this.root.add(o);let s=be(),c=Q(K(new n({color:14672872,roughness:.42,metalness:.35,normalMap:s,normalScale:new ee(1.2,1.2)}),.7,.35)),u=Q(new n({color:2643657,roughness:.4,metalness:.4,normalMap:s})),d=Q(K(new n({color:12170667,roughness:.8}),1.4,.6)),f=(e,t,n,r,i)=>{let a=e.attributes.uv,o=e.attributes.position;for(let e=0;e<a.count;e++)a.setXY(e,(i?o.getX(e):o.getZ(e))/1.6,o.getY(e)/1.6);let s=$(new v(e,t));s.castShadow=!0,s.receiveShadow=!0,this.root.add(s)},p=.3,h=V.h;f(J(e+p*2,h-2.4,p,0,2.4+(h-2.4)/2,V.z0-p/2),c,e,h,!0);for(let e of[V.x0-p/2,V.x1+p/2])f(J(p,h-2.4,t,e,2.4+(h-2.4)/2,0),c,t,h,!1);f(J(e+p*2,2.4,p,0,1.2,V.z0-p/2),d,e,2.4,!0);for(let e of[V.x0-p/2,V.x1+p/2])f(J(p,2.4,t,e,1.2,0),d,t,2.4,!1);let g=[...R,...z].sort((e,t)=>e-t),_=V.x0-p,y=V.z1+p/2,b=B+L;for(let e of[...g,V.x1+p+3/2]){let t=e-3/2;t>_&&f(J(t-_,b-B,p,(_+t)/2,B+(b-B)/2,y),c,t-_,b,!0),_=e+3/2}f(J(e+p*2,h-b,p,0,b+(h-b)/2,y),c,e,h,!0);for(let[n,r,i,a]of[[e+.7,.04,0,V.z1+p+.02],[e+.7,.04,0,V.z0-p-.02],[.04,t+.7,V.x1+p+.02,0],[.04,t+.7,V.x0-p-.02,0]])f(J(n,.9,r,i,h-1,a),u,1,1,n>1);let S=$(new v(new E(14,3.5),Q(new n({map:Te([[`airsup`,`#ffffff`,120],[`RIVERSIDE DISTRIBUTION CENTRE · WH-01`,`#9fc0ff`,46]],1024,256,`#0b1730`),roughness:.4,emissive:16777215,emissiveIntensity:0}))));S.position.set(0,h-4.2,V.z1+p+.05),this.root.add(S),this.nightMats.push({m:S.material,day:0,night:0,key:`emissiveIntensity`}),S.material.emissiveMap=S.material.map,this.nightMats[this.nightMats.length-1].night=.9;let w=Q(K(new n({color:13159634,roughness:.5,metalness:.5,normalMap:s}),.8,.2)),T=J(e+.6,.25,t+.6,0,h+.1,0);{let e=T.attributes.uv,t=T.attributes.position;for(let n=0;n<e.count;n++)e.setXY(n,t.getZ(n)/1.6,t.getX(n)/1.6)}let D=$(new v(T,w));D.castShadow=!0,D.receiveShadow=!0,this.root.add(D);let O=new G;O.add(c,J(e+.9,.9,.3,0,h+.45,V.z1+.3),J(e+.9,.9,.3,0,h+.45,V.z0-.3),J(.3,.9,t+.9,V.x1+.3,h+.45,0),J(.3,.9,t+.9,V.x0-.3,h+.45,0));let te=Q(new m({color:14674160,roughness:.25,transmission:0,transparent:!0,opacity:.85,emissive:12572927,emissiveIntensity:.05}));for(let e=-30;e<=30;e+=12)for(let t of[-12,0,12])O.add(te,J(2.2,.35,5,e,h+.35,t,.08));let ne=Q(K(new n({color:12106946,roughness:.5,metalness:.6}),1));for(let[e,t]of[[-20,-16],[-8,-16],[6,-16],[20,-15]])O.add(ne,J(3.2,1.6,2.2,e,h+1.05,t,.06)),O.add(q.black,Y(.6,.1,e-.8,h+1.9,t,`y`,20),Y(.6,.1,e+.8,h+1.9,t,`y`,20));let re=O.build();re.traverse(e=>{e.isMesh&&$(e)}),this.root.add(re);let ie=Q(new m({map:ve(),roughness:.12,metalness:.3,clearcoat:1,clearcoatRoughness:.05})),A=new k(1,.04,1.95);A.rotateX(-.17);let j=[];for(let e=-33;e<=33;e+=1.06)for(let t=-19;t<=19;t+=2.6)Math.abs(t)<1.2||Math.abs((e+30)%12-0)<1.6&&Math.abs(t%12)<3.2||t<-13&&e>-23&&e<23||j.push(new C().makeTranslation(e,h+.55,t));let M=$(new x(A,ie,j.length));j.forEach((e,t)=>M.setMatrixAt(t,e)),M.castShadow=!0,M.receiveShadow=!0,this.root.add(M);let N=new G,P=Q(new n({color:10133930,metalness:.7,roughness:.45}));for(let e=V.x0+6;e<V.x1;e+=12)N.add(P,J(.25,.9,t,e,h-.55,0));for(let t=V.z0+2;t<V.z1;t+=2)N.add(P,J(e,.12,.1,0,h-.15,t));let F=new n({color:16777215,emissive:16774888,emissiveIntensity:2.5});Q(F);for(let e=-30;e<=30;e+=6)for(let t=-18;t<=18;t+=6)N.add(P,Y(.28,.25,e,h-1.4,t,`y`,16)),N.add(F,Y(.26,.02,e,h-1.53,t,`y`,16));let ae=N.build();ae.traverse(e=>{e.isMesh&&$(e)}),this.root.add(ae);for(let[e,t]of[[-24,-8],[-24,12],[-6,-8],[-6,12],[16,-8],[16,12]]){let n=new l(16773596,0,48,1.1);n.position.set(e,B+16,t),this.root.add(n),this.interiorLights.push(n)}let oe=new m({color:9417944,metalness:.5,roughness:.06,clearcoat:1,envMapIntensity:1.4,emissive:16777215,emissiveMap:Se(),emissiveIntensity:0});this.nightMats.push({m:oe,day:0,night:1.4,key:`emissiveIntensity`});let I=new G,se=K(new n({color:12170667,roughness:.8}),1.4,.6);I.add(oe,J(12,7.4,16,-43,3.7,13)),I.add(se,J(12.4,.5,16.4,-43,7.6,13),J(12.4,.4,16.4,-43,.2,13));for(let e=0;e<9;e++)I.add(q.steelDark,J(.12,7.4,.12,-49.05,3.7,5.1+e*2),J(.12,7.4,.12,-36.95,3.7,5.1+e*2));for(let e=0;e<7;e++)I.add(q.steelDark,J(.12,7.4,.12,-48.9+e*2,3.7,21.05));I.add(q.steelDark,J(12.1,.14,.14,-43,3.8,21.05),J(.14,.14,16.1,-49.05,3.8,13)),I.add(se,J(5,.3,3,-45,3.4,22.6));let ce=I.build();this.root.add(ce)}docksBuild(){let t=new n({color:1315860,roughness:.9}),r=K(new n({color:15198700,roughness:.45,metalness:.35,normalMap:be(),normalScale:new ee(.6,.6)}),.6),i=new k(2.95,L,.06);{let e=i.attributes.uv,t=i.attributes.position;for(let n=0;n<e.count;n++)e.setXY(n,t.getY(n)/1.2,t.getX(n))}let a=new G;[...R.map(e=>[e,!0]),...z.map(e=>[e,!1])].forEach(([o,s],c)=>{let l=V.z1+.3;a.add(t,J(.35,L+.5,.5,o-3/2-.2,B+(L+.5)/2,l+.25),J(.35,L+.5,.5,o+3/2+.2,B+(L+.5)/2,l+.25)),a.add(t,J(3.75,.6,.55,o,B+L+.3,l+.28));for(let e of[-1,1])a.add(q.black,J(.25,.45,.18,o+e*1.25,B-.3,l+.09,.03));a.add(q.steelDark,J(.05,.05,.9,o-3/2-.55,B+2.6,l+.45)),a.add(new n({color:15315991,roughness:.6}),J(3.4,.12,.04,o,B-.06,l+0));let u=new v(i,r);u.position.set(o,B+L/2,V.z1+.05),u.castShadow=!0,u.receiveShadow=!0,this.root.add(u);let d=new v(Y(.24,3.1,o,B+L+.3,V.z1-.3,`x`,20),r);d.castShadow=!0,this.root.add(d);let f=new n({color:2097152,emissive:16722458,emissiveIntensity:2.5}),p=new n({color:8192,emissive:2817898,emissiveIntensity:0});for(let[t,n]of[[f,.18],[p,0]]){let r=new v(new e(.08,12,8),t);r.position.set(o+3/2+.55,B+1.6+n,V.z1+.42),this.root.add(r)}let m=new v(J(.22,.48,.1,o+3/2+.55,B+1.68,V.z1+.35),q.black);this.root.add(m);let h=new v(J(2,.06,2.4,0,0,0),q.steel);h.position.set(o,B-.01,V.z1-1.2),h.receiveShadow=!0,this.root.add(h);let g=new v(new E(.9,.45),new n({map:_e(`${s?`R`:`S`}${c%4+1}`),roughness:.5}));g.position.set(o,B+L+.95,V.z1+.62),this.root.add(g),this.docks.push({x:o,inbound:s,door:u,red:f,green:p,leveler:h,openU:0,target:0})}),this.root.add(a.build())}updateDocks(e){for(let t of this.docks){t.openU+=O.clamp(t.target-t.openU,-e/3.2,e/3.2);let n=Math.max(.04,1-t.openU);t.door.scale.y=n,t.door.position.y=B+L-L*n/2,t.leveler.position.z=V.z1-1.2+t.openU*1.1,t.leveler.rotation.x=t.openU*0,t.red.emissiveIntensity=t.target>.5?0:2.5,t.green.emissiveIntensity=t.target>.5?2.5:0}}racks(){let e=K(new n({color:2053816,metalness:.45,roughness:.42}),.9,1.5),t=K(new n({color:15755796,metalness:.35,roughness:.45}),.9,1.5),r=[],i=[],a=[],s=[],c=U.top;for(let e of le){let t=e.double?[e.x0+U.depth/2,e.x1-U.depth/2]:[(e.x0+e.x1)/2];for(let e of t){for(let t=0;t<=U.bays;t++){let n=U.z0+t*U.bay;for(let t of[-1,1])r.push(new C().makeTranslation(e+t*(U.depth/2-.04),B+c/2,n));for(let t=0;t<7;t++){let r=new C().compose(new T(e,B+.7+t*1.3,n),new o().setFromAxisAngle(new T(0,0,1),(t%2?1:-1)*.66),new T(1,1,1));a.push(r)}}for(let t=0;t<U.bays;t++){let n=U.z0+U.bay*(t+.5);for(let t of U.levels.slice(1))for(let r of[-1,1])i.push(new C().makeTranslation(e+r*(U.depth/2-.04),B+t-.07,n))}s.push(new C().makeTranslation(e,B+.2,ge+.25))}}let l=(e,t,n)=>{let r=new x(e,t,n.length);return n.forEach((e,t)=>r.setMatrixAt(t,e)),r.castShadow=!0,r.receiveShadow=!0,this.root.add(r),r};l(new k(.09,c,.08),e,r),l(new k(.05,.12,U.bay-.08),t,i),l(new k(.03,U.depth*1.45,.03).rotateZ(Math.PI/2),e,a),l(new k(U.depth+.1,.4,.2),new n({color:15909166,roughness:.5}),s);let u=F.length;this.stockLoad=Ae.map((e,t)=>new x(e,je[t],u)),this.stockWrap=new x(Oe,ke,u);for(let e of this.stockLoad)e.castShadow=!0,e.receiveShadow=!0,this.root.add(e);this.root.add(this.stockWrap);let d=new C().makeScale(0,0,0);for(let e=0;e<u;e++){for(let t of this.stockLoad)t.setMatrixAt(e,d);this.stockWrap.setMatrixAt(e,d)}pe.forEach((e,t)=>{let r=new v(new E(1.4,.7),new n({map:Te([[`A${String(t+1).padStart(2,`0`)}`,`#ffffff`,150]],512,256,`#1f56b8`),roughness:.5}));r.position.set(e,B+5,ge+.1),this.root.add(r)})}setSlot(e,t,n=e){let r=F[e],i=new C().compose(new T(r.x,B+r.y+(r.level,0),r.z),new o().setFromAxisAngle(new T(0,1,0),Math.PI/2*(n%2?1:-1)+Math.PI/2),new T(1,1,1)),a=new C().makeScale(0,0,0),s=n%Ae.length;this.stockLoad.forEach((n,r)=>n.setMatrixAt(e,t&&r===s?i:a)),this.stockWrap.setMatrixAt(e,t&&n%3==0?i:a),this.stockWrap.instanceMatrix.needsUpdate=!0;for(let e of this.stockLoad)e.instanceMatrix.needsUpdate=!0}podField(){let e=Ee().children,t=[];for(let e=0;e<me.cols;e++)for(let n=0;n<me.rows;n++)oe(e,n)&&t.push({c:e,r:n});let n=new x(e[0].geometry,e[0].material,t.length),r=new x(e[1].geometry,e[1].material,t.length);for(let e of[n,r])e.castShadow=!0,e.receiveShadow=!0,this.root.add(e);this.pods={frame:n,bins:r},t.forEach((e,t)=>{let n=P(e.c,e.r);this.podCells.push({...e,home:n.clone(),at:new T(n.x,0,n.y),busy:!1}),this.placePod(t,new T(n.x,0,n.y),0)})}placePod(e,t,n){this.podCells[e].at.copy(t);let r=new C().compose(new T(t.x,B+t.y,t.z),new o().setFromAxisAngle(new T(0,1,0),n),new T(1,1,1));this.pods.frame.setMatrixAt(e,r),this.pods.bins.setMatrixAt(e,r),this.pods.frame.instanceMatrix.needsUpdate=!0,this.pods.bins.instanceMatrix.needsUpdate=!0}convCurve;chutes=[];conveyors(){let e=(()=>{let e=document.createElement(`canvas`);e.width=64,e.height=64;let t=e.getContext(`2d`);t.fillStyle=`#1b1c1f`,t.fillRect(0,0,64,64),t.fillStyle=`#2a2c30`;for(let e=0;e<64;e+=8)t.fillRect(0,e,64,3);let n=new S(e);return n.wrapS=n.wrapT=h,n.colorSpace=i,n})(),t=new n({map:e,roughness:.7});this.belts.push(t);let r=K(new n({color:10397360,metalness:.75,roughness:.35}),.8),o=new n({color:15909166,roughness:.5}),s=new G,c=ce.map(e=>new T(e[0],B+e[1],e[2])),l=new d;for(let e=0;e<c.length-1;e++)l.add(new te(c[e],c[e+1]));this.convCurve=l;let u=.75,f=0;for(let e=0;e<c.length-1;e++){let n=c[e],i=c[e+1],l=i.clone().sub(n),d=l.length(),p=l.clone().normalize(),m=new T(-p.z,0,p.x).normalize(),h=new w,g=[n.clone().addScaledVector(m,-.75/2),n.clone().addScaledVector(m,u/2),i.clone().addScaledVector(m,-.75/2),i.clone().addScaledVector(m,u/2)];h.setAttribute(`position`,new a(g.flatMap(e=>[e.x,e.y+.01,e.z]),3)),h.setAttribute(`uv`,new a([0,f,1,f,0,f+d,1,f+d],2)),h.setIndex([0,2,1,1,2,3]),h.computeVertexNormals(),h.attributes.normal.getY(0)<0&&h.setIndex([0,1,2,1,3,2]),h.computeVertexNormals(),s.add(t,h),f+=d;let _=n.clone().add(i).multiplyScalar(.5),v=Math.atan2(l.x,l.z),y=Math.asin(O.clamp(l.y/d,-1,1));for(let e of[-1,1]){let t=new k(.05,.18,d+.05);t.rotateX(-y),t.rotateY(v);let n=_.clone().addScaledVector(m,e*.405);t.translate(n.x,n.y-.03,n.z),s.add(r,t)}let b=Math.max(1,Math.floor(d/2));for(let e=0;e<=b;e++){let t=n.clone().lerp(i,e/b);for(let e of[-1,1]){let n=t.clone().addScaledVector(m,e*u/2),i=n.y-B;s.add(r,J(.06,i,.06,n.x,B+i/2,n.z))}t.y-1.2>2&&(t.y-B,s.add(o,J(.08,.6,.08,t.x+m.x*.6,B+.3,t.z+m.z*.6)))}}let p=Y(.03,.62,0,0,0,`x`,10),m=[],g=c[c.length-2],_=(()=>{let e=0;for(let t=0;t<c.length-2;t++)e+=c[t].distanceTo(c[t+1]);return e})();for(let e of[12,18,24,30]){let t=new T(e,B+H-.02,I+.4),n=new T(e,B+1.55,de);this.chutes.push({x:e,s:_+(e-g.x),curve:new te(t,n)});let i=t.distanceTo(n);for(let e=0;e<=i;e+=.11){let r=t.clone().lerp(n,e/i);m.push(new C().makeTranslation(r.x,r.y-.03,r.z))}let a=n.clone().sub(t),c=Math.atan2(-a.y,a.z);for(let a of[-1,1]){let o=new k(.04,.22,i);o.rotateX(c);let l=t.clone().add(n).multiplyScalar(.5);o.translate(e+a*.34,l.y,l.z),s.add(r,o)}s.add(r,J(.06,n.y-B,.06,e-.34,B+(n.y-B)/2,n.z),J(.06,n.y-B,.06,e+.34,B+(n.y-B)/2,n.z)),s.add(o,J(.7,.12,.08,e,B+H+.12,I-.4))}let v=new x(p,q.chrome,m.length);m.forEach((e,t)=>v.setMatrixAt(t,e)),v.castShadow=!0,this.root.add(v),s.add(new n({color:5595244,metalness:.6,roughness:.5,transparent:!0,opacity:.55}),J(25,.03,1.4,21.5,B+H-.35,I)),this.root.add(s.build())}stations(){let e=new G,t=new n({color:3949648,metalness:.6,roughness:.4}),r=K(new n({color:9071948,roughness:.55}),1,3),i=new n({color:1711136,roughness:.95});for(let n of ae){let r=P(n,16),a=ue;e.add(i,J(1.8,.03,1.1,r.x,B+.015,a));for(let n of[-1,1])e.add(t,J(.08,2.2,.08,r.x+n*.9,B+1.1,r.y+.62));e.add(t,J(1.88,.08,.08,r.x,B+2.2,r.y+.62)),e.add(q.ledGreen,J(1.7,.03,.03,r.x,B+2.14,r.y+.62)),e.add(q.screen,J(.55,.34,.03,r.x+.85,B+1.45,a-.2)),e.add(t,J(.05,1.2,.05,r.x+.85,B+.7,a-.2));let o=new De(`o`,n);o.root.position.set(r.x,B,a),o.root.rotation.y=Math.PI,this.root.add(o.root),this.pickers.push(o)}for(let n of he){let i=se+1;e.add(r,J(2,.05,.9,n,B+.9,i));for(let r of[-1,1])for(let a of[-1,1])e.add(t,J(.05,.9,.05,n+r*.95,B+.45,i+a*.4));e.add(q.screen,J(.5,.32,.03,n-.6,B+1.35,i+.35)),e.add(je[1],J(.6,.6,.5,n+.9,B+.3,i+.9)),e.add(je[2],J(.5,.05,.4,n+.3,B+.95,i+.1));let a=new De(`y`,Math.round(n));a.root.position.set(n,B,i+.75),a.root.rotation.y=Math.PI,this.root.add(a.root),this.packers.push(a)}this.root.add(e.build())}yardStuff(){let e=new G,t=K(new n({color:12039082,roughness:.8}),1.2),r=new n({color:15909166,roughness:.5}),i=K(new n({color:6120299,metalness:.7,roughness:.4}),.6),a=new n({color:546,emissive:16773336,emissiveIntensity:.1});this.nightMats.push({m:a,day:.1,night:6,key:`emissiveIntensity`});let o=33.8;e.add(t,J(3,.3,4,o,.15,76)),e.add(new m({color:10139856,roughness:.05,metalness:.4,clearcoat:1}),J(2.6,2.4,3.4,o,1.5,76)),e.add(t,J(3.4,.25,4.4,o,2.8,76));for(let[t,i]of[[40,1],[47,-1]]){e.add(r,J(.4,1,.4,t-i*2.6,.5,74.2));let a=new ne;a.position.set(t-i*2.6,1,74.2);let o=new v(J(4.8,.1,.1,i*2.4,0,0),new n({color:15790320,roughness:.4}));for(let e=0;e<4;e++){let t=new v(J(.4,.11,.11,i*(.5+e*1.2),0,0),new n({color:14036778}));a.add(t)}o.castShadow=!0,a.add(o),this.root.add(a),a.userData.dir=i,this.barriers.push(a)}for(let t of[...R,...z])for(let n of[-1,1])e.add(r,Y(.12,1.1,t+n*2.6,.55,V.z1+.6,`y`,14));let s=we(),c=new A({map:s,color:16767400,transparent:!0,opacity:0,blending:2,depthWrite:!1});this.nightMats.push({m:c,day:0,night:.55,key:`opacity`});for(let[t,n]of[[-40,46],[-20,46],[0,46],[20,46],[40,46],[-30,72],[0,72],[30,72],[52,60],[-56,52],[-45,30]]){e.add(i,Y(.12,11,t,5.5,n,`y`,10,.08),J(.25,.25,2.2,t,11,n+.9)),e.add(a,J(.5,.1,.9,t,10.85,n+1.6));let r=new v(new E(22,22),c);r.rotation.x=-Math.PI/2,r.position.set(t,.04,n+1.6),this.root.add(r),this.pools.push(r)}let l=new n({color:546,emissive:16771272,emissiveIntensity:.1});this.nightMats.push({m:l,day:.1,night:5,key:`emissiveIntensity`});for(let t of[...R,...z]){e.add(l,J(.36,.12,.22,t+2.3,B+L+1.25,V.z1+.41));let n=new v(new E(9,9),c);n.rotation.x=-Math.PI/2,n.position.set(t,.05,V.z1+4),this.root.add(n)}let u=(()=>{let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`);t.strokeStyle=`rgba(200,205,210,0.9)`,t.lineWidth=2;for(let e=-64;e<128;e+=10)t.beginPath(),t.moveTo(e,0),t.lineTo(e+64,64),t.stroke(),t.beginPath(),t.moveTo(e+64,0),t.lineTo(e,64),t.stroke();let n=new S(e);return n.wrapS=n.wrapT=h,n})(),d=new n({map:u,alphaMap:u,transparent:!0,alphaTest:.3,metalness:.8,roughness:.4,side:2,color:12107976});for(let[t,n]of[[-62,31.8],[50,62]]){let r=new E(n-t,2.2),a=r.attributes.uv;for(let e=0;e<a.count;e++)a.setXY(e,a.getX(e)*(n-t)/.5,a.getY(e)*2.2/.5);r.translate((t+n)/2,1.1,74.6),e.add(d,r);for(let r=t;r<=n;r+=3)e.add(i,Y(.04,2.3,r,1.15,74.6,`y`,8))}for(let t of[-62,62]){let n=new E(52,2.2);n.rotateY(Math.PI/2);let r=n.attributes.uv;for(let e=0;e<r.count;e++)r.setXY(e,r.getX(e)*104,r.getY(e)*4.4);n.translate(t,1.1,48.6),e.add(d,n)}this.root.add(e.build());let f=[1842981,15330543,9080985,10165276,1916815,3092275,13225168,4872762];for(let e=0;e<22;e++){if(Math.random()<.25)continue;let t=e<11?0:1,n=e%11,r=this.car(f[e%f.length]);r.position.set(-56.7+n*2.6+0,0,t?58.2:46.8),r.rotation.y=t?Math.PI:0,this.root.add(r)}}car(e){let t=new m({color:e,metalness:.6,roughness:.3,clearcoat:1,clearcoatRoughness:.05}),n=new G;n.add(t,J(1.85,.7,4.5,0,.62,0,.25)),n.add(t,J(1.6,.6,2.4,0,1.2,-.25,.25)),n.add(q.glass,J(1.62,.5,2.3,0,1.22,-.25,.2));for(let[e,t]of[[-.82,1.45],[.82,1.45],[-.82,-1.4],[.82,-1.4]])n.add(q.rubber,Y(.33,.24,e,.33,t,`x`,18));return n.add(q.head,J(.3,.08,.04,-.6,.75,2.26),J(.3,.08,.04,.6,.75,2.26)),n.add(q.tail,J(.3,.08,.04,-.6,.8,-2.26),J(.3,.08,.04,.6,.8,-2.26)),n.build()}surroundings(){let e=(()=>{let e=N(new g(1,3)),t=e.attributes.position,n=new T;for(let e=0;e<t.count;e++){n.fromBufferAttribute(t,e);let r=1+.18*Math.sin(n.x*5.1+n.y*3.3)*Math.cos(n.z*4.7)+.08*Math.sin(n.x*13+n.z*11);n.multiplyScalar(r),t.setXYZ(e,n.x,n.y*1.15,n.z)}return e.computeVertexNormals(),e})(),r=new n({color:16777215,roughness:.9});r.onBeforeCompile=e=>{e.uniforms.uT=Z.time,e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
uniform float uT;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vec4 ip = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
float sw = sin(uT * 1.3 + ip.x * 0.2 + ip.z * 0.13) * 0.06 + sin(uT * 3.1 + ip.x) * 0.02;
transformed.x += sw * (position.y + 1.0);
transformed.z += sw * 0.6 * (position.y + 1.0);`),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vLp;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vLp = position;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying vec3 vLp;
float lh(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float ln(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(lh(i), lh(i+vec3(1,0,0)), f.x), mix(lh(i+vec3(0,1,0)), lh(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(lh(i+vec3(0,0,1)), lh(i+vec3(1,0,1)), f.x), mix(lh(i+vec3(0,1,1)), lh(i+vec3(1,1,1)), f.x), f.y), f.z); }`).replace(`#include <color_fragment>`,`#include <color_fragment>
float clump = ln(vLp * 4.5) * 0.65 + ln(vLp * 11.0) * 0.35;
float up = smoothstep(-0.9, 0.9, vLp.y);
diffuseColor.rgb *= (0.38 + 0.5 * up) * (0.72 + 0.5 * clump);
diffuseColor.rgb += vec3(0.05, 0.07, 0.0) * smoothstep(0.62, 0.9, clump) * up;`).replace(`#include <normal_fragment_maps>`,`#include <normal_fragment_maps>
normal = normalize(normal + (vec3(ln(vLp * 9.0), ln(vLp * 9.0 + 3.1), ln(vLp * 9.0 + 7.7)) - 0.5) * 0.9);`)};let i=Y(.14,3.2,0,1.6,0,`y`,8,.1),a=new n({color:4864556,roughness:.9}),s=[],c=(e,t)=>e+Math.random()*(t-e);for(let e=-120;e<=140;e+=c(6,10))s.push([e,82+c(7,11),c(.8,1.3)]);for(let e=-120;e<=140;e+=c(5,9))s.push([e,82-c(7.5,9.5),c(.7,1.1)]);for(let e=-40;e<=70;e+=c(5,8))s.push([c(66,75),e,c(.8,1.4)]),s.push([c(-70,-64),e,c(.8,1.4)]);for(let e=-60;e<=60;e+=c(5,8))s.push([e,c(-34,-28),c(.9,1.5)]);for(let e=0;e<140;e++){let e=c(0,Math.PI*2),t=c(120,320);s.push([Math.cos(e)*t+10,Math.sin(e)*t+20,c(1.2,2.4)])}let l=s.filter(([e,t])=>!(Math.abs(e-87/2)<8&&t>70&&t<95)),u=new x(e,r,l.length*2),d=new x(i,a,l.length),f=new p;l.forEach(([e,n,r],i)=>{d.setMatrixAt(i,new C().compose(new T(e,0,n),new o,new T(r,r,r))),u.setMatrixAt(i*2,new C().compose(new T(e,3.9*r,n),new o().setFromEuler(new t(0,Math.random()*6,0)),new T(1.9*r,2*r,1.9*r))),u.setMatrixAt(i*2+1,new C().compose(new T(e+c(-.6,.6)*r,5*r,n+c(-.6,.6)*r),new o,new T(1.3*r,1.4*r,1.3*r))),f.setHSL(.25+c(-.03,.04),.38+c(-.1,.08),.22+c(-.05,.05)),u.setColorAt(i*2,f),u.setColorAt(i*2+1,f.offsetHSL(0,0,.03))});for(let e of[u,d])e.castShadow=!0,e.receiveShadow=!0,this.root.add(e);let m=new x(e,r,18);for(let e=0;e<18;e++)m.setMatrixAt(e,new C().compose(new T(-50+e%9*1.6,.4,e<9?22.5:3.6),new o,new T(.8,.6,.8)));m.castShadow=!0,this.root.add(m);let h=new G,_=K(new n({color:10331309,roughness:.6,metalness:.3,normalMap:be()}),.6,.1),v=new n({color:10331050,roughness:.5});for(let[e,t,n,r,i]of[[-260,-60,90,60,12],[250,-90,110,70,14],[-40,-230,160,60,13],[280,170,80,50,10],[-280,170,70,60,11]])h.add(_,J(n,i,r,e,i/2,t)),h.add(v,J(n+.4,.4,r+.4,e,i+.2,t));this.root.add(h.build())}update(e,t,n,r){for(let t of this.belts)t.map.offset.y-=e*r/1;Z.time.value=t;for(let e of this.nightMats)e.m[e.key]=O.lerp(e.day,e.night,n);for(let e of this.interiorLights)e.intensity=n*55,e.visible=n>.02;this.updateDocks(e)}};export{$ as a,Q as i,ze as n,Me as o,Be as r,Z as t};