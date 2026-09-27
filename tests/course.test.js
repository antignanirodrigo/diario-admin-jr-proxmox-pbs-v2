import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { lessons } from '../data/lessons.js';
import { getCommandGuide } from '../data/command-guide.js';
import { newLessonState, runCommand, autocomplete, selectArchitecture, validateLab, answerQuiz, makeDecision, canComplete, completeLesson } from '../js/simulator.js';

test('I primi tre moduli contengono dodici lezioni italiane con due tavole e tre domande ciascuna', () => {
  assert.deepEqual(lessons.map(item => item.id), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  for (const lesson of lessons) {
    assert.equal(lesson.images.length, 2);
    for (const path of lesson.images) assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `${lesson.id}: prancha ${path}`);
    assert.equal(lesson.quizzes.length, 3);
    assert.equal(lesson.lab.commands.length >= 3, true);
    assert.equal(lesson.concepts.length, 4);
    for (const field of ['ticket', 'story', 'summary', 'validation', 'closing']) assert.ok(lesson[field].length > 90, `${lesson.id}: ${field}`);
    assert.equal(lesson.quizzes.every(q => q.options.length === 3 && q.why.length > 30), true);
  }
});

test('Le tavole del nuovo modulo hanno formato coerente e file distinti', () => {
  const hashes = new Set();
  for (const lesson of lessons.filter(item => item.id >= 9 && item.id <= 12)) {
    for (const path of lesson.images) {
      const png = readFileSync(new URL(`../${path}`, import.meta.url));
      assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${path}: PNG valido`);
      assert.equal(png.readUInt32BE(16), 1536, `${path}: larghezza`);
      assert.equal(png.readUInt32BE(20), 1024, `${path}: altezza`);
      const hash = createHash('sha256').update(png).digest('hex');
      assert.equal(hashes.has(hash), false, `${path}: immagine duplicata`);
      hashes.add(hash);
    }
  }
});

for (const lesson of lessons) {
  test(`Lezione ${lesson.id}: laboratorio e conclusione richiedono evidenze reali nella simulazione`, () => {
    const s = newLessonState(lesson.id);
    assert.equal(canComplete(s), false);
    assert.equal(completeLesson(s).ok, false);
    assert.equal(validateLab(s).ok, false);

    const first = lesson.lab.commands[0];
    assert.equal(runCommand(s, 'host-errato', first.input).ok, false);
    assert.equal(s.seen.length, 0);
    for (const cmd of lesson.lab.commands) assert.equal(runCommand(s, cmd.host, cmd.input).ok, true);
    assert.equal(validateLab(s).ok, false, 'La sola sequenza di comandi non basta');

    const wrongChoice = lesson.lab.choices.find(item => item.id !== lesson.lab.correct);
    selectArchitecture(s, wrongChoice.id);
    assert.equal(validateLab(s).ok, false);
    selectArchitecture(s, lesson.lab.correct);
    assert.equal(validateLab(s).ok, true);

    for (let i = 0; i < lesson.quizzes.length; i++) {
      const q = lesson.quizzes[i];
      assert.equal(answerQuiz(s, i, (q.correct + 1) % 3).ok, false);
      assert.equal(answerQuiz(s, i, q.correct).ok, true);
    }
    assert.equal(makeDecision(s, lesson.decision.options.find(o => !o.correct).id).ok, false);
    assert.equal(canComplete(s), false);
    assert.equal(makeDecision(s, lesson.decision.options.find(o => o.correct).id).ok, true);
    s.diary = 'Evidenze osservate e decisione motivata nel laboratorio simulato.';
    assert.equal(canComplete(s), true);
    assert.equal(completeLesson(s).awarded, lesson.xp);
    assert.equal(completeLesson(s).awarded, 0, 'XP assegnati una sola volta');
  });
}

test('Cambiare una scelta dopo la convalida invalida il laboratorio', () => {
  const l = lessons[3];
  const s = newLessonState(4);
  for (const cmd of l.lab.commands) runCommand(s, cmd.host, cmd.input);
  selectArchitecture(s, l.lab.correct);
  assert.equal(validateLab(s).ok, true);
  selectArchitecture(s, l.lab.choices.find(c => c.id !== l.lab.correct).id);
  assert.equal(s.labVerified, false);
});

test('Ogni comando spiega sintassi, output e aiuto; consultare aiuto non crea evidenza', () => {
  for (const lesson of lessons) {
    const s = newLessonState(lesson.id);
    for (const cmd of lesson.lab.commands) {
      const guide = getCommandGuide(lesson.id, cmd.input);
      assert.ok(guide?.purpose && guide?.read && guide?.help && guide.parts.length, `${lesson.id}: ${cmd.input}`);
      assert.ok(guide.parts.every(([token, meaning]) => token && meaning.length >= 7));
      const result = runCommand(s, cmd.host, guide.help);
      assert.equal(result.ok, true);
      assert.equal(result.help, true);
      assert.equal(s.seen.length, 0, 'L’aiuto non è un comando di verifica');
    }
    assert.equal(validateLab(s).ok, false);
  }
  const invented = getCommandGuide(4, 'simula-ripristino');
  assert.match(invented.parts[0][1], /NON esiste/);
  assert.match(invented.helpOutput, /SOLO SIMULATORE/);
});

test('TAB completa solo comandi del nodo; help e --help non spuntano obiettivi', () => {
  const s = newLessonState(1);
  assert.equal(autocomplete(1, 'pve01', 'pvev').line, 'pveversion -v');
  assert.equal(autocomplete(1, 'pve01', 'proxmox-').matches.length, 0);
  assert.equal(autocomplete(1, 'pbs01', 'proxmox-backup-manager v').line, 'proxmox-backup-manager versions');
  assert.equal(runCommand(s, 'pve01', 'help').help, true);
  assert.equal(runCommand(s, 'pve01', '--help').help, true);
  assert.equal(s.seen.length, 0);
  assert.equal(runCommand(s, 'pve01', 'pveversion -v').ok, true);
  assert.deepEqual(s.seen, ['pveVersion']);
});

test('Il feedback del quiz resta nello stato per mostrare errore e correzione sotto la domanda', () => {
  const s = newLessonState(1);
  const wrong = answerQuiz(s, 0, 0);
  assert.equal(wrong.ok, false);
  assert.equal(s.quizFeedback[0].selected, 0);
  assert.match(s.quizFeedback[0].message, /Risposta errata/);
  const right = answerQuiz(s, 0, 1);
  assert.equal(right.ok, true);
  assert.equal(s.quizFeedback[0].correct, true);
  assert.equal(JSON.parse(JSON.stringify(s)).quizFeedback[0].selected, 1);
});
