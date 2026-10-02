import test from 'node:test';
import assert from 'node:assert/strict';
import { module06Draft } from '../data/lessons-module-06.js';
import { commandGuideModule06Draft } from '../data/command-guide-module-06.js';
import { lessons } from '../data/lessons.js';

test('Le lezioni 22–24 restano in bozza finché mancano le tavole approvate', () => {
  assert.equal(lessons.some(active => active.id === 21), true);
  assert.equal(module06Draft[0].images.length, 2);
  for (const lesson of module06Draft.filter(item => item.id >= 22)) {
    assert.equal(lessons.some(active => active.id === lesson.id), false);
    assert.deepEqual(lesson.images, []);
  }
});

test('Lezione 21: comandi, prerequisiti, aiuto e contenuti sono coerenti', () => {
  const lesson = module06Draft.find(item => item.id === 21);
  assert.ok(lesson);
  const commands = lesson.lab.commands;
  const guides = commandGuideModule06Draft[21];
  assert.equal(commands.length, 5);
  assert.equal(guides.length, commands.length);
  const seen = new Set();
  for (const cmd of commands) {
    for (const required of cmd.requires || []) assert.ok(seen.has(required), `${cmd.key}: ${required}`);
    const guide = guides.find(item => item.input === cmd.input);
    assert.ok(guide?.purpose && guide.read && guide.help && guide.helpOutput);
    assert.ok(guide.parts.every(([token, meaning]) => token && meaning.length > 6));
    seen.add(cmd.key);
  }
  assert.match(commands[0].output, /content iso,vztmpl,backup/);
  assert.match(commands[0].output, /content images,rootdir/);
  assert.match(commands[2].output, /local:iso\//);
  assert.match(commands[3].output, /vm-100-disk-0/);
  assert.match(commands[4].output, /vm-301-disk-0/);
  assert.equal(lesson.lab.correct, 'mapped');
  assert.match(lesson.validation, /Non sono avvenuti upload/);
});

test('Le bozze 21–24 hanno laboratorio completo, aiuto e prerequisiti ordinati', () => {
  assert.deepEqual(module06Draft.map(item => item.id), [21, 22, 23, 24]);
  for (const lesson of module06Draft) {
    assert.equal(lesson.concepts.length, 4);
    assert.equal(lesson.quizzes.length, 3);
    assert.ok(lesson.ticket.length > 100 && lesson.validation.length > 100);
    const commands = lesson.lab.commands;
    const guides = commandGuideModule06Draft[lesson.id];
    assert.equal(commands.length, guides.length);
    const seen = new Set();
    for (const cmd of commands) {
      assert.ok(cmd.host && cmd.input && cmd.key && typeof cmd.output === 'string');
      for (const required of cmd.requires || []) assert.ok(seen.has(required), `${lesson.id}: ${cmd.key} requires ${required}`);
      const guide = guides.find(item => item.input === cmd.input);
      assert.ok(guide?.purpose && guide.read && guide.help && guide.helpOutput && guide.parts.length, `${lesson.id}: ${cmd.input}`);
      seen.add(cmd.key);
    }
    assert.ok(lesson.lab.choices.some(item => item.id === lesson.lab.correct));
  }
});

test('Lezione 23: scrub non sana il pool; replace richiede gate e resilver precede ONLINE', () => {
  const lesson = module06Draft.find(item => item.id === 23);
  const cmd = Object.fromEntries(lesson.lab.commands.map(item => [item.key, item]));
  assert.match(cmd.initial.output, /state: DEGRADED/);
  assert.match(cmd.scrubStatus.output, /state: DEGRADED/);
  assert.match(cmd.scrubStatus.output, /ata-LAB-03 DEGRADED/);
  assert.ok(cmd.replace.requires.includes('gate'));
  assert.deepEqual(cmd.replace.setRuntime, { poolPhase: 'replacing' });
  assert.match(cmd.rebuilding.output, /replacing-2/);
  assert.match(cmd.rebuilding.output, /state: DEGRADED/);
  assert.ok(cmd.final.requires.includes('advance'));
  assert.match(cmd.final.output, /state: ONLINE/);
  assert.match(cmd.final.output, /ata-LAB-05/);
  assert.doesNotMatch(cmd.final.output, /ata-LAB-03/);
  assert.deepEqual(lesson.lab.expectedRuntime, { poolPhase: 'online' });
});

test('Lezione 24: capacità e scansioni negative non sono una migrazione', () => {
  const lesson = module06Draft.find(item => item.id === 24);
  const cmd = Object.fromEntries(lesson.lab.commands.map(item => [item.key, item]));
  assert.match(cmd.status.output, /10485760/);
  assert.match(cmd.thin.output, /95\.00  88\.00/);
  assert.match(cmd.nfs.output, /No exports found/);
  assert.match(cmd.iscsi.output, /No targets found/);
  assert.match(cmd.vm.output, /local-lvm:vm-100-disk-0/);
  assert.equal(lesson.lab.correct, 'hold');
  assert.match(lesson.validation, /Nessuna migrazione/);
});
