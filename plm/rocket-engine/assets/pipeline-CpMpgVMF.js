import{C as e,Gt as t,J as n,Jt as r,S as i,c as a,cn as o,dn as s,hn as c,mn as l,n as u,t as d,vn as f,vt as p,zt as m}from"./Pass-mJhgIX3K.js";var h={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},g=class extends u{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof r?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=s.clone(e.uniforms),this.material=new r({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new d(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},_=class extends u{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},v=class extends u{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},y=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let r=e.getSize(new l);this._width=r.width,this._height=r.height,t=new f(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:n}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new g(h),this.copyPass.material.blending=0,this.timer=new o}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}_!==void 0&&(r instanceof _?n=!0:r instanceof v&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new l);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},b={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new i(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},x=class e extends u{constructor(e,t=1,a,o){super(),this.strength=t,this.radius=a,this.threshold=o,this.resolution=e===void 0?new l(256,256):new l(e.x,e.y),this.clearColor=new i(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);this.renderTargetBright=new f(u,m,{type:n}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new f(u,m,{type:n});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let r=new f(u,m,{type:n});r.texture.name=`UnrealBloomPass.v`+e,r.texture.generateMipmaps=!1,this.renderTargetsVertical.push(r),u=Math.round(u/2),m=Math.round(m/2)}let g=b;this.highPassUniforms=s.clone(g.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new r({uniforms:this.highPassUniforms,vertexShader:g.vertexShader,fragmentShader:g.fragmentShader}),this.separableBlurMaterials=[];let _=[6,10,14,18,22];u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(_[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new l(1/u,1/m),u=Math.round(u/2),m=Math.round(m/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let v=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=v,this.bloomTintColors=[new c(1,1,1),new c(1,1,1),new c(1,1,1),new c(1,1,1),new c(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=s.clone(h.uniforms),this.blendMaterial=new r({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new i,this._oldClearAlpha=1,this._basic=new p,this._fsQuad=new d(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new l(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);return new r({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new l(.5,.5)},direction:{value:new l(.5,.5)},gaussianCoefficients:{value:t}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new r({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};x.BlurDirectionX=new l(1,0),x.BlurDirectionY=new l(0,1);var S={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},C=class extends u{constructor(){super(),this.isOutputPass=!0,this.uniforms=s.clone(S.uniforms),this.material=new m({name:S.name,uniforms:this.uniforms,vertexShader:S.vertexShader,fragmentShader:S.fragmentShader}),this._fsQuad=new d(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,n,r){this.uniforms.tDiffuse.value=r.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},e.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},w=class extends u{layers=[];clearColor=new i(0);constructor(){super(),this.needsSwap=!1}render(e,t,n){let r=e.autoClear;e.autoClear=!1,e.setRenderTarget(this.renderToScreen?null:n),e.setClearColor(this.clearColor,1),e.clear(!0,!0,!0);for(let t of this.layers)t.clearDepth&&e.clearDepth(),e.render(t.scene,t.camera);e.autoClear=r}},T=`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,E=class extends u{fsq;u={tIn:{value:null},uSun:{value:new l(.5,.5)},uSunVis:{value:0},uAspect:{value:1},uTime:{value:0},uFade:{value:1},uCA:{value:1},uGrain:{value:1},uFlare:{value:1}};constructor(){super(),this.fsq=new d(new r({uniforms:this.u,vertexShader:T,fragmentShader:`
        uniform sampler2D tIn; uniform vec2 uSun; uniform float uSunVis, uAspect, uTime, uFade, uCA, uGrain, uFlare;
        varying vec2 vUv;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        vec3 ghost(vec2 uv, vec2 c, float r, vec3 col){
          vec2 d = (uv - c) * vec2(uAspect, 1.0);
          float l = length(d);
          float ring = smoothstep(r, r * 0.8, l) * (0.35 + 0.65 * smoothstep(r * 0.55, r * 0.95, l));
          return col * ring;
        }
        void main(){
          vec2 cc = vUv - 0.5;
          float e = dot(cc, cc);
          vec2 off = cc * e * 0.012 * uCA;
          vec3 col;
          col.r = texture2D(tIn, vUv - off).r;
          col.g = texture2D(tIn, vUv).g;
          col.b = texture2D(tIn, vUv + off).b;
          // flare from the sun, if it is on screen and not blocked
          if (uSunVis > 0.001) {
            vec2 d = (vUv - uSun) * vec2(uAspect, 1.0);
            float r = length(d);
            float a = atan(d.y, d.x);
            float burst = pow(abs(cos(a * 3.0)), 60.0) * 0.6 + pow(abs(cos(a * 3.0 + 0.52)), 160.0) * 0.4; // six spikes
            float rays = burst * exp(-r * 7.0) * 1.2 + exp(-r * 22.0) * 2.2 + exp(-r * 4.0) * 0.08;
            float streak = exp(-abs(d.y) * 220.0) * exp(-abs(d.x) * 2.6) * 0.5;
            vec3 f = vec3(1.0, 0.93, 0.82) * rays + vec3(0.55, 0.7, 1.0) * streak;
            // ghosts mirrored through the centre
            vec2 axis = 0.5 - uSun;
            f += ghost(vUv, uSun + axis * 1.4, 0.05, vec3(0.25, 0.45, 1.0)) * 0.05;
            f += ghost(vUv, uSun + axis * 1.75, 0.11, vec3(0.3, 1.0, 0.55)) * 0.02;
            f += ghost(vUv, uSun + axis * 2.3, 0.035, vec3(1.0, 0.45, 0.2)) * 0.07;
            f += ghost(vUv, uSun + axis * 0.6, 0.02, vec3(0.8, 0.6, 1.0)) * 0.06;
            // a soft rainbow halo around the sun
            float halo = exp(-pow((r - 0.22) / 0.012, 2.0));
            f += vec3(0.6 + 0.4 * sin(r * 300.0), 0.6 + 0.4 * sin(r * 300.0 + 2.0), 0.6 + 0.4 * sin(r * 300.0 + 4.0)) * halo * 0.04;
            col += f * uSunVis * uFlare;
          }
          // vignette and grain
          col *= 1.0 - e * 0.55;
          float g = h(vUv * vec2(1920.0, 1080.0) + fract(uTime * 7.13) * 100.0) - 0.5;
          col += g * 0.012 * uGrain * (0.2 + sqrt(max(col, 0.0)));
          gl_FragColor = vec4(col * uFade, 1.0);
        }`}))}render(e,t,n){this.u.tIn.value=n.texture,e.setRenderTarget(this.renderToScreen?null:t),this.fsq.render(e)}},D=class extends u{fsq=new d(new r({uniforms:{tIn:{value:null},uMax:{value:6}},vertexShader:T,fragmentShader:`uniform sampler2D tIn; uniform float uMax; varying vec2 vUv;
      void main(){ vec3 c = texture2D(tIn, vUv).rgb; if (any(isnan(c)) || any(isinf(c))) c = vec3(0.0); float m = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(m > uMax ? c * (uMax / m) : c, 1.0); }`}));render(e,t,n){this.fsq.material.uniforms.tIn.value=n.texture,e.setRenderTarget(this.renderToScreen?null:t),this.fsq.render(e)}},O=class{renderer;composer;layers=new w;bloom;lens=new E;out=new C;width=1;height=1;constructor(e,r=!1,i=!1){this.renderer=new a({canvas:e,antialias:!1,powerPreference:`high-performance`,preserveDrawingBuffer:r,logarithmicDepthBuffer:i}),this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1,this.renderer.outputColorSpace=t,this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1;let o=new f(4,4,{type:n,samples:4});this.composer=new y(this.renderer,o),this.bloom=new x(new l(256,256),.45,.6,1.1),this.composer.addPass(this.layers),this.composer.addPass(new D),this.composer.addPass(this.bloom),this.composer.addPass(this.lens),this.composer.addPass(this.out)}resize(e,t,n){this.width=e,this.height=t,this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1),this.composer.setPixelRatio(n),this.composer.setSize(e,t),this.lens.u.uAspect.value=e/t}render(e){this.composer.render(e)}};export{x as a,C as i,E as n,y as o,O as r,h as s,D as t};