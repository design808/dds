import {icon, icons, esc, toast} from './prototype-shared.js?v=f324b3980d4a15e8';

const $ = selector => document.querySelector(selector);
let setup = {};
try { setup = JSON.parse(sessionStorage.getItem('dds-interview-setup') || '{}') || {}; } catch {}
const english = setup.language === 'en';
const avatarMode = setup.interviewType === 'avatar';
const selectedTopics = Array.isArray(setup.topics) && setup.topics.length
  ? [...new Set(setup.topics.filter(topic => typeof topic === 'string' && topic.trim()).map(topic => topic.trim()))].slice(0, 6)
  : ['지원동기', '직무역량', '협업경험'];
if (!selectedTopics.length) selectedTopics.push('지원동기');

// The service generates a main question and two follow-ups for each selected topic.
// This standalone screen uses fixed practice questions and makes no generation calls.
const questionSets = {
  '지원동기': ['지원한 직무를 선택한 이유와 이를 위해 준비한 경험을 말씀해 주세요.', '그 경험에서 본인이 직접 맡은 역할은 무엇이었나요?', '해당 경험을 지원한 직무에서 어떻게 활용할 수 있을까요?'],
  '직무역량': ['지원한 직무에서 가장 중요하다고 생각하는 역량과 관련 경험을 말씀해 주세요.', '그 과정에서 어려웠던 점과 해결한 방법을 말씀해 주세요.', '같은 일을 다시 하게 된다면 어떤 점을 개선하고 싶으신가요?'],
  '협업경험': ['다른 사람들과 협력해 목표를 달성한 경험을 말씀해 주세요.', '팀 안에서 의견이 달랐을 때 어떻게 조율하셨나요?', '그 경험을 통해 협업에 대해 배운 점은 무엇인가요?'],
  '성장과정': ['현재의 본인에게 가장 큰 영향을 준 경험을 말씀해 주세요.', '그 경험 이후 행동이나 생각이 어떻게 바뀌었나요?', '앞으로 더 발전시키고 싶은 부분은 무엇인가요?'],
  '성격의 장단점': ['본인의 강점과 이를 발휘한 경험을 말씀해 주세요.', '그 강점이 실제 결과에 어떤 영향을 주었나요?', '보완하고 싶은 점과 이를 위해 노력한 내용을 말씀해 주세요.'],
};
const englishMainQuestions = {
  '지원동기':'Why did you choose this role, and how have you prepared for it?',
  '직무역량':'What is the most important skill for this role? Please share a relevant experience.',
  '협업경험':'Tell us about a time you worked with others to achieve a shared goal.',
  '성장과정':'Tell us about an experience that has had a significant influence on you.',
  '성격의 장단점':'What is your greatest strength? Please share an example of how you have used it.',
};
const questions = selectedTopics.flatMap((topic, topicIndex) => {
  const lines = english
    ? [englishMainQuestions[topic] || 'Tell us about an experience that demonstrates your suitability for this role.', 'What was your specific role, and how did you approach the challenge?', 'What did you learn, and how would you apply it to this position?']
    : questionSets[topic] || [`${topic}와 관련하여 본인의 경험을 구체적으로 말씀해 주세요.`, '그 경험에서 본인이 직접 맡은 역할과 해결한 문제를 말씀해 주세요.', '그 경험을 통해 배운 점과 앞으로 활용할 방법을 말씀해 주세요.'];
  return lines.map((text, followup) => ({topic, topicIndex, followup, text}));
});

let questionIndex = 0;
let phase = 'question';
let remaining = 90;
let elapsed = 0;
let retried = false;
let phaseTimer;
let countdownTimer;
let stream;
let connecting = false;
let completed = false;
let dialogOrigin;
let dialogAction;
const answers = [];
const dialog = $('#session-dialog');

const announce = text => { $('#session-announcement').textContent = text; };
const deviceStatus = text => {
  const status = $('#device-status');
  if (!status) return;
  status.textContent = text;
  status.closest('.session-stage-bottom').hidden = !text && $('#interviewContents').hidden;
};
const question = () => questions[questionIndex];
const clock = seconds => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

function showDialog(title, body, actions = [{label:'확인', primary:true}]) {
  dialogOrigin = document.activeElement;
  $('#dialog-title').textContent = title;
  $('#dialog-body').innerHTML = body;
  $('#dialog-actions').innerHTML = actions.map((action, index) => `<button type="button" class="btn${action.primary ? ' u-btn-primary' : ''}" data-dialog-action="${index}">${esc(action.label)}</button>`).join('');
  dialogAction = actions;
  dialog.showModal();
  icons(dialog);
}

function updateCamera() {
  const avatarVisible = avatarMode && phase === 'question' && !completed;
  const active = Boolean(stream?.active);
  const video = $('#videoElement');
  if (!video) return;
  video.hidden = !active || avatarVisible;
  $('#avatar-static-img').hidden = !avatarVisible;
  $('#camera-placeholder').hidden = active || avatarVisible;
  $('#video-label').textContent = avatarVisible ? '아바타 면접관' : '내 화면';
  $('#device-badge').innerHTML = `${icon(active ? 'Video' : 'VideoOff')}${active ? '카메라 연결됨' : '카메라 꺼짐'}`;
  $('#device-badge').hidden = avatarVisible;
  $('#toggle-camera').innerHTML = icon(active ? 'Video' : 'VideoOff');
  $('#toggle-camera').setAttribute('aria-label', active ? '카메라 끄기' : '카메라 연결');
  deviceStatus(active ? '' : $('#device-status').textContent);
}

async function connectCamera() {
  if (connecting || completed) return;
  if (stream?.active) { stopCamera(); return; }
  if (!navigator.mediaDevices?.getUserMedia) {
    deviceStatus('카메라를 사용할 수 없습니다. 기기와 브라우저 지원 여부를 확인해 주세요.');
    return;
  }
  connecting = true;
  $('#connect-device').disabled = true;
  $('#toggle-camera').disabled = true;
  deviceStatus('카메라 접근 권한을 확인해 주세요.');
  try {
    const nextStream = await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280},height:{ideal:720}},audio:false});
    if (completed) { nextStream.getTracks().forEach(track => track.stop()); return; }
    stream = nextStream;
    $('#videoElement').srcObject = stream;
    for (const track of stream.getVideoTracks()) track.addEventListener('ended', () => {
      stream = undefined;
      updateCamera();
      deviceStatus('카메라 연결이 종료되었습니다. 다시 연결해 주세요.');
    });
    updateCamera();
    announce('카메라가 연결되었습니다.');
  } catch (error) {
    const denied = ['NotAllowedError','PermissionDeniedError'].includes(error.name);
    deviceStatus(denied
      ? '카메라 사용 권한을 허용한 후 다시 연결해 주세요.'
      : '카메라를 연결할 수 없습니다. 기기 연결 상태를 확인해 주세요.');
    announce($('#device-status').textContent);
  } finally {
    connecting = false;
    if ($('#connect-device')) $('#connect-device').disabled = false;
    if ($('#toggle-camera')) $('#toggle-camera').disabled = false;
  }
}

function stopCamera() {
  stream?.getTracks().forEach(track => track.stop());
  stream = undefined;
  if ($('#videoElement')) $('#videoElement').srcObject = null;
  updateCamera();
  deviceStatus('');
}

function updateTimer() {
  $('#answer-time').textContent = clock(remaining);
  const timer = $('.session-timer');
  timer.setAttribute('aria-label', `남은 답변시간 ${remaining}초`);
  timer.dataset.warning = phase === 'answering' && remaining <= 30 && remaining > 10;
  timer.dataset.danger = phase === 'answering' && remaining <= 10;
  $('#answer-progress').setAttribute('aria-valuenow', String(remaining));
  $('#answer-progress-fill').style.width = `${remaining / 90 * 100}%`;
}

function render() {
  if (completed) return;
  const current = question();
  $('#current-question').textContent = questionIndex + 1;
  $('#total-questions').textContent = questions.length;
  $('#session-progress-track').setAttribute('aria-valuemax', String(questions.length));
  $('#session-progress-track').setAttribute('aria-valuenow', String(questionIndex));
  $('#session-progress-fill').style.width = `${questionIndex / questions.length * 100}%`;
  $('#question-type').textContent = `${current.topic}${current.followup ? ` · 꼬리질문 ${current.followup}` : ''}`;
  $('#session-question').textContent = current.text;
  $('#session-topics').innerHTML = selectedTopics.map((topic, index) => `<span class="session-topic"${index === current.topicIndex ? ' aria-current="true"' : ''}>${index < current.topicIndex ? icon('Check') : ''}${esc(topic)}</span>`).join('');

  const states = {
    question: {
      label:'질문 확인',
      instruction:'준비시간 동안 질문을 읽고 답변을 생각해 주세요.<br>준비가 되면 ‘답변하기’를 눌러 주세요.',
      help:'질문을 확인한 후 답변을 시작해 주세요.',
      actions:`<button class="btn u-btn-primary" type="button" name="AnswerBtn">답변하기${icon('ArrowRight')}</button>`,
      video:'답변 대기',
    },
    ready: {
      label:'답변 준비',
      instruction:'아래 질문에 대한 답변을 해주세요.<br>준비되면 ‘답변 시작’을 눌러 주세요.',
      help:'‘답변 시작’을 누르면 3초 후 제한시간이 시작됩니다.',
      actions:`<button class="btn u-btn-primary" type="button" id="stt_btn">${icon('Mic')}답변 시작</button>`,
      video:'답변 대기',
    },
    countdown: {
      label:'답변 준비',
      instruction:'잠시 후 답변이 시작됩니다.<br>카메라를 바라보며 편하게 말씀해 주세요.',
      help:'잠시 후 답변시간이 시작됩니다.',
      actions:`<button class="btn u-btn-primary" type="button" disabled>답변 준비 중</button>`,
      video:'답변 준비 중',
    },
    answering: {
      label:'답변 중',
      instruction:'질문에 대한 답변을 말씀해 주세요.<br>답변을 마쳤다면 ‘종료’를 눌러 주세요.',
      help:'답변을 마쳤다면 제한시간 전에 종료할 수 있습니다.',
      actions:`<button class="btn session-stop" type="button" id="stop_stt_btn">${icon('Square')}종료</button>`,
      video:'답변 중',
    },
    review: {
      label:'답변 확인',
      instruction:'답변을 마쳤습니다.<br>‘제출하기’를 누르면 다음 질문으로 이동합니다.',
      help:retried ? '다시 답변할 수 있는 횟수를 모두 사용했습니다.' : '다시 답변은 질문당 한 번만 가능합니다.',
      actions:`<button class="btn" type="button" name="reset_answer_btn"${retried ? ' disabled' : ''}>${icon('RotateCcw')}다시 답변</button><button class="btn u-btn-primary" type="button" name="interview_submit_btn">제출하기${icon('ArrowRight')}</button>`,
      video:'답변 종료',
    },
  };
  const currentState = states[phase];
  $('#session-phase').textContent = currentState.label;
  $('#session-instruction').innerHTML = currentState.instruction;
  $('#action-help').textContent = currentState.help;
  $('#session-actions').innerHTML = currentState.actions;
  $('#video-state').innerHTML = `<span></span>${currentState.video}`;
  $('#video-state').dataset.active = phase === 'answering';
  $('#answer-guide').hidden = phase === 'review';
  $('#interviewContents').hidden = phase !== 'review';
  $('#countdown-layer').hidden = phase !== 'countdown';
  $('#answer-progress').dataset.active = ['answering', 'review'].includes(phase);
  $('#timer-label').textContent = phase === 'review' ? '답변한 시간' : phase === 'answering' ? '남은 답변시간' : '답변 제한시간';
  $('#timer-suffix').textContent = phase === 'review' ? '/ 90초' : '/ 90초';
  updateTimer();
  if (phase === 'review') {
    $('#answer-time').textContent = clock(elapsed);
    $('.session-timer').setAttribute('aria-label', `답변한 시간 ${elapsed}초`);
  }
  updateCamera();
}

function clearTimers() {
  clearInterval(phaseTimer);
  clearInterval(countdownTimer);
  phaseTimer = undefined;
  countdownTimer = undefined;
}

function startCountdown() {
  if (phase !== 'ready') return;
  phase = 'countdown';
  let count = 3;
  render();
  $('#countdown-value').textContent = count;
  announce('3초 후 답변을 시작합니다.');
  countdownTimer = setInterval(() => {
    count -= 1;
    if (count <= 0) {
      clearInterval(countdownTimer);
      beginAnswer();
    } else $('#countdown-value').textContent = count;
  }, 1000);
}

function beginAnswer() {
  phase = 'answering';
  remaining = 90;
  elapsed = 0;
  const started = performance.now();
  render();
  $('#stop_stt_btn').focus();
  announce('답변시간이 시작되었습니다. 최대 90초 동안 진행합니다.');
  phaseTimer = setInterval(() => {
    elapsed = Math.min(90, Math.floor((performance.now() - started) / 1000));
    remaining = Math.max(0, 90 - elapsed);
    updateTimer();
    if (remaining === 30 || remaining === 10) announce(`답변시간이 ${remaining}초 남았습니다.`);
    if (remaining === 0) endAnswer();
  }, 250);
}

function endAnswer() {
  if (phase !== 'answering') return;
  clearInterval(phaseTimer);
  phase = 'review';
  render();
  announce(remaining === 0 ? '답변시간이 만료되었습니다. 제출해 주세요.' : '답변을 종료했습니다. 확인 후 제출해 주세요.');
  $('[name="interview_submit_btn"]').focus();
}

function submitAnswer() {
  if (phase !== 'review') return;
  answers.push({question:question().text, topic:question().topic, seconds:elapsed, retried});
  questionIndex += 1;
  if (questionIndex === questions.length) { complete(); return; }
  phase = 'question';
  retried = false;
  remaining = 90;
  elapsed = 0;
  render();
  $('#session-question').focus();
  announce(`${questionIndex + 1}번째 질문입니다. ${question().topic}`);
}

function complete() {
  clearTimers();
  stopCamera();
  completed = true;
  $('#current-question').textContent = questions.length;
  $('#session-progress-fill').style.width = '100%';
  $('#session-progress-track').setAttribute('aria-valuenow', String(questions.length));
  $('.session-exit span').textContent = '나가기';
  $('.skip-link').href = '#complete-heading';
  const totalTime = answers.reduce((total, answer) => total + answer.seconds, 0);
  $('#session-main').classList.add('is-complete');
  $('#session-main').innerHTML = `<section class="session-complete" aria-labelledby="complete-heading"><span class="session-complete-icon">${icon('Check')}</span><h1 id="complete-heading" tabindex="-1">면접이 종료되었습니다</h1><p>모든 질문에 대한 답변을 마쳤습니다.</p><div class="session-complete-summary"><div class="session-complete-row"><span>면접 유형</span><strong>${avatarMode ? '아바타 면접' : '실전 면접'}</strong></div><div class="session-complete-row"><span>완료한 질문</span><strong>${questions.length}개</strong></div><div class="session-complete-row"><span>답변 시간</span><strong>${Math.floor(totalTime / 60)}분 ${totalTime % 60}초</strong></div></div><div class="session-actions"><button class="btn" type="button" id="completed-contents">진행 내용 보기</button><a class="btn u-btn-primary" href="./interview-setup.html">면접 목록으로${icon('ArrowRight')}</a></div></section>`;
  $('#complete-heading').focus();
  announce('모든 질문을 마쳤습니다. 면접이 종료되었습니다.');
}

function showContents() {
  if (completed) {
    showDialog('인터뷰 내용', `${answers.map((answer, index) => `<div class="session-transcript"><strong>${index + 1}. ${esc(answer.topic)} · ${answer.seconds}초</strong><p>${esc(answer.question)}</p></div>`).join('')}`);
  } else {
    showDialog('인터뷰 내용', `<div class="session-transcript"><strong>${esc(question().topic)}</strong><p>${esc(question().text)}</p></div><p class="session-review-note">답변한 시간: ${elapsed}초</p>`);
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (button.name === 'AnswerBtn' && phase === 'question') {
    phase = 'ready';
    render();
    $('#stt_btn').focus();
  } else if (button.id === 'stt_btn') startCountdown();
  else if (button.id === 'stop_stt_btn') endAnswer();
  else if (button.name === 'interview_submit_btn') submitAnswer();
  else if (button.name === 'reset_answer_btn' && phase === 'review' && !retried) {
    showDialog('다시 답변할까요?', '<p>현재 답변을 지우고 같은 질문에 다시 답변합니다. 다시 답변은 질문당 한 번만 가능합니다.</p>', [{label:'취소'},{label:'다시 답변',primary:true,run:() => {retried = true; remaining = 90; elapsed = 0; phase = 'ready'; render(); $('#stt_btn').focus();}}]);
  } else if (button.id === 'interviewContents' || button.id === 'completed-contents') showContents();
  else if (button.id === 'session-exit') {
    if (completed) location.href = './interview-setup.html';
    else showDialog('면접을 종료할까요?', '<p>면접을 종료하고 준비 화면으로 이동합니다.</p>', [{label:'계속하기'},{label:'면접 종료',primary:true,run:() => {clearTimers(); stopCamera(); phase = 'exited'; location.href = './interview-setup.html';}}]);
  } else if (button.id === 'connect-device' || button.id === 'toggle-camera') connectCamera();
  else if (button.id === 'fullscreen-video') {
    const stage = $('#video_start');
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    else if (stage.requestFullscreen) stage.requestFullscreen().catch(() => toast('이 환경에서는 전체화면을 사용할 수 없습니다.'));
    else toast('이 환경에서는 전체화면을 사용할 수 없습니다.');
  }
});

$('#dialog-close').addEventListener('click', () => dialog.close());
$('#dialog-actions').addEventListener('click', event => {
  const button = event.target.closest('[data-dialog-action]');
  if (!button) return;
  const run = dialogAction[Number(button.dataset.dialogAction)]?.run;
  dialog.close();
  run?.();
});
dialog.addEventListener('close', () => { if (dialogOrigin?.isConnected) dialogOrigin.focus(); });
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
document.addEventListener('fullscreenchange', () => {
  const button = $('#fullscreen-video');
  if (!button) return;
  const active = Boolean(document.fullscreenElement);
  button.setAttribute('aria-label', active ? '영상 영역 전체화면 종료' : '영상 영역 전체화면');
  button.innerHTML = icon(active ? 'Minimize' : 'Maximize');
});
window.addEventListener('pagehide', () => {clearTimers(); stopCamera();});
window.addEventListener('beforeunload', event => {
  if (!completed && ['answering', 'countdown'].includes(phase)) {event.preventDefault(); event.returnValue = '';}
});

icons();
if (new URLSearchParams(location.search).get('state') === 'review') {phase = 'review'; elapsed = 25; remaining = 65;}
render();
