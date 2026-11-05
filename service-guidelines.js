import {chartComponents} from './chart-catalog.js?v=2ba405c41d82bf19';

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const table = (caption, headings, rows) => `<div class="table-wrap"><table class="dds-rules-table"><caption class="sr-only">${esc(caption)}</caption><thead><tr>${headings.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

export const formRules = [
  ['라벨·도움말', '라벨은 항상 표시하고 for/id로 연결합니다. 조건·형식은 도움말에 쓰고 aria-describedby로 연결합니다. Placeholder로 라벨을 대체하지 않습니다.'],
  ['필수·선택', '필수 여부를 시각 표시와 required 또는 aria-required로 함께 전달합니다. 읽기 전용 값은 readonly로 제공하고 disabled와 구분합니다.'],
  ['검증 시점', '첫 입력 전에는 오류를 표시하지 않습니다. 제출 시 검증하고, 이미 표시된 오류는 수정 후 재검증합니다. 서버 오류는 해당 필드 또는 폼에 표시합니다.'],
  ['오류 위치', '필드 아래에 원인과 수정 방법을 표시하고 aria-invalid·aria-describedby로 연결합니다. 오류가 여러 개면 폼 상단 요약에서 각 필드로 이동할 수 있게 합니다.'],
  ['제출·대기', '임시저장은 부분 입력을 허용하는 기존 정책을 유지합니다. 다음 단계 이동은 필수 항목을 검증합니다. 요청 중 중복 제출을 막고 결과가 확인된 뒤 저장 완료를 표시합니다.'],
  ['실패·재시도', '저장·생성 실패 시 입력값을 유지하고 재시도 경로를 제공합니다. 재시도 횟수·시간 제한은 기존 서버 정책을 따릅니다.'],
  ['초기화·동적 항목', '폼을 초기화하면 원본 입력과 커스텀 선택 UI가 같은 값으로 돌아갑니다. 항목 추가 후 새 필드로, 삭제 후 인접 항목이나 추가 버튼으로 초점을 옮깁니다.']
];

export const feedbackRules = [
  ['필드 오류', '입력 바로 아래', '무엇을 어떻게 고칠지 씁니다. 오류가 해결될 때까지 유지합니다.'],
  ['폼·화면 오류', '폼 상단 또는 작업 영역', '입력값을 보존하고 재시도·돌아가기 등 가능한 행동을 제공합니다. 일시적인 토스트만으로 대체하지 않습니다.'],
  ['가벼운 완료 알림', 'Toast · role=status', '현재 작업을 막지 않는 저장·복사 결과에 사용합니다. 결과 확인을 위해 초점을 옮기지 않습니다.'],
  ['취소할 수 있는 행동', 'Snackbar + 되돌리기', '되돌리기가 실제 구현된 경우에만 제공합니다. 행동 버튼을 사용하는 동안 자동으로 닫히지 않아야 합니다.'],
  ['복구할 수 없는 삭제', 'Alert dialog', '삭제할 대상과 영향을 명시하고 취소에 먼저 초점을 둡니다. 서버의 삭제 정책을 확인합니다.'],
  ['빈 데이터·검색 결과 없음', 'Empty state', '첫 사용에는 작성 행동을, 검색 결과 없음에는 검색어 변경·필터 초기화를 안내합니다.'],
  ['불러오기·실패', 'Skeleton / Spinner → 결과 또는 오류', '로딩은 대기 중일 때만 표시합니다. 요청 실패를 빈 목록이나 0점으로 바꾸지 않습니다.']
];

export const localizationRules = [
  ['브랜드·서비스명', '번역하면 안 되는 텍스트에 translate="no"와 class="notranslate"를 함께 지정합니다. DeepResume·DeepInterview와 언어 이름의 원문 표기를 보호합니다.'],
  ['언어 선택', '한국어·English·日本語처럼 각 언어의 원문 이름을 표시합니다. 선택한 언어를 실제 문서 lang와 서비스 설정에 반영합니다.'],
  ['길이·줄바꿈', '언어 변경으로 길어진 버튼·선택값·오류 안내를 생략하지 않습니다. 고정 높이 대신 최소 높이를 사용하고 실제 가장 긴 문구로 확인합니다.'],
  ['날짜·숫자', '표시 형식과 제출 값을 구분합니다. 기존 name·value·날짜 제한과 서버 저장 형식을 유지하고 표시만 사용자 언어에 맞춥니다.'],
  ['이미지·아이콘', '기능을 설명하는 텍스트는 HTML로 제공합니다. 장식 이미지는 빈 alt, 의미 있는 이미지는 대체 텍스트를 제공합니다. 아이콘 버튼은 번역 가능한 기능 이름과 툴팁을 가집니다.']
];

export const implementationRules = [
  ['UI 원본', 'ui/registry.json과 ui/README.md에서 컴포넌트·파트·의존성을 확인합니다. ui/templates의 HTML 또는 ui/index.js의 createComponent를 사용하고 ui/tokens-scoped.css·ui/dds.css·.dds-ui 범위를 유지합니다. 문서와 같은 원본을 재사용하며 모양이 비슷한 UI를 따로 만들지 않습니다.'],
  ['토큰과 글자', '색·간격·컨트롤 값의 원본은 tokens.css, 글자 역할은 typography-system.js입니다. service-typography.js는 현재 적용 예시의 매핑이므로 대상 서비스의 사용처에 맞춰 연결합니다. UI 원본의 크기·패딩·모서리·경계를 임의로 바꾸지 않습니다.'],
  ['적용 범위', '대상 URL·템플릿·기존 선택자·상태 클래스·필드 id/name·연결 이벤트를 먼저 기록합니다. CSS 변경과 HTML 보완을 구분합니다.'],
  ['콘텐츠 연결', 'createComponent의 text·attributes·slots 또는 기존 템플릿 바인딩으로 문구·링크·이름·입력값·개수·상태를 실제 데이터로 바꿉니다. 반복 인스턴스의 id와 for·aria 참조는 고유하게 유지합니다. 텍스트를 HTML로 실행하지 않습니다.'],
  ['UI 동작', 'mountDDS는 선택·탭·열기와 닫기·초점 등 UI 상태를 연결합니다. 저장·AI·결제·업로드·권한은 dds:action이나 onAction에서 서비스의 기존 처리 함수와 연결합니다. 성공 상태는 실제 처리 결과를 받은 뒤 표시합니다.'],
  ['초기화와 해제', '현재 위젯이 있는 곳은 controls:false로 시작해 중복 초기화를 막습니다. 컨트롤 향상이 필요하면 명시한 root에 연결하고, 화면을 제거할 때 cleanup을 호출해 이벤트·관찰자·포털을 정리합니다. custom-controls.js의 문서 전체 자동 변환은 서비스에 연결하지 않습니다.'],
  ['상태 보존', '권한·hidden·disabled·로딩·오류는 기존 로직에서 결정합니다. CSS로 숨겨진 기능을 강제로 노출하거나 데이터를 만들어 채우지 않습니다.'],
  ['정보 위계', '카드 제목 16/24/600은 --text-strong, 기업·직무 14/22/500은 --text-primary, 보조 설명 14/22는 --text-secondary, 날짜 12/18은 --text-tertiary로 연결합니다.'],
  ['카드 행동', '대표 이동은 실제 href가 있는 카드 전체 링크로 연결하고 보조 행동은 대표 링크 바깥에 둡니다. 정적 카드에 클릭을 암시하는 hover를 넣지 않습니다.'],
  ['탐색 표현', '.dds-nav-link는 글자·색·포커스만 적용하고 배경을 자동 추가하지 않습니다. 배경이 필요한 메뉴에는 .dds-nav-control을 사용해 글자·아이콘 전체에 패딩과 클릭 영역을 확보합니다. 부모 여백은 항목 내부 패딩을 대신하지 않습니다.'],
  ['탐색 상태', '메뉴 컨트롤은 최소 높이 40px·패딩 10px 12px·간격 8px을 기본으로 합니다. 현재 서비스 적용 예시의 GNB는 1180px 이하에서 최소 높이 44px·패딩 12px 12px을 사용합니다. 현재 위치는 aria-current로 전달하며 hover·현재·focus에서 크기와 굵기를 유지합니다.'],
  ['공통 스타일', '목록 셀·섹션 헤더·하단 탐색·명령 검색·오류 대체 화면·표도 ui/dds.css와 원본 HTML의 클래스를 그대로 사용합니다. 문서의 축소 미리보기 크기는 복사하지 않습니다. 라우팅·검색·재시도 등 실제 처리는 서비스 로직에 연결합니다.'],
  ['반응형 배치', '페이지뿐 아니라 실제 컴포넌트 컨테이너의 320px·390px·전환 경계에서 확인합니다. flex/grid의 본문은 min-width:0, 아이콘·스위치·아바타는 수축하지 않게 하고 긴 제목·행동은 줄바꿈합니다. 표·차트·칸반의 필요한 가로 스크롤만 해당 영역 안에 둡니다.'],
  ['간격과 팝업', '제목과 개수는 8px, 오류 설명과 복구 행동은 20px을 둡니다. 검색 아이콘·입력·지우기는 한 외곽 안에 정렬합니다. 펼친 메뉴는 화면 가장자리에서 위치를 조정하고, 문서 프레임이나 서비스 래퍼가 잘라내지 않는지 확인합니다.'],
  ['상태·개수', '처리 상태는 실제 문구와 의미 아이콘, 목록 개수는 실제 데이터의 배지로 표시합니다. 항목 추가·삭제·필터 변경 시 개수도 갱신합니다.'],
  ['섹션 구성', '섹션 제목에 장식 아이콘을 넣거나 섹션마다 회색 바탕의 틀을 추가하지 않습니다. 배경 캔버스가 필요하면 페이지·body 수준에서 정합니다.'],
  ['검수', 'PC·모바일, 라이트·다크, 긴 제목·빈 값·오류·대기·동적 항목에서 확인합니다. 계산된 폰트·색·경계·패딩·높이를 UI 원본과 대조하고 기존 CSS의 덮어쓰기를 해결합니다. 메뉴의 hover·현재 위치·focus, 키보드 순서와 실제 제출 값을 변경 전과 대조합니다.'],
  ['완료 보고', '수정 파일·선택자 매핑·화면별 검수 결과·미검증 항목을 남깁니다. 예제 표시와 실서비스 검증 완료를 구분합니다.']
];

export const exampleScopes = {
  button: ['채움·테두리 5종, 아이콘 조합, 크기·너비, 비활성·로딩 표시와 상태 전환', '서비스 요청·제출·성공·실패 결과 연결'],
  table: ['정적 표와 상태 표시', '정렬·행 선택·서버 페이지 이동'],
  chart: ['차트 선택 기준과 고정된 예제 데이터', '서비스 데이터·집계·로딩·오류 연결'],
  'bar-chart': ['고정 데이터의 막대 비교·범례 선택·수치 확인·데이터 표', '서비스 데이터·집계·로딩·오류 연결'],
  'line-chart': ['고정 데이터의 변화 표시·범례 선택·수치 확인·데이터 표', '서비스 데이터·기간 필터·로딩·오류 연결'],
  'area-chart': ['고정 데이터의 영역 표시·범례 선택·수치 확인·데이터 표', '서비스 데이터·누적 집계·로딩·오류 연결'],
  'pie-chart': ['고정 데이터의 비중 표시·범례 선택·수치 확인·데이터 표', '서비스 데이터·전체 집계·로딩·오류 연결'],
  'donut-chart': ['고정 데이터의 구성비·범례 선택·수치 확인·데이터 표', '서비스 데이터·전체 집계·로딩·오류 연결'],
  'radar-chart': ['고정 데이터의 역량 비교·범례 선택·수치 확인·데이터 표', '실제 평가 점수·척도·로딩·오류 연결'],
  'radial-chart': ['고정 데이터의 달성률·범례 선택·수치 확인·데이터 표', '실제 목표·현재 값·로딩·오류 연결'],
  'scatter-chart': ['고정 데이터의 분포·범례 선택·수치 확인·데이터 표', '실제 관측값·집계·로딩·오류 연결'],
  'heatmap-chart': ['고정 데이터의 명도 분포·수치 확인·데이터 표', '서비스 데이터·범위·로딩·오류 연결'],
  'chart-tooltip': ['다중 막대의 같은 항목에 대한 계열별 점 표식·수치 확인·데이터 표', '실제 차트 데이터·선택 항목·계열별 툴팁 연결'],
  editor: ['여러 줄 텍스트 입력·글자 수', '서식 편집기·문서 저장·AI 생성'],
  video: ['장치 권한 안내', '카메라·마이크 요청·녹화·업로드'],
  upload: ['로컬 PDF 선택·형식·용량 확인', '서버 업로드·진행률·재시도'],
  attachment: ['고정 파일 정보와 로컬 제거 표시', '실제 파일 업로드·삭제'],
  progress: ['고정된 진행률 표시', '실제 요청 진행률 연결']
};

export function exampleScope(id) {
  const chart = chartComponents.find(component => component.id === id);
  const scope = exampleScopes[chart?.chartFamily || id];
  return scope ? `<p class="helper"><b>공통 UI:</b> ${esc(scope[0])}. <b>서비스 연결:</b> ${esc(scope[1])}.</p>` : '<p class="helper">원본의 상태·조작 규칙을 재사용하고 실제 데이터·이벤트를 연결한 화면에서 함께 검수합니다.</p>';
}

export const patternContracts = {
  'service-footer': [
    ['메인', '회사정보·약관·고객지원·SNS는 실제 서비스 콘텐츠 유지. 회사정보와 메뉴의 묶음 구분.'],
    ['서브', '간략한 푸터 구성 유지. 회사정보 전체를 반복해서 넣지 않음.'],
    ['테마 전환', '아이콘 버튼에 경계선 표시. 현재 모드가 아니라 전환할 모드를 기능 이름과 툴팁으로 안내.'],
    ['좁은 화면', '링크·회사정보·하단 유틸리티 줄바꿈. 글자는 14px 유지. 고정 저장 버튼에 가리지 않도록 확인.']
  ],
  'ai-writing': [
    ['생성 대기', '원문과 입력값 유지. 중복 생성 방지. 처리 중임을 텍스트와 상태로 전달.'],
    ['생성 완료', '제안은 검토 후 적용. 적용 전 원문을 보존하고 실제 지원되는 복구 방법 제공.'],
    ['생성·저장 실패', '편집 내용 유지. 실패한 작업과 재시도를 같은 영역에서 안내.'],
    ['마지막 행동', '필수 입력 뒤에 저장·다음 배치. 유효하지 않은 제출은 해당 오류로 이동.']
  ],
  'document-list': [
    ['카드 이동', '.dds-card-link의 실제 href로 카드 전체에서 이동. .dds-card-tools는 대표 링크 바깥에 배치. Enter와 보조 버튼의 동작 분리.'],
    ['정보 위계', '제목 16/24/600은 Strong, 기업·직무 14/22/500은 Primary 텍스트. 보조 14/22는 Secondary, 날짜 12/18은 Tertiary.'],
    ['상태·개수', '상태는 실제 문구와 의미 아이콘. 목록 개수는 실제 데이터 배지로 표시하고 변경 시 갱신.'],
    ['상세·편집', '자기소개서·이력서는 기존 편집 경로로 직접 이동. 중간 확인 모달은 필수 정보 입력에만 사용.'],
    ['빈 목록', '첫 문서 작성 행동 제공. 검색 결과 없음과 구분.'],
    ['긴 제목·3개 카드', '제목은 줄바꿈. 마지막 카드가 한 행 전체로 늘어나지 않도록 동일 열 규칙 적용.'],
    ['정적 카드', '이동·실행이 없으면 손 모양 커서나 떠오르는 hover 효과 없음.']
  ],
  'resume-builder': [
    ['반복 항목', '동일한 필드 크기 사용. 추가 후 새 항목으로 초점 이동. 삭제 시 인접 행동으로 초점 복귀.'],
    ['날짜', '기존 날짜 범위·제출 값 유지. 직접 입력과 달력 선택 결과를 동일하게 검증.'],
    ['저장 실패', '작성 내용과 추가한 항목 유지. 실패 위치와 재시도 제공.'],
    ['출력', '미리보기·인쇄·PDF에서 긴 경력·표·페이지 나눔·웹폰트 확인.']
  ],
  'consulting': [
    ['상태 구분', '담당 지정 상태와 문서 컨설팅 진행 상태를 별도 표시. 서버 조건을 CSS로 대체하지 않음.'],
    ['신청 전', '대상 문서·담당자·비용·기한이 있는 경우 확인. 기존 신청 결과를 받은 뒤 완료 표시.'],
    ['접근 제한', '허용되지 않는 행동과 가능한 이동 경로 안내. 원인을 계정 역할로 임의 추정하지 않음.']
  ],
  'interview': [
    ['장치 권한', '거절·장치 없음·준비 완료 구분. 실제 브라우저 권한을 확인하고 재설정 경로 안내.'],
    ['녹화·업로드', '단계를 구분. 진행률은 실제 제공되는 값만 표시. 실패 시 보존 가능한 녹화와 재시도 안내.'],
    ['중단', '중단 시 사라지는 내용과 복구 여부를 기존 처리 정책에 맞춰 안내.']
  ]
};

export function formValidationSpec() {
  return `<h2>폼 검증과 복구</h2>${table('폼 검증과 복구 규칙', ['상황', '적용 규칙'], formRules)}<h3>오류 요약과 필드 이동</h3><p>입력 확인을 누르면 오류를 모아서 표시합니다. 오류 링크를 누르면 해당 입력으로 이동합니다.</p><div class="playground pattern-preview"><form data-validation-example novalidate><div class="alert danger" data-error-summary tabindex="-1" hidden><div><h4>입력 내용을 확인해 주세요</h4><ul data-error-links></ul></div></div><div class="field"><label for="validation-title">자기소개서 제목 <span class="required">*</span></label><input id="validation-title" name="title" required aria-describedby="validation-title-error"><p class="dds-error" id="validation-title-error"></p></div><div class="field"><label for="validation-email">이메일 <span class="required">*</span></label><input id="validation-email" name="email" type="email" required aria-describedby="validation-email-hint validation-email-error"><p class="helper" id="validation-email-hint">name@example.com 형식으로 입력해 주세요.</p><p class="dds-error" id="validation-email-error"></p></div><div class="demo-row"><button type="submit" class="btn primary">입력 확인</button><button type="reset" class="btn">초기화</button></div><p class="helper" data-validation-result role="status"></p></form></div>`;
}

export function bindServiceGuidelines() {
  document.querySelectorAll('[data-validation-example]').forEach(form => {
    let submitted = false;
    const summary = form.querySelector('[data-error-summary]');
    const links = form.querySelector('[data-error-links]');
    const result = form.querySelector('[data-validation-result]');
    const fields = [...form.querySelectorAll('input[required]')];
    function validate(moveFocus = false) {
      const errors = fields.flatMap(input => {
        const message = input.validity.valueMissing ? (input.name === 'title' ? '자기소개서 제목을 입력해 주세요.' : '이메일을 입력해 주세요.') : input.validity.typeMismatch ? '이메일을 name@example.com 형식으로 입력해 주세요.' : '';
        form.querySelector('#' + input.id + '-error').textContent = message;
        input.setAttribute('aria-invalid', String(Boolean(message)));
        return message ? [{id: input.id, message}] : [];
      });
      links.innerHTML = errors.map(error => `<li><a href="#${esc(error.id)}" data-error-target="${esc(error.id)}">${esc(error.message)}</a></li>`).join('');
      summary.hidden = !errors.length;
      result.textContent = errors.length ? '' : '입력 형식을 확인했습니다. 데이터는 전송하지 않습니다.';
      if (errors.length && moveFocus) summary.focus();
    }
    form.addEventListener('submit', event => {event.preventDefault(); submitted = true; validate(true);});
    form.addEventListener('input', () => {if (submitted) validate();});
    form.addEventListener('click', event => {
      const link = event.target.closest('[data-error-target]');
      if (!link) return;
      event.preventDefault();
      form.querySelector('#' + link.dataset.errorTarget)?.focus();
    });
    form.addEventListener('reset', () => {
      submitted = false; summary.hidden = true; links.innerHTML = ''; result.textContent = '';
      fields.forEach(input => {input.removeAttribute('aria-invalid'); form.querySelector('#' + input.id + '-error').textContent = '';});
    });
  });
}
export function contentBehaviorSpec() {
  return `<h2>피드백 선택</h2>${table('상황별 피드백', ['상황', '위치·컴포넌트', '규칙'], feedbackRules)}<h2>언어와 번역</h2>${table('언어와 번역 규칙', ['대상', '적용 규칙'], localizationRules)}<p class="helper">translate="no"는 번역 제외 의도를 전달하는 표준 속성입니다. 실제 사용하는 화면 번역 도구에서도 제외되는지 확인합니다.</p>`;
}
export function patternRequirements(id) {
  const rows = patternContracts[id];
  return rows ? `<h2>상태별 처리 기준</h2>${table('상태별 처리 기준', ['상황', '처리·검수'], rows)}` : '';
}
