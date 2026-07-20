import {escapeHTML} from './utils.js';
import {get,update} from './storage.js';
import {schedule} from './reviews.js';
import {scoreOrderedRecall} from './learning.js';

let start = 0;
let session;

function displayItem(item) {
  if (!item || item !== item.toLowerCase() || item.length > 28) return item;
  return item.charAt(0).toUpperCase() + item.slice(1);
}

function previousPractice(curriculum) {
  const state = get();
  const last = state.results.at(-1);
  if (last?.day) {
    const previous = curriculum.find(day => day.day === last.day);
    if (previous) return previous;
  }
  return curriculum[Math.max(0, Math.min(state.profile.currentDay - 2, curriculum.length - 1))];
}

function warmupCopy(curriculum) {
  const previous = previousPractice(curriculum);
  if (!get().results.length) {
    return {
      title: '1. Retrieval warm-up · 3 min',
      text: 'No previous scored task yet. Walk through a familiar route and check whether each location is clear, vague, or missing.',
      quote: 'Retrieval is the exercise. Start by trying from memory, then repair only the weak points.'
    };
  }
  return {
    title: `1. Retrieval warm-up · ${escapeHTML(previous.title)}`,
    text: `Before today’s lesson, recall the previous task from memory: ${escapeHTML(previous.title)}. Keep the source closed until after you have tried.`,
    quote: 'First try to bring back the images yourself. Then check the source and strengthen only what felt vague or missing.'
  };
}

function materialList(items) {
  return items.map(x => `<li>${escapeHTML(displayItem(x))}</li>`).join('');
}

export function trainingView(curriculum) {
  session = curriculum[Math.min(get().profile.currentDay - 1, curriculum.length - 1)];
  const warmup = warmupCopy(curriculum);
  return `<p class="eyebrow">Week ${session.week} · ${session.belt} belt · phase ${session.phase}</p>
  <h1>${escapeHTML(session.title)}</h1>
  <p class="lead">Encode and retrieve ${session.material.length} items with deliberate, vivid associations.</p>
  <section class="card training-card" id="warm"><h2>${warmup.title}</h2><p>${warmup.text}</p><blockquote>${warmup.quote}</blockquote><div class="actions segmented" role="group" aria-label="Warm-up recall quality"><button data-warm="clear" aria-pressed="false">Clear</button><button data-warm="vague" class="secondary" aria-pressed="false">Vague</button><button data-warm="missing" class="secondary" aria-pressed="false">Missing</button></div><p id="warmStatus" class="muted" aria-live="polite">Choose the closest match, then repair only weak items.</p></section>
  <section class="card training-card"><h2>2. Technique drill</h2><p>Use <strong>${escapeHTML(session.technique)}</strong>. Make each image move, exaggerate and interact directly with its location.</p></section>
  <section class="card training-card"><h2>3. Main challenge · ${session.timeLimitMinutes} min</h2><div id="source" class="material"><ol>${materialList(session.material)}</ol></div><div class="actions"><button id="startRecall">I’m ready — hide material</button></div></section>
  <section class="card training-card" id="recallStep"><h2>4. Recall test</h2><p id="recallPrompt" class="muted">This opens as soon as you hide the material in step 3.</p><form id="recall" class="hidden"><p><strong>Source hidden.</strong> Enter one answer per line, in order.</p><label for="answers">Your recalled answers</label><textarea id="answers" required autocomplete="off"></textarea><button>Score recall</button></form></section>
  <section class="card training-card" id="errorReview"><h2>5. Error review</h2><p class="muted">After you score recall, choose the one repair that will make the next review easier.</p><div id="score"></div></section>
  <section class="card training-card"><h2>6. Real-life mission</h2><p>${escapeHTML(session.mission)}</p></section>
  <section class="card training-card"><h2>7. Reflection</h2><p>${escapeHTML(session.reflection)}</p></section>`;
}

export function bindTraining() {
  document.querySelectorAll('[data-warm]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-warm]').forEach(b => {
      const active = b === button;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('secondary', !active);
    });
    const status = document.querySelector('#warmStatus');
    if (status) status.textContent = button.dataset.warm === 'clear' ? 'Good. Keep the route and begin today’s drill.' : 'Good spot. Spend one minute making the weak image larger, louder, stranger or more active.';
  }));
  document.querySelector('#startRecall')?.addEventListener('click', () => {
    document.querySelector('#source').classList.add('hidden');
    document.querySelector('#startRecall').classList.add('hidden');
    document.querySelector('#recall').classList.remove('hidden');
    const prompt = document.querySelector('#recallPrompt');
    if (prompt) prompt.textContent = 'Source hidden. Write what you can remember before checking anything.';
    start = Date.now();
    document.querySelector('#answers').focus();
  });
  document.querySelector('#recall')?.addEventListener('submit', e => {
    e.preventDefault();
    const score = scoreOrderedRecall(session.material, document.querySelector('#answers').value);
    const result = { day: session.day, date: Date.now(), belt: session.belt, type: session.materialType, technique: session.technique, ...score, encodingSeconds: 0, recallSeconds: Math.round((Date.now() - start) / 1000) };
    const { correct, incorrect, omitted, orderErrors: order, accuracy } = result;
    update(s => {
      s.results.push(result);
      s.profile.currentDay = Math.min(84, s.profile.currentDay + 1);
      s.missions.push({ day: session.day, completed: false, text: session.mission });
    });
    schedule(session, result);
    document.querySelector('#score').innerHTML = `<section class="nested-result"><h3>Recall result · ${accuracy}% accuracy</h3><p>${correct} correct · ${incorrect} incorrect · ${omitted} omitted · ${order} order errors</p><p>Recall time: ${result.recallSeconds}s. Your next review is ready in about 20 minutes.</p><label for="error">What should you strengthen next?</label><select id="error"><option>Weak or ordinary image</option><option>Missed the detail at the start</option><option>Images did not interact</option><option>Location was unclear</option><option>Too many images at one location</option><option>Similar images got confused</option><option>Review came too late</option><option>Recall was slow</option></select></section>`;
    document.querySelector('#recall').classList.add('hidden');
  });
}
