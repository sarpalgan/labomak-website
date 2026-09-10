import { tensileState } from '../tensile-geometry.js';

// A purpose-built, layered mechanical scene, separate from product photography.
export function tensileRender(lang) {
  const tr = lang === 'tr';
  const bolts = (x,y) => `<g transform="translate(${x} ${y})"><circle r="5" fill="url(#rig-steel)" stroke="#333b41"/><path d="M-2 -1 L0 -2.5 L2 -1 V1 L0 2.5 L-2 1Z" fill="#343a3d"/></g>`;
  const screws = [175,385].map(x=>`<rect x="${x}" y="94" width="13" height="424" rx="4" fill="url(#rig-chrome)"/><rect x="${x}" y="94" width="13" height="424" fill="url(#rig-thread)"/>`).join('');
  const grip = `<path d="M253 0 H307 L314 16 V43 L300 66 H260 L246 43 V16Z" fill="url(#rig-dark)" stroke="#79828a"/><path d="M254 19 H306 L297 48 H263Z" fill="url(#rig-steel)"/><path d="M278 20 H282 V48 H278Z" fill="#14191d"/><path d="M257 22 L270 43 M262 21 L274 43 M289 43 L300 22 M285 43 L296 21" stroke="#667079" stroke-width="1.3"/>${bolts(256,10)}${bolts(304,10)}`;
  return `<svg class="lm-rig" viewBox="0 0 580 640" width="580" height="640" role="img" aria-labelledby="rig-title rig-desc">
    <title id="rig-title">${tr?'Çekme test cihazında numune uzaması':'Specimen elongation in a tensile testing machine'}</title>
    <desc id="rig-desc">${tr?'Çift kolonlu bir test cihazının hareketli traversi yukarı çıkar, çeneler arasındaki numune uzar, boyun verir ve kopar. Temsili sünek malzeme davranışı; gerçek ölçüm veya ürün konfigürasyonu değildir.':'The moving crosshead of a dual-column test machine rises. The specimen between the grips elongates, necks and fractures. An illustrative ductile response, not a measurement or product configuration.'}</desc>
    <defs>
      <linearGradient id="rig-steel"><stop stop-color="#8a9398"/><stop offset=".16" stop-color="#e2e5e6"/><stop offset=".44" stop-color="#b2b9be"/><stop offset=".72" stop-color="#f1f2ef"/><stop offset="1" stop-color="#7b858d"/></linearGradient>
      <linearGradient id="rig-chrome"><stop stop-color="#414b54"/><stop offset=".36" stop-color="#e6ecee"/><stop offset=".53" stop-color="#fff"/><stop offset=".7" stop-color="#89959f"/><stop offset="1" stop-color="#3e4850"/></linearGradient>
      <linearGradient id="rig-dark" x2=".4" y2="1"><stop stop-color="#626c73"/><stop offset=".3" stop-color="#363e45"/><stop offset="1" stop-color="#171d22"/></linearGradient>
      <linearGradient id="rig-gold" x2=".2" y2="1"><stop stop-color="#ffda78"/><stop offset=".22" stop-color="#ffb629"/><stop offset=".8" stop-color="#d8920d"/><stop offset="1" stop-color="#a96b05"/></linearGradient>
      <linearGradient id="rig-sample"><stop stop-color="#bd8220"/><stop offset=".35" stop-color="#ffe1a3"/><stop offset=".6" stop-color="#ffb629"/><stop offset="1" stop-color="#a56d11"/></linearGradient>
      <radialGradient id="rig-shadow"><stop stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <pattern id="rig-thread" width="13" height="6" patternUnits="userSpaceOnUse"><path d="M0 5 L13 1" stroke="#202a32" stroke-width="1" opacity=".55"/></pattern>
    </defs>
    <ellipse cx="290" cy="600" rx="240" ry="31" fill="url(#rig-shadow)"/>
    <g aria-hidden="true">
    <path d="M127 93 L146 74 H437 L453 92 V543 H127Z" fill="#11171c" stroke="#414a51"/>
    <path d="M437 74 L453 92 V543 L437 527Z" fill="#222a31"/>
    ${screws}
    <rect x="128" y="84" width="40" height="451" rx="3" fill="url(#rig-steel)"/>
    <rect x="402" y="84" width="35" height="451" rx="3" fill="url(#rig-steel)"/>
    <path d="M135 108 V514 M430 108 V514" stroke="#fafcfc" opacity=".4"/>
    <path d="M158 112 V505 M407 112 V505" stroke="#6d777f"/>
    <path d="M122 80 L137 65 H439 L454 80Z" fill="#ffd173"/>
    <rect x="122" y="80" width="332" height="27" rx="2" fill="url(#rig-gold)"/>
    <path d="M125 83 H450" stroke="#fff0c3" opacity=".75"/>
    ${bolts(140,94)}${bolts(426,94)}${bolts(145,490)}${bolts(421,490)}
    <circle cx="147" cy="136" r="11" fill="#2e373f" stroke="#a6acaf"/><text x="147" y="140" text-anchor="middle" fill="#ffb629" font-size="9" font-family="Arial" font-weight="bold">LM</text>
    <g data-rig-crosshead>
      <path d="M158 219 L172 210 H405 L414 219Z" fill="#ffda85"/>
      <rect x="157" y="219" width="258" height="27" rx="2" fill="url(#rig-gold)"/>
      <path d="M158 222 H413" stroke="#ffe8ae"/>
      ${bolts(171,231)}${bolts(401,231)}
      <rect x="266" y="246" width="28" height="13" fill="url(#rig-chrome)"/>
      <rect x="254" y="258" width="52" height="17" rx="5" fill="url(#rig-steel)"/>
      <rect x="269" y="275" width="22" height="12" fill="url(#rig-chrome)"/>
      <g transform="translate(0 281)">${grip}</g>
    </g>
    <path data-rig-specimen fill="url(#rig-sample)" stroke="#ffe6b4" stroke-width=".7" d="${tensileState(0).upper}"/>
    <path data-rig-fragment fill="url(#rig-sample)" stroke="#ffe6b4" stroke-width=".7" d=""/>
    <g transform="translate(560 489) rotate(180)">${grip}</g>
    <rect x="269" y="489" width="22" height="14" fill="url(#rig-chrome)"/>
    <rect x="251" y="503" width="58" height="15" rx="3" fill="url(#rig-steel)"/>
    <path d="M114 529 L142 516 H435 L461 534 L444 561 H126Z" fill="url(#rig-steel)"/>
    <path d="M114 535 H460 V567 L440 581 H130 L114 568Z" fill="url(#rig-dark)" stroke="#69737a"/>
    <path d="M117 538 H457" stroke="#81898f"/>
    <text x="143" y="562" fill="#ffbd42" font-family="Arial" font-size="17" font-weight="bold" letter-spacing="3">LABOMAK</text>
    <rect x="136" y="580" width="31" height="11" rx="4" fill="#14191d" stroke="#5a6269"/><rect x="406" y="580" width="31" height="11" rx="4" fill="#14191d" stroke="#5a6269"/>
    <rect x="446" y="325" width="49" height="131" rx="5" fill="url(#rig-dark)" stroke="#79828a"/>
    <rect x="454" y="338" width="32" height="41" rx="2" fill="#0e161d" stroke="#53616b"/>
    <path d="M460 366 H480 M460 356 H475 M460 347 H469" stroke="#c3d3d9" stroke-width="2"/>
    <circle cx="470" cy="397" r="5" fill="#aebbbf" stroke="#e5eded"/><circle cx="470" cy="430" r="11" fill="#f5b326"/><circle cx="470" cy="430" r="7" fill="#ad4436"/>
    <path d="M302 383 H345 L361 373 H383" fill="none" stroke="#b3bdc4" stroke-width=".8"/><circle cx="302" cy="383" r="2.5" fill="#ffb629"/>
    <text x="345" y="362" fill="#bbc4ca" font-family="Arial" font-size="10" letter-spacing="1.4">${tr?'NUMUNE':'SPECIMEN'}</text>
    </g>
  </svg>`;
}
