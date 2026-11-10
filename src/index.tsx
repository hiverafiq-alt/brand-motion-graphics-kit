import React from 'react';
import {AbsoluteFill, Composition, Easing, Img, interpolate, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import defaults from '../brand.json';

export type BrandProps = {
  brand: string; headline: string; eyebrow: string; cta: string; url: string;
  background: string; foreground: string; accent: string; logo: string;
  fontFamily: string; safeMargin: number; quietMotion: boolean;
};
const reveal = (frame:number,start:number,duration:number) => interpolate(frame,[start,start+duration],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
function validate(p:BrandProps) {
  for(const color of [p.background,p.foreground,p.accent]) if(!/^#[\da-f]{6}$/i.test(color))throw new Error('Use six-digit brand hex colors');
  if(!p.brand.trim() || p.brand.length>36 || p.cta.length>60 || p.headline.length>95 || p.url.length>70)throw new Error('Keep brand ≤36, headline ≤95, CTA ≤60 and URL ≤70 characters. Shorten copy before rendering.');
  if(!Number.isFinite(p.safeMargin)||p.safeMargin<48||p.safeMargin>150)throw new Error('Safe margin must be between 48 and 150 pixels');
  if(p.logo && (/^https?:/.test(p.logo)||p.logo.includes('..')||p.logo.startsWith('/')))throw new Error('Use a local relative public/ logo path');
}
export const BrandEnding:React.FC<BrandProps> = (p) => {
  validate(p);const f=useCurrentFrame();const {width,height}=useVideoConfig();const landscape=width>height;const margin=p.safeMargin;
  const entrance=p.quietMotion?1:reveal(f,0,20), line=p.quietMotion?1:reveal(f,8,24),cta=p.quietMotion?1:reveal(f,20,18);
  const titleSize=Math.min(landscape?126:156,(width-2*margin)/Math.max(...p.headline.split('\n').map(t=>t.length),1)*1.55);
  return <AbsoluteFill style={{backgroundColor:p.background,color:p.foreground,fontFamily:p.fontFamily,padding:margin}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:30,fontSize:20,letterSpacing:2}}>
      {p.logo?<Img src={staticFile(p.logo)} style={{width:210,height:90,objectFit:'contain',objectPosition:'left'}}/>:<strong style={{fontSize:28,letterSpacing:-1}}>{p.brand}</strong>}
      <span style={{textAlign:'right',maxWidth:'50%'}}>{p.eyebrow}</span>
    </div>
    <div style={{position:'absolute',top:height*(landscape?.27:.32),left:margin,right:margin,opacity:entrance,transform:`translateY(${(1-entrance)*40}px)`}}>
      <div style={{fontWeight:800,fontSize:titleSize,lineHeight:1.02,letterSpacing:-titleSize*.055,whiteSpace:'pre-line'}}>{p.headline}</div>
      <div style={{height:8,marginTop:44,background:p.accent,transform:`scaleX(${line})`,transformOrigin:'left'}}/>
    </div>
    <div style={{position:'absolute',bottom:margin+30,left:margin,right:margin,opacity:cta,transform:`translateY(${(1-cta)*20}px)`}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:30}}><span style={{fontSize:landscape?30:38,maxWidth:'80%'}}>{p.cta}</span><svg width="64" height="64" viewBox="0 0 64 64" fill="none"><path d="M8 55L55 8M12 8H55V51" stroke="currentColor" strokeWidth="3"/></svg></div>
      <div style={{borderTop:'1px solid currentColor',marginTop:30,paddingTop:24,fontSize:25}}>{p.url}</div>
    </div>
  </AbsoluteFill>;
};
export const BrandOverlay:React.FC<BrandProps> = (p) => {
  validate(p);const f=useCurrentFrame();const {width,height}=useVideoConfig();const opacity=p.quietMotion?1:reveal(f,0,15);const m=p.safeMargin;
  return <AbsoluteFill style={{fontFamily:p.fontFamily,color:p.foreground}}>
    <div style={{position:'absolute',bottom:m,left:m,right:m,background:p.background,padding:32,borderLeft:`8px solid ${p.accent}`,opacity,transform:`translateY(${(1-opacity)*20}px)`}}>
      <strong style={{fontSize:Math.min(40,width/24)}}>{p.brand}</strong><div style={{display:'flex',justifyContent:'space-between',gap:20,fontSize:Math.min(28,width/32),marginTop:14}}><span>{p.cta}</span><span>{p.url}</span></div>
    </div>
  </AbsoluteFill>;
};
const Root:React.FC=()=> <>
  <Composition id="BrandEnding" component={BrandEnding} width={1080} height={1920} fps={30} durationInFrames={120} defaultProps={defaults}/>
  <Composition id="BrandEndingFeed" component={BrandEnding} width={1080} height={1350} fps={30} durationInFrames={120} defaultProps={defaults}/>
  <Composition id="BrandEndingLandscape" component={BrandEnding} width={1920} height={1080} fps={30} durationInFrames={120} defaultProps={defaults}/>
  <Composition id="BrandOverlay" component={BrandOverlay} width={1080} height={1920} fps={30} durationInFrames={120} defaultProps={defaults}/>
</>;
registerRoot(Root);
