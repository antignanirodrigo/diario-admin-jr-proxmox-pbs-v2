import { getLesson } from '../data/lessons.js';
import { commandGuide } from '../data/command-guide.js';

export function newLessonState(id) {
  const lesson = getLesson(id);
  if (!lesson) throw new Error(`Lezione sconosciuta: ${id}`);
  return { id: Number(id), seen: [], runtime: { ...(lesson.lab.initialRuntime || {}) }, selected: '', labVerified: false, quiz: {}, decision: '', diary: '', terminalLog: [], completed: false };
}

export function availableCommands(lessonId, host) {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  const entries = lesson.lab.commands.filter(item => item.host === host);
  return [...new Set(['help', '--help', ...entries.flatMap(item => [item.input, commandGuide[lessonId]?.find(guide => guide.input === item.input)?.help].filter(Boolean))])];
}

export function autocomplete(lessonId, host, input) {
  const line = String(input || '');
  if (!line.trim()) return { line, matches: [] };
  const trailingSpace = /\s$/.test(line);
  const typedTokens = line.trim().split(/\s+/);
  const completedTokens = trailingSpace ? typedTokens : typedTokens.slice(0, -1);
  const currentPrefix = trailingSpace ? '' : (typedTokens[typedTokens.length - 1] || '');
  const before = trailingSpace ? line : line.slice(0, line.length - currentPrefix.length);

  const list = availableCommands(lessonId, host);
  const nextTokenSet = new Set();
  const hasMore = {};

  for (const cmd of list) {
    const cmdTokens = cmd.trim().split(/\s+/);
    if (cmdTokens.length <= completedTokens.length) continue;
    if (!completedTokens.every((t, i) => cmdTokens[i] === t)) continue;
    const candidate = cmdTokens[completedTokens.length];
    if (candidate.startsWith(currentPrefix)) {
      nextTokenSet.add(candidate);
      if (cmdTokens.length > completedTokens.length + 1) hasMore[candidate] = true;
    }
  }

  const matches = [...nextTokenSet].sort();
  if (matches.length === 1) {
    const token = matches[0];
    return { line: before + token + (hasMore[token] ? ' ' : ''), matches };
  }
  if (matches.length > 1) {
    const common = matches.reduce((acc, item) => {
      let i = 0;
      while (i < acc.length && i < item.length && acc[i] === item[i]) i++;
      return acc.slice(0, i);
    });
    return { line: common.length > currentPrefix.length ? before + common : line, matches };
  }
  return { line, matches: [] };
}

export function runCommand(state, host, input) {
  const lesson = getLesson(state.id);
  state.runtime ||= { ...(lesson.lab.initialRuntime || {}) };
  const command = input.trim().replace(/\s+/g, ' ');
  if (command === 'help' || command === '--help') {
    const output = `Guida del simulatore per ${host}:\n${lesson.lab.commands.filter(item => item.host === host).map(item => {
      const guide = commandGuide[state.id]?.find(entry => entry.input === item.input);
      return `${item.input}  —  ${guide?.purpose || ''}\n  Aiuto reale: ${guide?.help || 'consulta il manuale'}`;
    }).join('\n')}\nTAB completa i comandi disponibili. L’aiuto non vale come evidenza.`;
    state.terminalLog.push(`${host}$ ${command}\n${output}`);
    return { ok: true, output, help: true };
  }
  const help = commandGuide[state.id]?.find(item =>
    lesson.lab.commands.some(entry => entry.host === host && entry.input === item.input) && item.help === command);
  if (help) {
    const output = `Guida simulata per: ${help.input}\n${help.helpOutput}\nConsulta l’aiuto reale sul sistema prima di usare altre opzioni.`;
    state.terminalLog.push(`${host}$ ${command}\n${output}`);
    return { ok: true, output, help: true };
  }
  const entry = lesson.lab.commands.find(item => item.host === host && item.input === command);
  if (!entry) {
    const result = { ok: false, output: 'Comando non disponibile su questo nodo simulato. Controlla host e sintassi nella guida del laboratorio.' };
    state.terminalLog.push(`${host}$ ${command}\n${result.output}`);
    return result;
  }
  const unmet = (entry.requires || []).filter(key => !state.seen.includes(key));
  if (unmet.length) {
    const prerequisites = lesson.lab.commands.filter(item => unmet.includes(item.key)).map(item => item.input);
    const result = { ok: false, output: `Prima esegui: ${prerequisites.join(', ')}.` };
    state.terminalLog.push(`${host}$ ${command}\n${result.output}`);
    return result;
  }
  const unmetRuntime = Object.entries(entry.requiresRuntime || {}).filter(([key, value]) => state.runtime[key] !== value);
  if (unmetRuntime.length) {
    const result = { ok: false, output: 'Lo stato corrente del laboratorio non consente questo comando. Verifica lo stato del sistema simulato prima di procedere.' };
    state.terminalLog.push(`${host}$ ${command}\n${result.output}`);
    return result;
  }
  const runtimeOutput = entry.runtimeOutputKey && entry.outputsByRuntime?.[state.runtime[entry.runtimeOutputKey]];
  const stoppedOutput = entry.outputWhenVmStopped && state.runtime.vm212 === 'stopped' ? entry.outputWhenVmStopped : null;
  const output = runtimeOutput ?? stoppedOutput ?? (entry.afterKey && state.seen.includes(entry.afterKey) ? entry.outputAfter : entry.output);
  if (entry.setRuntime) Object.assign(state.runtime, entry.setRuntime);
  if (!state.seen.includes(entry.key)) state.seen.push(entry.key);
  state.labVerified = false;
  state.terminalLog.push(`${host}$ ${command}\n${output}`);
  return { ok: true, output };
}

export function selectArchitecture(state, choice) {
  const lesson = getLesson(state.id);
  if (!lesson.lab.choices.some(item => item.id === choice)) return false;
  state.selected = choice;
  state.labVerified = false;
  return true;
}

export function labEvidence(state) {
  const lesson = getLesson(state.id);
  const missing = lesson.lab.commands.filter(item => !state.seen.includes(item.key)).map(item => item.input);
  const runtime = state.runtime || lesson.lab.initialRuntime || {};
  const runtimeCorrect = Object.entries(lesson.lab.expectedRuntime || {}).every(([key, value]) => runtime[key] === value);
  return { missing, choiceCorrect: state.selected === lesson.lab.correct, runtimeCorrect, complete: missing.length === 0 && state.selected === lesson.lab.correct && runtimeCorrect };
}

export function validateLab(state) {
  const evidence = labEvidence(state);
  state.labVerified = evidence.complete;
  if (evidence.missing.length) return { ok: false, message: `Mancano evidenze dal terminale: ${evidence.missing.join(', ')}.` };
  if (!evidence.runtimeCorrect) return { ok: false, message: 'Lo stato finale del laboratorio non è ancora quello richiesto. Verifica il sistema simulato e ripeti la sequenza necessaria.' };
  if (!evidence.choiceCorrect) return { ok: false, message: 'La scelta tecnica non risolve il ticket. Rileggi le misure e riprova.' };
  return { ok: true, message: getLesson(state.id).lab.success };
}

export function answerQuiz(state, questionIndex, optionIndex) {
  const question = getLesson(state.id)?.quizzes[questionIndex];
  if (!question || !Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) return { ok: false, message: 'Risposta non valida.' };
  const correct = question.correct === optionIndex;
  state.quiz[questionIndex] = correct;
  const message = `${correct ? 'Risposta corretta.' : 'Risposta errata.'} ${question.why} Analogia del Senior: ${question.analogy}`;
  state.quizFeedback ||= {};
  state.quizFeedback[questionIndex] = { selected: optionIndex, correct, message };
  return { ok: correct, message };
}

export function makeDecision(state, optionId) {
  const option = getLesson(state.id)?.decision.options.find(item => item.id === optionId);
  if (!option) return { ok: false, message: 'Decisione non valida.' };
  state.decision = option.correct ? optionId : '';
  return { ok: option.correct, message: option.why };
}

export function canComplete(state) {
  const lesson = getLesson(state.id);
  return !!lesson && state.labVerified && lesson.quizzes.every((_, i) => state.quiz[i] === true) &&
    lesson.decision.options.some(item => item.id === state.decision && item.correct) && state.diary.trim().length >= 40;
}

export function completeLesson(state) {
  if (!canComplete(state)) return { ok: false, awarded: 0 };
  if (state.completed) return { ok: true, awarded: 0 };
  state.completed = true;
  return { ok: true, awarded: getLesson(state.id).xp };
}
