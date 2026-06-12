// Render loop. Two optimizations over the original drawScene:
//  1. The sky gradient is built once per time-of-day band and cached, instead of
//     calling createLinearGradient() on every one of ~60 frames/sec.
//  2. The active backdrop is resolved from a tag registry when the scene changes,
//     not by walking an if/else tag chain every frame.

import { getState } from '../state/gameState.js';
import * as bd from './backdrops.js';

let ctx, width, height;
let activeBackdrop = null;     // resolved on scene change
let gradientCache = null;      // { band, grad, groundColor }
let rafId = null;

// Time-of-day palette bands.
function bandFor(hour) {
  if (hour >= 6 && hour < 18) return { band: 'day', top: '#38bdf8', bottom: '#0284c7', ground: '#14532d' };
  if (hour >= 18 && hour < 20) return { band: 'sunset', top: '#7c3aed', bottom: '#f97316', ground: '#1e1b4b' };
  return { band: 'night', top: '#09090b', bottom: '#090714', ground: '#020205' };
}

// Backdrop registry: first tag match wins. Resolved once per scene.
const BACKDROPS = [
  { tags: ['transit', 'skyline', 'city'], draw: (frame, ground) => { bd.drawCityBackdrop(frame); bd.drawHighway(ground); bd.drawGreyhoundBus(); } },
  { tags: ['hacker_house'], draw: (frame) => bd.drawHackerHouse(frame) },
  { tags: ['crypto_mixer', 'mixer', 'social'], draw: (frame) => bd.drawVaporwaveMixer(frame) },
  { tags: ['palo_alto_caltrain', 'park', 'campus', 'park_campus', 'dolores_park'], draw: (frame, ground) => bd.drawParkCampus(ground, frame) },
  { tags: ['office_interview', 'office', 'interview'], draw: (frame) => bd.drawOfficeBoardroom(frame) },
  { tags: ['cafe'], draw: (frame) => bd.drawCoffeeCafe(frame) },
  { tags: ['hinge', 'hinge_phone', 'phone'], draw: (frame) => bd.drawHingePhone(frame) },
  { tags: ['estate', 'mansion'], draw: (frame) => bd.drawEstate(frame) },
  { tags: ['yacht'], draw: (frame) => bd.drawYacht(frame) },
  { tags: ['ipo', 'nasdaq'], draw: (frame) => bd.drawIpo(frame) },
  { tags: ['hospital'], draw: (frame) => bd.drawHospital(frame) },
  { tags: ['library'], draw: (frame) => bd.drawLibrary(frame) },
  { tags: ['trail'], draw: (frame) => bd.drawTrail(frame) },
];

const DEFAULT_BACKDROP = { draw: (frame) => bd.drawDefaultVectorGrid(frame) };

function resolveBackdrop(tags) {
  return BACKDROPS.find((b) => b.tags.some((t) => tags.includes(t))) || DEFAULT_BACKDROP;
}

export function initRenderer(canvas) {
  width = 320;
  height = 180;
  canvas.width = width;
  canvas.height = height;
  ctx = canvas.getContext('2d');
  bd.initRenderState(ctx, width, height);
  onSceneChanged();
}

// Call when the current scene changes so the backdrop/cache recompute.
export function onSceneChanged() {
  const tags = getState().currentScene.tags || ['transit'];
  activeBackdrop = resolveBackdrop(tags);
  gradientCache = null; // force rebuild (band may differ too)
}

function skyGradient(palette) {
  if (gradientCache && gradientCache.band === palette.band) return gradientCache;
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, palette.top);
  grad.addColorStop(0.7, palette.bottom);
  gradientCache = { band: palette.band, grad, ground: palette.ground };
  return gradientCache;
}

function drawFrame() {
  const { clock } = getState();
  const hour = clock.getHours();
  const palette = bandFor(hour);
  const cache = skyGradient(palette);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = cache.grad;
  ctx.fillRect(0, 0, width, height);

  // Twinkling stars at night/twilight.
  if (hour < 6 || hour >= 18) {
    const frame = bd.getFrame();
    bd.getStars().forEach((star, i) => {
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 23) * 0.05));
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fillRect(star.x, star.y, 1, 1);
    });
  }

  activeBackdrop.draw(bd.getFrame(), cache.ground);

  // Subtle scanline flicker.
  if (bd.getFrame() % 4 === 0) {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, width, height);
  }

  bd.tickFrame();
}

export function startLoop() {
  function loop() {
    drawFrame();
    rafId = requestAnimationFrame(loop);
  }
  rafId = requestAnimationFrame(loop);
}

export function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}
