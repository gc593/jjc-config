
import { EventConfig } from '../types';

const esc = (s: string) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const lightenColor = (hex: string, pct: number) => {
  let { r, g, b } = hexToRgb(hex);
  r = Math.min(255, r + Math.round((255 - r) * pct / 100));
  g = Math.min(255, g + Math.round((255 - g) * pct / 100));
  b = Math.min(255, b + Math.round((255 - b) * pct / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const generateHTML = (c: EventConfig): string => {
  const accentGlow = lightenColor(c.accent, 20);
  const goldLight = lightenColor(c.gold, 25);
  const { r: accentR, g: accentG, b: accentB } = hexToRgb(c.accent);
  const { r: goldR, g: goldG, b: goldB } = hexToRgb(c.gold);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Johnson Japan Club — ${esc(c.eventNameJp)}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@200;400;700;900&family=DM+Sans:wght@0,400;0,500;0,600;0,700&display=swap" rel="stylesheet">
<style>
:root{--ink:${c.ink};--paper:${c.paper};--accent:${c.accent};--accent-glow:${accentGlow};--gold:${c.gold};--gold-light:${goldLight};--subtle:#8a8275;--divider:#d4cec3;--dark:${c.dark}}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:var(--dark);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased}
${c.showPreloader ? `.preloader{position:fixed;inset:0;background:var(--dark);z-index:10000;display:flex;align-items:center;justify-content:center;transition:opacity .6s,visibility .6s}.preloader.done{opacity:0;visibility:hidden;pointer-events:none}.preloader-text{font-family:'Noto Serif JP',serif;font-weight:200;font-size:clamp(1.5rem,4vw,2.5rem);color:rgba(245,240,232,.9);letter-spacing:.3em;opacity:0;animation:pf 1.8s ease forwards}@keyframes pf{0%{opacity:0;transform:translateY(10px)}30%{opacity:1;transform:translateY(0)}70%{opacity:1}100%{opacity:0}}` : ''}
.hero{min-height:100vh;background:var(--dark);display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:2rem;position:relative;overflow:hidden}
.hero-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.4;animation:of 15s ease-in-out infinite}.hero-orb-1{width:500px;height:500px;background:radial-gradient(circle,rgba(${accentR},${accentG},${accentB},.3),transparent 70%);top:-10%;right:-10%}.hero-orb-2{width:400px;height:400px;background:radial-gradient(circle,rgba(${goldR},${goldG},${goldB},.2),transparent 70%);bottom:-5%;left:-5%;animation-delay:-5s}.hero-orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(${accentR},${accentG},${accentB},.15),transparent 70%);top:40%;left:30%;animation-delay:-10s}@keyframes of{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(.95)}}
${c.showKanji ? `.hero-kanji{position:absolute;writing-mode:vertical-rl;font-family:'Noto Serif JP',serif;font-weight:900;user-select:none;z-index:1}.hero-kanji-right{right:6%;top:8%;font-size:clamp(3rem,8vw,8rem);color:rgba(${accentR},${accentG},${accentB},.08);letter-spacing:.4em}.hero-kanji-left{left:6%;bottom:8%;font-size:clamp(2rem,5vw,5rem);color:rgba(${goldR},${goldG},${goldB},.06);letter-spacing:.3em}` : ''}
.hero-content{position:relative;z-index:2}
.club-badge{display:inline-flex;align-items:center;gap:.6rem;padding:.6rem 1.4rem;border:1px solid rgba(245,240,232,.15);border-radius:100px;font-size:.7rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,240,232,.5);margin-bottom:3rem;backdrop-filter:blur(10px);background:rgba(255,255,255,.03)}.club-badge::before{content:'';width:6px;height:6px;background:var(--accent);border-radius:50%;animation:bp 2s ease-in-out infinite}@keyframes bp{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(${accentR},${accentG},${accentB},.4)}50%{opacity:.8;box-shadow:0 0 0 6px rgba(${accentR},${accentG},${accentB},0)}}
.hero-date{font-family:'Noto Serif JP',serif;font-size:clamp(.85rem,1.8vw,1rem);color:var(--gold-light);letter-spacing:.25em;margin-bottom:1.5rem}
.hero-title-en{font-family:'Noto Serif JP',serif;font-weight:900;font-size:clamp(3.5rem,10vw,8rem);line-height:.95;letter-spacing:-.03em;color:var(--paper);margin-bottom:.3rem}
.hero-title-jp{font-family:'Noto Serif JP',serif;font-weight:900;font-size:clamp(1.8rem,5vw,4rem);line-height:1;color:var(--accent);margin-bottom:2.5rem}
.hero-sub{font-size:clamp(1rem,2.2vw,1.2rem);color:rgba(245,240,232,.55);max-width:480px;line-height:1.7;margin:0 auto 3.5rem}
.hero-cta{display:inline-flex;align-items:center;gap:.75rem;padding:1.1rem 2.8rem;background:var(--paper);color:var(--dark);text-decoration:none;font-weight:700;font-size:.95rem;letter-spacing:.05em;border-radius:100px;transition:all .4s cubic-bezier(.16,1,.3,1)}.hero-cta:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 20px 60px rgba(245,240,232,.15)}.hero-cta-arrow{display:inline-block;transition:transform .4s cubic-bezier(.16,1,.3,1)}.hero-cta:hover .hero-cta-arrow{transform:translateX(5px)}
.scroll-indicator{position:absolute;bottom:2.5rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:.75rem;z-index:2}.scroll-text{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(245,240,232,.3)}.scroll-bar{width:1px;height:50px;background:rgba(245,240,232,.1);position:relative;overflow:hidden}.scroll-bar::after{content:'';position:absolute;top:-100%;width:100%;height:50%;background:var(--accent);animation:sp 2.5s ease-in-out infinite}@keyframes sp{0%{top:-50%;opacity:0}50%{top:100%;opacity:1}100%{top:100%;opacity:0}}
.transition-section{height:50vh;background:linear-gradient(to bottom,var(--dark),var(--paper));display:flex;align-items:center;justify-content:center}.transition-text{font-family:'Noto Serif JP',serif;font-weight:200;font-size:clamp(1.2rem,3vw,2rem);color:rgba(245,240,232,.35);letter-spacing:.2em;text-align:center}.transition-sub{font-size:.75rem;color:rgba(138,130,117,.6);letter-spacing:.15em;margin-top:.5rem}
.details-section{background:var(--paper);padding:8rem 2rem;position:relative}.details-inner{max-width:1000px;margin:0 auto;position:relative;z-index:1}.section-label{font-size:.65rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;display:flex;align-items:center;gap:1rem}.section-label::after{content:'';flex:1;height:1px;background:var(--divider)}.section-title{font-family:'Noto Serif JP',serif;font-weight:900;font-size:clamp(2rem,5vw,3.5rem);line-height:1.1;letter-spacing:-.02em;margin-bottom:4rem}
.details-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}.detail-card{padding:2.5rem 2rem;background:rgba(255,255,255,.6);border:1px solid var(--divider);border-radius:3px;transition:all .5s cubic-bezier(.16,1,.3,1);backdrop-filter:blur(10px)}.detail-card:hover{transform:translateY(-8px);box-shadow:0 20px 60px rgba(0,0,0,.08);border-color:var(--gold-light)}.detail-icon{font-size:1.8rem;margin-bottom:1.2rem;display:block}.detail-card-label{font-size:.6rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--subtle);margin-bottom:.6rem}.detail-card-value{font-family:'Noto Serif JP',serif;font-size:1.3rem;font-weight:700;line-height:1.3}.detail-card-note{font-size:.82rem;color:var(--subtle);margin-top:.5rem;line-height:1.5}
.experience{background:var(--paper);position:relative}.experience-sticky{position:sticky;top:0;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}.experience-bg{position:absolute;inset:5%;background:var(--dark);border-radius:20px;overflow:hidden}.experience-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,rgba(${accentR},${accentG},${accentB},.15) 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,rgba(${goldR},${goldG},${goldB},.1) 0%,transparent 60%)}.experience-content{position:relative;z-index:2;text-align:center;padding:2rem;max-width:700px}.experience-kanji{font-family:'Noto Serif JP',serif;font-weight:900;font-size:clamp(5rem,15vw,10rem);line-height:1;color:rgba(245,240,232,.06);margin-bottom:-1rem}.experience-headline{font-family:'Noto Serif JP',serif;font-weight:700;font-size:clamp(1.5rem,4vw,2.8rem);color:var(--paper);line-height:1.2;margin-bottom:1.5rem}.experience-desc{font-size:clamp(.95rem,2vw,1.1rem);color:rgba(245,240,232,.55);line-height:1.7;max-width:500px;margin:0 auto}.experience-scroll-space{height:50vh}
.inclusions-section{background:var(--paper);padding:8rem 2rem}.inclusions-inner{max-width:800px;margin:0 auto}.inclusion-item{padding:2rem 0;border-bottom:1px solid var(--divider);display:grid;grid-template-columns:60px 1fr;gap:1.5rem;align-items:start;transition:all .4s cubic-bezier(.16,1,.3,1)}.inclusion-item:first-child{border-top:1px solid var(--divider)}.inclusion-item:hover{padding-left:1.5rem}.inclusion-item:hover .inclusion-num{color:var(--accent);transform:scale(1.1)}.inclusion-num{font-family:'Noto Serif JP',serif;font-weight:900;font-size:1.8rem;color:var(--divider);transition:all .4s cubic-bezier(.16,1,.3,1);line-height:1;padding-top:.2rem}.inclusion-text{font-size:1.15rem;line-height:1.6}.inclusion-detail{font-size:.85rem;color:var(--subtle);margin-top:.3rem}
.interlude{background:var(--dark);padding:10rem 2rem;text-align:center;position:relative;overflow:hidden}.interlude-kanji{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Noto Serif JP',serif;font-size:clamp(10rem,30vw,25rem);font-weight:900;color:rgba(255,255,255,.015);pointer-events:none;white-space:nowrap}.interlude-quote{font-family:'Noto Serif JP',serif;font-weight:400;font-size:clamp(1.4rem,3.5vw,2.5rem);color:var(--paper);max-width:650px;margin:0 auto 2rem;line-height:1.5;position:relative;z-index:1}.interlude-attr{font-size:.8rem;color:rgba(245,240,232,.35);letter-spacing:.15em;text-transform:uppercase;position:relative;z-index:1}
.pricing-section{background:var(--paper);padding:10rem 2rem;text-align:center;position:relative}.pricing-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--divider),transparent)}.pricing-inner{max-width:600px;margin:0 auto;position:relative;z-index:1}.price-eyebrow{font-size:.65rem;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:2rem}.price-display{display:flex;align-items:baseline;justify-content:center;gap:.15rem;margin-bottom:.5rem}.price-currency{font-family:'Noto Serif JP',serif;font-size:clamp(1.5rem,3vw,2rem);font-weight:700;color:var(--subtle);align-self:flex-start;margin-top:.8rem}.price-amount{font-family:'Noto Serif JP',serif;font-size:clamp(6rem,15vw,9rem);font-weight:900;line-height:1;letter-spacing:-.03em}.price-breakdown{font-size:.9rem;color:var(--subtle);margin-bottom:1.5rem}.price-includes{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap;margin-bottom:3.5rem}.price-tag{font-size:.72rem;font-weight:600;letter-spacing:.06em;color:var(--subtle);padding:.4rem .9rem;border:1px solid var(--divider);border-radius:100px;transition:all .3s}.price-tag:hover{border-color:var(--gold-light);color:var(--ink)}
.cta-final{display:inline-flex;align-items:center;gap:.85rem;padding:1.3rem 3.5rem;background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:1.1rem;letter-spacing:.03em;border-radius:100px;transition:all .4s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(${accentR},${accentG},${accentB},.25)}.cta-final::before{content:'';position:absolute;top:0;left:-200%;width:200%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);animation:cs 3s ease-in-out infinite}@keyframes cs{0%{left:-200%}50%{left:100%}100%{left:100%}}.cta-final:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 20px 60px rgba(${accentR},${accentG},${accentB},.4);background:var(--accent-glow)}.cta-arrow{display:inline-block;transition:transform .4s cubic-bezier(.16,1,.3,1)}.cta-final:hover .cta-arrow{transform:translateX(5px)}
.urgency-badge{display:inline-block;margin-top:2rem;padding:.5rem 1.2rem;border:1px solid var(--accent);border-radius:100px;font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);animation:up 2.5s ease-in-out infinite}@keyframes up{0%,100%{opacity:1}50%{opacity:.5}}
.footer{background:var(--dark);text-align:center;padding:4rem 2rem}.footer-brand{font-family:'Noto Serif JP',serif;font-weight:700;font-size:.95rem;color:rgba(245,240,232,.7);margin-bottom:.5rem}.footer-sub{font-size:.75rem;color:rgba(245,240,232,.25);letter-spacing:.1em}
.reveal{opacity:0;transform:translateY(40px);transition:all .9s cubic-bezier(.16,1,.3,1)}.reveal.visible{opacity:1;transform:translateY(0)}.reveal-scale{opacity:0;transform:scale(.92) translateY(20px);transition:all 1s cubic-bezier(.16,1,.3,1)}.reveal-scale.visible{opacity:1;transform:scale(1) translateY(0)}.hero-enter{opacity:0;transform:translateY(30px)}.hero-enter.active{opacity:1;transform:translateY(0);transition:all .8s cubic-bezier(.16,1,.3,1)}
.stagger-1{transition-delay:.1s}.stagger-2{transition-delay:.2s}.stagger-3{transition-delay:.3s}.stagger-4{transition-delay:.4s}.stagger-5{transition-delay:.5s}.stagger-6{transition-delay:.6s}.stagger-7{transition-delay:.7s}
@media(max-width:768px){.hero-kanji{display:none}.details-grid{grid-template-columns:1fr 1fr;gap:1rem}.detail-card{padding:1.5rem}.experience-bg{inset:2%;border-radius:12px}}@media(max-width:500px){.details-grid{grid-template-columns:1fr}.inclusion-item{grid-template-columns:40px 1fr;gap:1rem}.inclusion-num{font-size:1.4rem}}
</style>
</head>
<body>
${c.showPreloader ? `<div class="preloader" id="preloader"><span class="preloader-text">ジョンソン日本クラブ</span></div>` : ''}
<section class="hero">
<div class="hero-orb hero-orb-1"></div><div class="hero-orb hero-orb-2"></div><div class="hero-orb hero-orb-3"></div>
${c.showKanji ? `<div class="hero-kanji hero-kanji-right" data-parallax="0.15">カラオケ</div><div class="hero-kanji hero-kanji-left" data-parallax="0.08">歌声</div>` : ''}
<div class="hero-content">
<div class="club-badge hero-enter stagger-1">Johnson Japan Club · Cornell</div>
<div class="hero-date hero-enter stagger-2">${esc(c.eventDate)}</div>
<h1 class="hero-title-en hero-enter stagger-3">${esc(c.eventNameEn).replace(' ', '<br>')}</h1>
<div class="hero-title-jp hero-enter stagger-4">${esc(c.eventNameJp)}</div>
<p class="hero-sub hero-enter stagger-5">${esc(c.heroTagline)}</p>
<a href="#reserve" class="hero-cta hero-enter stagger-6">Reserve Your Spot <span class="hero-cta-arrow">→</span></a>
</div>
<div class="scroll-indicator hero-enter stagger-7"><span class="scroll-text">Scroll</span><div class="scroll-bar"></div></div>
</section>
${c.showTransition ? `<div class="transition-section"><div style="text-align:center"><div class="transition-text reveal">${esc(c.transitionJp)}</div><div class="transition-sub reveal stagger-1">${esc(c.transitionSub)}</div></div></div>` : ''}
<section class="details-section"><div class="details-inner">
<div class="section-label reveal">The Details</div>
<h2 class="section-title reveal stagger-1">Everything you<br>need to know.</h2>
<div class="details-grid">
<div class="detail-card reveal-scale stagger-1"><span class="detail-icon">📅</span><div class="detail-card-label">When</div><div class="detail-card-value">${esc(c.eventDateCard)}</div><div class="detail-card-note">${esc(c.eventTime)}</div></div>
<div class="detail-card reveal-scale stagger-2"><span class="detail-icon">📍</span><div class="detail-card-label">Where</div><div class="detail-card-value">${esc(c.eventVenue)}</div><div class="detail-card-note">${esc(c.eventVenueNote)}</div></div>
<div class="detail-card reveal-scale stagger-3"><span class="detail-icon">🎫</span><div class="detail-card-label">Price</div><div class="detail-card-value">$${esc(c.eventPrice)} / person</div><div class="detail-card-note">${esc(c.eventPriceNote)}</div></div>
<div class="detail-card reveal-scale stagger-4"><span class="detail-icon">👥</span><div class="detail-card-label">Capacity</div><div class="detail-card-value">${esc(c.eventCapacity)}</div><div class="detail-card-note">First come, first served.</div></div>
</div></div></section>
${c.showExperience ? `<section class="experience"><div class="experience-sticky"><div class="experience-bg reveal-scale"><div class="experience-content"><div class="experience-kanji reveal stagger-1">夜</div><h2 class="experience-headline reveal stagger-2">${esc(c.expHeadline)}</h2><p class="experience-desc reveal stagger-3">${esc(c.expDesc)}</p></div></div></div><div class="experience-scroll-space"></div></section>` : ''}
${c.showInclusions ? `<section class="inclusions-section"><div class="inclusions-inner">
<div class="section-label reveal">What's Included</div>
<h2 class="section-title reveal stagger-1">Your $${esc(c.eventPrice)} gets you<br>all of this.</h2>
<div class="inclusion-item reveal stagger-1"><span class="inclusion-num">01</span><div><div class="inclusion-text">${esc(c.inc1)}</div><div class="inclusion-detail">${esc(c.inc1d)}</div></div></div>
<div class="inclusion-item reveal stagger-2"><span class="inclusion-num">02</span><div><div class="inclusion-text">${esc(c.inc2)}</div><div class="inclusion-detail">${esc(c.inc2d)}</div></div></div>
<div class="inclusion-item reveal stagger-3"><span class="inclusion-num">03</span><div><div class="inclusion-text">${esc(c.inc3)}</div><div class="inclusion-detail">${esc(c.inc3d)}</div></div></div>
<div class="inclusion-item reveal stagger-4"><span class="inclusion-num">04</span><div><div class="inclusion-text">${esc(c.inc4)}</div><div class="inclusion-detail">${esc(c.inc4d)}</div></div></div>
</div></section>` : ''}
${c.showQuote ? `<section class="interlude"><div class="interlude-kanji">日本</div><p class="interlude-quote reveal">${esc(c.quoteText)}</p><p class="interlude-attr reveal stagger-1">${esc(c.quoteAttr)}</p></section>` : ''}
<section class="pricing-section" id="reserve"><div class="pricing-inner">
<div class="price-eyebrow reveal">Reserve Your Spot</div>
<div class="price-display reveal stagger-1"><span class="price-currency">$</span><span class="price-amount">${esc(c.eventPrice)}</span></div>
<p class="price-breakdown reveal stagger-2">Per person. Covers everything.</p>
<div class="price-includes reveal stagger-3"><span class="price-tag">Karaoke room</span><span class="price-tag">Food & drinks</span><span class="price-tag">3 hours</span><span class="price-tag">Good vibes</span></div>
<a href="${esc(c.eventURL)}" class="cta-final reveal stagger-4" target="_blank" rel="noopener">Get Your Ticket <span class="cta-arrow">→</span></a>
<div class="urgency-badge reveal stagger-5">Limited to ${esc(c.eventCapacity)}</div>
</div></section>
<footer class="footer"><div class="footer-brand">Johnson Japan Club · ジョンソン日本クラブ</div><p class="footer-sub">Cornell SC Johnson College of Business</p></footer>
<script>
${c.showPreloader ? `window.addEventListener('load',()=>{setTimeout(()=>{const p=document.getElementById('preloader');if(p)p.classList.add('done');setTimeout(()=>{document.querySelectorAll('.hero-enter').forEach(e=>e.classList.add('active'))},200)},2000)});` : `window.addEventListener('load',()=>{document.querySelectorAll('.hero-enter').forEach(e=>e.classList.add('active'))});`}
const o=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal,.reveal-scale').forEach(e=>o.observe(e));
let t=false;window.addEventListener('scroll',()=>{if(!t){requestAnimationFrame(()=>{const y=window.scrollY;document.querySelectorAll('[data-parallax]').forEach(e=>{e.style.transform='translateY('+y*parseFloat(e.dataset.parallax)+'px)'});t=false});t=true}});
</script>
</body></html>`;
};
