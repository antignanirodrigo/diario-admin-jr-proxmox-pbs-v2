import { lessons, getLesson } from '../data/lessons.js';
import { getCommandGuide } from '../data/command-guide.js';
import { newLessonState, runCommand, autocomplete, selectArchitecture, validateLab, answerQuiz, makeDecision, canComplete, completeLesson } from './simulator.js';

const key = 'diario-pve-pbs-v2-progress-v1';
const main = document.querySelector('#lesson');
const nav = document.querySelector('#lesson-nav');
const sidebar = document.querySelector('#sidebar');
const toast = document.querySelector('#toast');
let activeId = 1;
let storageAvailable = true;
let progress = {};

try { progress = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { progress = {}; storageAvailable = false; }

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const state = id => (progress[id] ||= newLessonState(id));
const save = () => { try { localStorage.setItem(key, JSON.stringify(progress)); } catch { storageAvailable = false; } };
const countDone = () => lessons.filter(item => state(item.id).completed).length;
const totalXp = () => lessons.reduce((sum, item) => sum + (state(item.id).completed ? item.xp : 0), 0);

function renderCommandGuide(lesson, seen) {
  return `<div class="command-guide"><h3>Leggi il comando prima di eseguirlo</h3><p>Il nome avvia lo strumento; il sottocomando sceglie l’azione; opzioni come <code>-h</code> modificano il comportamento; un percorso indica il file da leggere. La guida non vale come evidenza del laboratorio.</p>
    ${lesson.lab.commands.map(command => {
      const guide = getCommandGuide(lesson.id, command.input);
      return `<article class="command-card"><div class="command-title"><code>${esc(command.host)}$ ${esc(command.input)}</code><span data-guide-status="${esc(command.key)}">${seen.has(command.key) ? 'Eseguito ✓' : 'Da eseguire'}</span></div><p><b>Perché:</b> ${esc(guide.purpose)}</p><dl>${guide.parts.map(([token, meaning]) => `<div><dt><code>${esc(token)}</code></dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl><p><b>Come leggere l’output:</b> ${esc(guide.read)}</p><p class="help-line"><b>Come chiedere aiuto:</b> <code>${esc(command.host)}$ ${esc(guide.help)}</code> <button type="button" class="soft" data-fill-host="${esc(command.host)}" data-fill-command="${esc(guide.help)}">Prova l’aiuto</button></p></article>`;
    }).join('')}</div>`;
}

function renderEvidence(lesson, state) {
  const seen = new Set(state.seen || []);
  return `<aside class="evidence-panel" aria-label="Obiettivi verificabili"><h3>Obiettivi verificabili</h3><p>${lesson.lab.commands.filter(item => seen.has(item.key)).length}/${lesson.lab.commands.length} comandi eseguiti</p><ul>${lesson.lab.commands.map(item => `<li class="${seen.has(item.key) ? 'done' : ''}"><span aria-label="${seen.has(item.key) ? 'Eseguito' : 'Da eseguire'}">${seen.has(item.key) ? '✓' : '○'}</span><button type="button" data-fill-host="${esc(item.host)}" data-fill-command="${esc(item.input)}" title="Inserisci nel terminale">${esc(item.host)}$ ${esc(item.input)}</button></li>`).join('')}</ul><p class="evidence-choice">${state.selected ? (state.labVerified ? '✓ Scelta tecnica convalidata' : '○ Scelta tecnica da convalidare') : '○ Scelta tecnica mancante'}</p><p class="evidence-note">Seleziona un comando per inserirlo. Premi TAB per completare ciò che digiti. <code>help</code> mostra i comandi disponibili; l’aiuto non spunta gli obiettivi.</p></aside>`;
}

function renderQuiz(question, index, state) {
  const feedback = state.quizFeedback?.[index] || (state.quiz?.[index] === true ? { selected: -1, correct: true, message: `Risposta corretta. ${question.why} Analogia del Senior: ${question.analogy}` } : null);
  return `<div class="question" data-question="${index}"><h3>${index + 1}. ${esc(question.question)}</h3><div class="options">${question.options.map((option, oi) => `<button type="button" data-quiz="${index}" data-option="${oi}" class="${feedback?.selected === oi ? (feedback.correct ? 'selected-correct' : 'selected-wrong') : ''}" ${feedback?.correct ? 'disabled' : ''}>${esc(option)}</button>`).join('')}</div>${feedback ? `<div class="quiz-feedback ${feedback.correct ? 'correct' : 'wrong'}" role="status"><strong>${feedback.correct ? 'Risposta corretta' : 'Risposta incorretta — riprova'}</strong><p>${esc(feedback.message)}</p></div>` : '<p class="status">Scegli un’alternativa e leggi il motivo.</p>'}</div>`;
}

function message(text, ok = true) {
  toast.textContent = text;
  toast.classList.toggle('bad', !ok);
  toast.hidden = false;
  clearTimeout(message.timer);
  message.timer = setTimeout(() => { toast.hidden = true; }, 6500);
}

function renderNav() {
  nav.innerHTML = lessons.map((item, index) => `${index % 4 === 0 ? `<div class="nav-module">MODULO ${String(Math.floor(index / 4) + 1).padStart(2, '0')}<small>${esc(item.module)}</small></div>` : ''}<button type="button" class="nav-item ${item.id === activeId ? 'active' : ''}" data-open="${item.id}" aria-current="${item.id === activeId ? 'page' : 'false'}"><span class="nav-number">${String(item.id).padStart(2, '0')}</span><span>${esc(item.title)}<small>${state(item.id).completed ? 'Completata ✓' : item.duration}</small></span></button>`).join('');
  document.querySelector('#count').textContent = `${countDone()}/${lessons.length}`;
  document.querySelector('#xp').textContent = `${totalXp()} XP`;
}

function renderLesson() {
  const l = getLesson(activeId);
  const s = state(activeId);
  const hosts = [...new Set(l.lab.commands.map(c => c.host))];
  const seen = new Set(s.seen || []);
  main.innerHTML = `
    <div class="eyebrow">MODULO ${String(Math.ceil(l.id / 4)).padStart(2, '0')} · LEZIONE ${String(l.id).padStart(2, '0')} · ${esc(l.duration)}</div>
    <h1>${esc(l.title)}</h1><p class="lead">${esc(l.summary)}</p>
    <div class="lesson-meta"><span>Laboratorio simulato</span><span>3 domande commentate</span><a href="#tavole">2 tavole ↓</a><span>+${l.xp} XP</span></div>
    <div class="section-jump"><a href="#incidente">Incidente</a><a href="#tavole">Tavole</a><a href="#concetti">Concetti</a><a href="#laboratorio">Laboratorio</a><a href="#domande">Domande</a><a href="#chiusura">Conclusione</a></div>
    <section id="incidente" class="card accent"><span class="section-number">01 · IL TICKET</span><h2>Il problema da risolvere</h2><p>${esc(l.ticket)}</p><p class="impact"><b>Impatto:</b> ${esc(l.impact)}</p></section>
    <section class="card"><span class="section-number">02 · LA STORIA DEL SENIOR</span><h2>Una lezione dal datacenter</h2><p>${esc(l.story)}</p></section>
    <section id="tavole" class="card art-section"><span class="section-number">LE DUE TAVOLE</span><h2>La storia in immagini</h2><div class="art-grid">${l.images.map((path, i) => `<button type="button" data-art="${esc(path)}" aria-label="Apri la tavola ${i + 1}"><img src="${esc(path)}" alt="Tavola ${i + 1} della lezione ${l.id}: ${esc(l.title)}" loading="lazy"><span>Tavola ${i + 1} · ${i === 0 ? 'Contesto e problema' : 'Azione e verifica'}</span></button>`).join('')}</div></section>
    <section id="concetti" class="card"><span class="section-number">03 · DECODIFICATORE</span><h2>Concetti senza scorciatoie</h2><div class="concept-grid">${l.concepts.map(([term, explanation]) => `<div class="concept"><strong>${esc(term)}</strong><p>${esc(explanation)}</p></div>`).join('')}</div><p class="analogy"><b>Analogia del Senior:</b> ${esc(l.analogy)}</p></section>
    <section class="card"><span class="section-number">04 · RICHIAMO ATTIVO</span><h2>Fermati e rispondi</h2><p>${esc(l.recall.question)}</p><button type="button" class="soft" data-recall>Mostra la risposta</button><p id="recall-answer" class="answer" hidden>${esc(l.recall.answer)}</p></section>
    <section id="laboratorio" class="card"><span class="section-number">05 · LABORATORIO GUIDATO</span><h2>Prendi in mano il ticket</h2><p class="context">🖥️ Dove operare: ${esc(l.lab.context)}</p><ol class="lab-steps">${l.lab.steps.map((step, i) => `<li><label><input type="checkbox" data-step="${i}" ${(s.stepsDone || []).includes(i) ? 'checked' : ''}> ${esc(step)}</label></li>`).join('')}</ol>
      ${renderCommandGuide(l, seen)}
      <div class="workbench"><div class="terminal"><div class="terminal-head">Console simulata · digita <code>help</code> o usa TAB</div><div id="terminal-output" class="terminal-output" aria-live="polite">${esc((s.terminalLog || []).join('\n\n') || 'La console è pronta. Leggi la guida qui sopra prima di eseguire i comandi.')}</div><form id="terminal-form"><select id="host" aria-label="Nodo">${hosts.map(h => `<option value="${esc(h)}">${esc(h)}</option>`).join('')}</select><span class="prompt">$</span><input id="command" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Comando" placeholder="Scrivi un comando; TAB completa" required><button type="submit">Esegui</button></form></div>${renderEvidence(l, s)}</div>
      <div class="lab-choice"><label for="lab-choice">${esc(l.lab.choiceLabel)}</label><select id="lab-choice"><option value="">Seleziona una risposta</option>${l.lab.choices.map(c => `<option value="${esc(c.id)}" ${s.selected === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}</select><button type="button" data-validate>Convalida il laboratorio</button></div>
      <p class="result-line ${s.labVerified ? 'success' : ''}">${s.labVerified ? esc(l.lab.success) : 'La convalida richiede tutti i comandi e una scelta coerente.'}</p>
    </section>
    <section id="domande" class="card"><span class="section-number">06 · DOMANDE COMMENTATE</span><h2>Verifica il ragionamento</h2>${l.quizzes.map((q, qi) => renderQuiz(q, qi, s)).join('')}</section>
    <section class="card"><span class="section-number">07 · DECISIONE TECNICA</span><h2>La tua risposta al responsabile</h2><p>${esc(l.decision.prompt)}</p><div class="options">${l.decision.options.map(o => `<button type="button" data-decision="${esc(o.id)}" class="${s.decision === o.id ? 'chosen' : ''}">${esc(o.label)}</button>`).join('')}</div></section>
    <section class="card"><span class="section-number">08 · PROCEDURA PROFESSIONALE</span><h2>Porta il metodo in produzione</h2><ol>${l.procedure.map(item => `<li>${esc(item)}</li>`).join('')}</ol></section>
    <section class="card"><span class="section-number">09 · EVIDENZE E DIARIO</span><h2>Che cosa hai dimostrato?</h2><p>${esc(l.validation)}</p><label for="diary"><b>Diario di bordo:</b> ${esc(l.diaryPrompt)}</label><textarea id="diary" rows="4" placeholder="Scrivi almeno 40 caratteri con la tua conclusione tecnica...">${esc(s.diary || '')}</textarea><small>Il diario resta salvato in questo browser.</small></section>
    <section id="chiusura" class="card finish"><span class="section-number">10 · CONCLUSIONE</span><h2>Chiudi la lezione</h2><p>${esc(l.closing)}</p><button type="button" data-complete ${canComplete(s) ? '' : 'disabled'}>${s.completed ? 'Lezione completata ✓' : `Concludi e ottieni ${l.xp} XP`}</button><p class="finish-note">Servono laboratorio convalidato, tre risposte corrette, decisione corretta e diario di almeno 40 caratteri.</p></section>
    <div class="next-row">${l.id > 1 ? `<button type="button" data-open="${l.id - 1}">← Lezione precedente</button>` : '<span></span>'}${l.id < lessons.length ? `<button type="button" data-open="${l.id + 1}">Prossima lezione →</button>` : '<span>Fine del modulo disponibile</span>'}</div>
  `;
  renderNav();
}

function openLesson(id) {
  if (!getLesson(id)) return;
  activeId = Number(id);
  sidebar.classList.remove('visible');
  renderLesson();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', `${location.pathname}?aula=${String(id).padStart(2, '0')}`);
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.open) return openLesson(button.dataset.open);
  if (button.dataset.fillCommand) { document.querySelector('#host').value = button.dataset.fillHost; document.querySelector('#command').value = button.dataset.fillCommand; document.querySelector('#command').focus(); return; }
  if (button.id === 'menu-toggle') return sidebar.classList.toggle('visible');
  if (button.dataset.recall !== undefined) { const answer = document.querySelector('#recall-answer'); answer.hidden = !answer.hidden; button.textContent = answer.hidden ? 'Mostra la risposta' : 'Nascondi la risposta'; return; }
  const s = state(activeId);
  if (button.dataset.validate !== undefined) { const result = validateLab(s); save(); renderLesson(); message(result.message, result.ok); return; }
  if (button.dataset.quiz !== undefined) {
    const index = Number(button.dataset.quiz);
    if (s.quiz?.[index] === true) return;
    answerQuiz(s, index, Number(button.dataset.option));
    save();
    document.querySelector(`[data-question="${index}"]`).outerHTML = renderQuiz(getLesson(activeId).quizzes[index], index, s);
    document.querySelector('[data-complete]').disabled = !canComplete(s);
    return;
  }
  if (button.dataset.decision !== undefined) { const result = makeDecision(s, button.dataset.decision); save(); renderLesson(); message(result.message, result.ok); return; }
  if (button.dataset.complete !== undefined) { const result = completeLesson(s); save(); renderLesson(); message(result.ok ? (result.awarded ? `Lezione completata: +${result.awarded} XP.` : 'Lezione già completata.') : 'Completa prima tutte le evidenze richieste.', result.ok); return; }
  if (button.dataset.art) { document.querySelector('#art-full').src = button.dataset.art; document.querySelector('#art-full').alt = button.getAttribute('aria-label'); document.querySelector('#art-dialog').showModal(); return; }
  if (button.id === 'art-close') document.querySelector('#art-dialog').close();
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'terminal-form') return;
  event.preventDefault();
  const s = state(activeId);
  const result = runCommand(s, document.querySelector('#host').value, document.querySelector('#command').value);
  save(); renderLesson(); message(result.ok ? (result.help ? 'Guida consultata: non conta come evidenza del laboratorio.' : 'Comando eseguito nella simulazione.') : result.output, result.ok);
});

document.addEventListener('keydown', event => {
  if (event.target.id !== 'command' || event.key !== 'Tab' || event.shiftKey || !event.target.value.trim()) return;
  event.preventDefault();
  const field = event.target;
  const result = autocomplete(activeId, document.querySelector('#host').value, field.value);
  field.value = result.line;
  if (result.matches.length > 1) {
    const output = document.querySelector('#terminal-output');
    output.textContent += `\n\nTAB → ${result.matches.join('   ')}`;
    output.scrollTop = output.scrollHeight;
  }
});

document.addEventListener('change', event => {
  const s = state(activeId);
  if (event.target.id === 'lab-choice') { selectArchitecture(s, event.target.value); save(); renderLesson(); }
  if (event.target.dataset.step !== undefined) { const i = Number(event.target.dataset.step); s.stepsDone ||= []; s.stepsDone = event.target.checked ? [...new Set([...s.stepsDone, i])] : s.stepsDone.filter(n => n !== i); save(); }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'diary') return;
  state(activeId).diary = event.target.value;
  save();
  const finishButton = document.querySelector('[data-complete]');
  if (finishButton) finishButton.disabled = !canComplete(state(activeId));
});

document.querySelector('#art-dialog').addEventListener('click', event => { if (event.target.id === 'art-dialog') event.target.close(); });
const initial = Number(new URLSearchParams(location.search).get('aula')) || 1;
openLesson(getLesson(initial) ? initial : 1);
if (!storageAvailable) message('Il browser non consente di salvare il progresso. La lezione resta utilizzabile in questa sessione.', false);
