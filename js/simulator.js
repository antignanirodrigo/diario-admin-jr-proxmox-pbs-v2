import { getLesson } from '../data/lessons.js';
import { commandGuide } from '../data/command-guide.js';

export function newLessonState(id) {
  if (!getLesson(id)) throw new Error(`Lezione sconosciuta: ${id}`);
  return { id: Number(id), seen: [], selected: '', labVerified: false, quiz: {}, decision: '', diary: '', terminalLog: [], completed: false };
}

export function availableCommands(lessonId, host) {
  const lesson = getLesson(lessonId);
  if (!lesson) return [];
  const entries = lesson.lab.commands.filter(item => item.host === host);
  return [...new Set(['help', '--help', ...entries.flatMap(item => [item.input, commandGuide[lessonId]?.find(guide => guide.input === item.input)?.help].filter(Boolean))])];
}

export function autocomplete(lessonId, host, input) {
  const prefix = input.trimStart();
  const matches = availableCommands(lessonId, host).filter(command => command.startsWith(prefix));
  return { line: matches.length === 1 ? matches[0] : input, matches };
}

export function runCommand(state, host, input) {
  const lesson = getLesson(state.id);
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
  if (!state.seen.includes(entry.key)) state.seen.push(entry.key);
  state.labVerified = false;
  state.terminalLog.push(`${host}$ ${command}\n${entry.output}`);
  return { ok: true, output: entry.output };
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
  return { missing, choiceCorrect: state.selected === lesson.lab.correct, complete: missing.length === 0 && state.selected === lesson.lab.correct };
}

export function validateLab(state) {
  const evidence = labEvidence(state);
  state.labVerified = evidence.complete;
  if (evidence.missing.length) return { ok: false, message: `Mancano evidenze dal terminale: ${evidence.missing.join(', ')}.` };
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
