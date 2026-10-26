// Component guidance describes the target behavior; it is not a production API.
// Only confirmed shared CSS measurements are listed as fixed specifications.
const baseAssets = ['tokens.css', 'style.css', 'brand-refinement.css', 'layout-focus.css', 'interactions.css'];
const fieldSizes = [
  ['Small', '--control-height-sm: 36px · Body 2 Normal 14/22 · 좌우 10px · 아이콘 16px'],
  ['Medium', '--control-height-md: 44px · Body 1 Normal 16/24 · 좌우 12px · 아이콘 18px'],
  ['Large', '--control-height-lg: 52px · Body 1 Normal 16/24 · 좌우 16px · 아이콘 20px'],
  ['크기 지정', 'data-control-size="sm | md | lg" · 기본 Medium · 모바일에서 자동 축소하지 않음'],
];
const fieldFocus = ['포커스', '입력 경계 1px · --primary · outline-offset: 0 · 복합 입력은 외곽 전체에 표시'];
const buttonFocus = ['포커스', 'outline: 1px solid var(--primary) · outline-offset: 0'];
const dialogSpecs = [
  ['내부 여백', '--dialog-padding: 24px'],
  ['닫기 버튼', '아이콘 22px · 클릭 영역 40×40px · hover/focus 배경 --muted'],
  ['전환', '--duration-normal: 180ms · 초점 표시는 즉시 반영'],
];
const defaultChecks = ['긴 한글·영문과 200% 확대에서 내용과 행동이 잘리지 않는지 확인합니다.', 'Light/Dark에서 의미·선택 상태·포커스를 확인합니다.'];
const families = {
  Actions: {
    when: '사용자의 명시적인 행동이나 선택을 실행할 때 사용합니다.',
    alternative: '목적지가 있는 페이지 이동은 링크로 제공합니다.',
    keyboard: ['버튼은 Tab으로 이동하고 Enter 또는 Space로 실행합니다. 링크는 Enter로 이동합니다.'],
    specification: [buttonFocus, ['타이포그래피', '행동의 역할과 크기에 맞는 Label 역할 사용 · Primary 채움 라벨은 흰색/700']],
  },
  Inputs: {
    when: '사용자가 값을 입력하거나 선택할 때 사용합니다.',
    alternative: '편집할 수 없는 정보는 본문으로 표시하고, 제출 동의와 즉시 적용 설정은 구분합니다.',
    keyboard: ['Tab 순서는 라벨·입력·보조 행동의 읽기 순서를 따릅니다. 입력 방식별 조작은 아래 규칙을 적용합니다.'],
    specification: [fieldFocus, ['크기', '해당 입력의 규격을 따릅니다. Textarea·Checkbox·Radio·Switch·Slider·Upload에는 한 줄 입력 높이를 강제하지 않습니다.']],
  },
  Navigation: {
    when: '현재 위치를 알리거나 다른 화면·콘텐츠로 이동할 때 사용합니다.',
    alternative: '값 선택은 입력 컨트롤, 서버 요청이나 저장은 버튼으로 제공합니다.',
    keyboard: ['페이지 링크는 Tab으로 이동하고 Enter로 실행합니다. 화면의 시각적 순서와 초점 순서를 맞춥니다.'],
    specification: [buttonFocus, ['타이포그래피', '기반 규칙의 역할을 사용합니다. GNB·서브메뉴는 Label 1 14/20/500입니다.']],
  },
  Feedback: {
    when: '현재 상태·처리 결과·복구 방법을 알릴 때 사용합니다.',
    alternative: '사용자가 수정해야 하는 입력 오류는 해당 필드에 표시하고, 확인이 필요한 행동은 확인 다이얼로그를 사용합니다.',
    keyboard: ['안내 문구 자체는 초점 순서에 넣지 않습니다. 닫기·재시도 등 행동은 키보드로 실행할 수 있어야 합니다.'],
    specification: [['색상', '상태에 맞는 의미 토큰 사용 · 색상과 문구를 함께 표시'], ['크기·배치', '내용과 사용처에 맞춰 결정 · 모달·알림·로딩의 크기를 일괄 적용하지 않음']],
  },
  'Data display': {
    when: '관련 정보를 읽고 비교할 수 있는 단위로 묶을 때 사용합니다.',
    alternative: '비교가 필요하면 Table, 단일 요약이면 Card 또는 Item을 선택합니다.',
    keyboard: ['정보 표시는 별도 키보드 조작을 추가하지 않습니다. 내부의 링크·버튼은 각 컨트롤의 조작 규칙을 따릅니다.'],
    specification: [['텍스트·간격', '정보 위계에 맞는 타이포그래피·간격 토큰 사용'], ['크기·모서리', '해당 예제와 사용처에 맞춰 결정 · 모든 표시 요소에 같은 패딩이나 모서리를 강제하지 않음']],
  },
};
const overrides = {
  button: {
    usage: {when: '저장·생성·다음 단계처럼 사용자가 실행하는 행동에 사용합니다.', alternative: '페이지 이동은 링크, 짧은 보조 행동은 Text button을 사용합니다.'},
    rules: ['한 행동 영역에서 주 행동을 구분합니다. 임시저장은 보조, 저장 후 다음은 주 행동으로 둡니다.', 'Primary 채움은 흰색/700을 유지하며 hover·active에서도 글자색이 바뀌지 않아야 합니다.', '요청 중 중복 실행을 막고, 완료·실패를 실제 처리 결과와 연결합니다.'],
    checks: ['기본·hover·active·focus·disabled에서 라벨과 크기가 유지되는지 확인합니다.', '긴 라벨이 줄바꿈하고 아이콘이 찌그러지지 않는지 확인합니다.'],
    specification: [['Primary', '--primary / --primary-hover / --primary-active · 글자 --primary-foreground / 700 · 진한 외곽선 없음'], ['Small', '최소 높이 --control-height-sm: 36px · Label 2 13/18 · 좌우 10px'], buttonFocus],
  },
  'icon-button': {
    usage: {when: '도구 모음의 검색·복사·닫기 등 이름을 짧은 아이콘으로 표현할 때 사용합니다.', alternative: '뜻이 불명확하거나 중요한 주 행동이면 텍스트가 있는 Button을 사용합니다.'},
    rules: ['구체적인 aria-label과 hover·키보드 focus 툴팁을 모두 제공합니다.', '동작이 바뀌면 이름과 아이콘을 함께 갱신합니다. 삭제·제거는 대상 이름을 포함합니다.', '동적으로 추가된 버튼과 비활성 버튼에도 기능 안내가 표시되어야 합니다.'],
    keyboard: ['Tab으로 버튼에 초점을 두면 툴팁을 표시합니다. Enter/Space로 실행하고 Escape로 툴팁을 닫습니다.'],
    checks: ['hover와 키보드 focus에서 같은 기능명이 보이며 모달·화면 밖으로 잘리지 않는지 확인합니다.'],
    specification: [['일반 예제', '.icon-btn: 38×38px · 아이콘 의미에 맞는 aria-label 필수'], ['모달 헤더 닫기', '클릭 영역 40×40px · 아이콘 22px · hover/focus 배경 --muted'], buttonFocus],
    assets: ['icon-tooltips.js'],
  },
  chip: {
    usage: {when: '직종·업종·키워드를 선택하거나 선택한 조건을 표시할 때 사용합니다.', alternative: '작업 결과만 표시하면 Badge, 긴 설명이 필요한 선택이면 Framed choice를 사용합니다.'},
    rules: ['선택 상태의 border-color와 글자색은 --primary를 사용합니다.', '단일 선택과 다중 선택의 의미를 구분합니다. 선택 상태는 checked 또는 aria-pressed로 전달합니다.', '제거 버튼에는 해당 항목 이름을 포함하며 칩 선택과 제거 행동을 분리합니다.'],
    keyboard: ['버튼형 칩은 Enter/Space로 선택합니다. Radio·Checkbox 기반 칩은 해당 입력의 키보드 규칙을 따릅니다.'],
    checks: ['긴 선택값에서 줄바꿈하며 선택·제거 버튼이 중첩되지 않는지 확인합니다.'],
    specification: [['선택', '테두리 --primary · 텍스트 --primary'], ['텍스트', '작은 칩 Label 2 · 긴 라벨은 줄바꿈'], buttonFocus],
  },
  input: {
    usage: {when: '제목·이름 등 한 줄의 값을 입력할 때 사용합니다.', alternative: '긴 글은 Textarea, 정해진 후보 선택은 Select 또는 Combobox를 사용합니다.'},
    rules: ['라벨은 입력 후에도 유지합니다. Placeholder는 예시로 사용합니다.', '오류의 원인과 수정 방법을 필드 아래에 표시하고 aria-describedby로 연결합니다.', 'readonly는 읽기 전용, disabled는 조작 불가로 구분합니다. 기존 name/id·제출값을 보존합니다.'],
    keyboard: ['일반 문자 입력·선택·복사·붙여넣기·커서 이동을 가로채지 않습니다.'],
    checks: ['기본·focus·오류·readonly·disabled와 자동완성 상태를 확인합니다.', '동일 그룹의 Select·검색·날짜 입력과 외곽 높이가 일치하는지 확인합니다.'],
    specification: [...fieldSizes, fieldFocus, ['모서리', '--radius-md: 8px']],
    assets: ['control-sizing.css'],
  },
  textarea: {
    usage: {when: '경험·문항 답변·피드백처럼 여러 줄의 글을 입력할 때 사용합니다.', alternative: '짧은 제목은 Input, 서식 편집이 필요하면 기존 Rich editor를 유지합니다.'},
    rules: ['글자 수 제한은 공백 포함 여부와 함께 안내합니다. 길이 오류와 저장 실패를 구분합니다.', '입력한 글을 먼저 보존하고 오류가 나도 초기화하지 않습니다.', '한 줄 입력의 36/44/52px 높이를 적용하지 않습니다.'],
    keyboard: ['Enter는 줄바꿈합니다. 글 편집·붙여넣기·한글 조합 입력을 방해하지 않습니다.'],
    checks: ['긴 문장·여러 줄·한글 조합·길이 초과 상태와 세로 크기 변경을 확인합니다.'],
    specification: [['본문', '긴 작성 본문 Body 1 Reading 16/28 · 사용처 역할은 service-typography.js에서 지정'], ['높이', '내용과 작성 과업에 맞춘 최소 높이 · 한 줄 입력 높이 토큰과 별개'], fieldFocus],
  },
  select: {
    usage: {when: '정해진 짧은 목록에서 값 하나를 고를 때 사용합니다.', alternative: '선택지 전체 비교는 Radio, 후보가 많으면 Combobox를 사용합니다.'},
    rules: ['선택값을 기본적으로 말줄임하지 않습니다. 긴 값은 줄바꿈하고 높이가 늘어나야 합니다.', '폼은 가용 너비를 채웁니다. 도구 모음은 data-control-width="content"로 가장 긴 옵션의 너비를 확보합니다.', '기존 옵션 값·disabled·change 이벤트를 보존합니다. 커스텀 UI 교체는 CSS 변경과 구분합니다.'],
    keyboard: ['목록에서 ↑/↓로 이동하고 Home/End로 처음/마지막 항목으로 이동합니다.', 'Enter로 선택하고 Escape로 닫습니다. Tab으로 빠져나갈 때 목록을 닫습니다.'],
    checks: ['가장 긴 옵션을 선택하고 모바일·200% 확대에서 값이 잘리지 않는지 확인합니다.', '선택 변경 시 실제 제출값과 기존 change 처리가 일치하는지 확인합니다.'],
    specification: [...fieldSizes, fieldFocus, ['너비', '폼 100% · 도구 모음 content · max-width: 100%']],
    assets: ['control-sizing.css', 'custom-controls.css', 'custom-controls.js'],
  },
  combobox: {
    usage: {when: '기업명·직무처럼 후보가 많아 검색이 필요한 값을 선택할 때 사용합니다.', alternative: '검색 없이 짧은 목록에서 고르면 Select, 자유 텍스트만 받으면 Input을 사용합니다.'},
    rules: ['선택 후보와 직접 입력값을 구분하고 자유 입력 허용 여부를 필드별로 정합니다.', '검색 결과가 없어도 입력어를 유지합니다. 한글 조합 중 확정을 가로채지 않습니다.', '포커스 경계는 아이콘을 포함한 외곽 전체에 표시합니다.'],
    keyboard: ['↓로 목록을 열고 ↑/↓로 후보를 이동합니다. Enter로 선택하고 Escape로 닫습니다.', '문자 입력·좌우 커서 이동과 한글 조합은 입력 필드의 기본 동작을 유지합니다.'],
    checks: ['검색 중·결과 있음·없음·선택 후·한글 조합·disabled를 확인합니다.'],
    specification: [...fieldSizes, fieldFocus],
    assets: ['control-sizing.css', 'custom-controls.css', 'custom-controls.js'],
  },
  search: {
    usage: {when: '문서·컨설턴트·게시글 목록에서 결과를 찾을 때 사용합니다.', alternative: '입력값을 저장하려면 Input, 후보 하나를 선택하려면 Combobox를 사용합니다.'},
    rules: ['검색 대상을 이름으로 명시하고 지우기 버튼에는 구체적인 기능명을 제공합니다.', '아이콘과 입력을 감싼 외곽 전체에 포커스 경계를 표시합니다.', '지우면 입력을 비우고 초점을 유지합니다. 서버 검색·필터 초기화는 기존 동작을 따릅니다.'],
    keyboard: ['Tab으로 입력과 지우기 버튼에 접근합니다. Enter 검색 여부는 해당 서비스의 기존 제출 방식을 유지합니다.'],
    checks: ['비어 있음·입력 중·결과 없음·지운 후 상태를 확인합니다.'],
    specification: [...fieldSizes, fieldFocus],
    assets: ['control-sizing.css', 'custom-controls.css', 'custom-controls.js', 'icon-tooltips.js'],
  },
  'date-picker': {
    usage: {when: '경력 기간·작성일 등 날짜를 입력하거나 달력에서 고를 때 사용합니다.', alternative: '시각은 Time picker, 일반 숫자는 Input을 사용합니다.'},
    rules: ['직접 입력은 숫자 8자리 YYYYMMDD로 제한하고 YYYY-MM-DD로 표시합니다. 두 형식의 붙여넣기를 허용합니다.', '존재하지 않는 날짜와 기간 역전을 오류로 설명합니다. 기존 min/max·required·제출값을 보존합니다.', '오늘 날짜의 max 값은 기존 서비스가 정합니다. DDS가 임의로 추가하지 않습니다.'],
    keyboard: ['↓ 또는 달력 버튼으로 달력을 엽니다. 날짜의 ←/→는 하루, ↑/↓는 한 주, Home/End는 주의 처음/끝, PageUp/PageDown은 월을 이동합니다.', 'Enter/Space로 날짜를 선택하고 Escape로 닫아 입력으로 복귀합니다.'],
    checks: ['윤년·잘못된 날짜·직접 입력·붙여넣기·기간 역전·min/max·readonly를 확인합니다.'],
    specification: [...fieldSizes, fieldFocus, ['직접 입력', '숫자 최대 8자리 · 표시 YYYY-MM-DD']],
    assets: ['control-sizing.css', 'custom-controls.css', 'custom-controls.js', 'icon-tooltips.js'],
  },
  field: {
    usage: {when: '라벨·입력·필수 표시·도움말·오류를 한 묶음으로 연결할 때 사용합니다.', alternative: '관련 필드 여러 개의 질문은 fieldset/legend로 묶습니다.'},
    rules: ['for/id와 aria-describedby로 라벨·도움말·오류를 연결합니다.', '첫 진입부터 오류를 표시하지 않습니다. 제출 시 검증하고, 오류가 확인된 필드는 수정 후 다시 검증합니다.', '제출 실패 시 첫 오류로 안내하고 입력값은 보존합니다. 기존 서버 검증을 제거하지 않습니다.'],
    keyboard: ['오류 요약이 있으면 각 오류에서 해당 입력으로 이동할 수 있어야 합니다.'],
    checks: ['빈 필수값·형식 오류·서버 오류에서 라벨 연결과 수정 경로를 확인합니다.'],
    specification: [['입력 크기', '내부 Input·Select·Date picker의 같은 크기 변형 사용'], ['도움말·오류', 'Body 2 Normal · 오류 --text-error · 해당 입력과 접근성 연결']],
    assets: ['control-sizing.css'],
  },
  'input-group': {
    usage: {when: '아이콘·단위·비밀번호 표시 버튼을 하나의 입력 경계 안에 둘 때 사용합니다.', alternative: '독립적인 여러 필드는 Field 그룹으로 분리합니다.'},
    rules: ['포커스 경계와 높이는 그룹 외곽이 소유합니다. 내부 입력에 두 번째 테두리를 만들지 않습니다.', '보조 버튼은 type="button"으로 두고 입력값과 기존 제출 이벤트를 보존합니다.', '비밀번호 표시·숨기기 시 값과 기능명을 함께 유지·갱신합니다.'],
    keyboard: ['Tab으로 입력과 보조 버튼을 이동하며 버튼은 Enter/Space로 실행합니다.'],
    checks: ['입력과 보조 버튼 각각에 초점을 두었을 때 외곽 전체가 표시되는지 확인합니다.'],
    specification: [...fieldSizes, fieldFocus],
    assets: ['control-sizing.css', 'extensions.css', 'extension-demos.js', 'icon-tooltips.js'],
  },
  checkbox: {
    usage: {when: '서로 독립적인 여러 항목을 선택하거나 제출 동의를 받을 때 사용합니다.', alternative: '상호 배타적인 값 하나는 Radio, 즉시 적용 설정은 Switch를 사용합니다.'},
    rules: ['동의를 기본 선택하지 않습니다. 전체 선택은 일부 선택 상태를 표현합니다.', '라벨을 눌러도 선택되도록 연결하고 disabled와 읽을 수 있는 설명을 구분합니다.'],
    keyboard: ['Tab으로 이동하고 Space로 선택·해제합니다.'],
    checks: ['선택·해제·일부 선택·disabled와 전체 선택의 실제 대상 범위를 확인합니다.'],
    specification: [['선택', '선택 표면 --primary · 체크/일부 선택 표식 --primary-foreground'], ['크기', '한 줄 입력 높이를 적용하지 않음 · 라벨을 포함한 조작 영역 확인'], buttonFocus],
  },
  radio: {
    usage: {when: '신입/경력처럼 서로 배타적인 선택지 전체를 비교할 때 사용합니다.', alternative: '선택지가 많으면 Select, 여러 값이 가능하면 Checkbox를 사용합니다.'},
    rules: ['같은 그룹의 name을 통일하고 fieldset/legend로 질문을 제공합니다.', '시각적 선택과 실제 checked 값을 일치시킵니다.'],
    keyboard: ['Tab으로 그룹에 진입하고 방향키로 항목을 선택합니다. Space로 초점 항목을 선택합니다.'],
    checks: ['하나만 선택되며 키보드 이동과 제출값이 일치하는지 확인합니다.'],
    specification: [['선택', '선택 표면 --primary · 표식 --primary-foreground'], ['크기', '한 줄 입력 높이를 적용하지 않음 · 라벨을 포함한 조작 영역 확인'], buttonFocus],
  },
  switch: {
    usage: {when: '켬/끔 설정을 즉시 적용할 때 사용합니다.', alternative: '별도의 제출이 필요한 동의나 목록 선택은 Checkbox를 사용합니다.'},
    rules: ['라벨의 의미는 유지하고 켜짐/꺼짐 상태를 checked 또는 aria-checked로 전달합니다.', '저장 실패로 설정이 적용되지 않으면 실제 값과 표시를 맞추고 복구 방법을 안내합니다.'],
    keyboard: ['Tab으로 이동하고 Space로 전환합니다.'],
    checks: ['켬·끔·disabled와 실제 설정의 반영 시점을 확인합니다.'],
    specification: [['포커스', '스위치 트랙에 1px --primary · outline-offset: 0'], ['크기', 'Switch 전용 트랙 사용 · 한 줄 입력 높이 제외']],
  },
  upload: {
    usage: {when: '이력서·포트폴리오 등 파일을 선택할 때 사용합니다.', alternative: '이미 선택한 파일의 상태는 Attachment로 표시합니다.'},
    rules: ['허용 확장자·파일 크기를 선택 전에 표시합니다.', '파일 선택과 실제 업로드 완료를 구분합니다. 클라이언트 예제만으로 서버 검증·업로드를 대체하지 않습니다.', '드래그 외에 파일 선택 버튼을 제공합니다.'],
    keyboard: ['파일 선택 버튼에 Tab으로 접근하고 Enter/Space로 파일 선택창을 엽니다.'],
    checks: ['긴 파일명·허용하지 않은 형식·용량 초과·중복 선택·업로드 실패를 확인합니다.'],
    specification: [['크기', 'Upload 전용 영역 · 한 줄 입력 높이 제외'], ['표시', '파일명·선택 상태와 업로드 결과를 구분']],
    assets: ['custom-controls.css', 'custom-controls.js'],
  },
  tabs: {
    usage: {when: '한 화면의 같은 맥락에 있는 콘텐츠 패널을 전환할 때 사용합니다.', alternative: '페이지 이동은 링크, AI 모델 등 값 하나 선택은 Radio 또는 Segmented control을 사용합니다.'},
    rules: ['탭과 패널의 id·aria-controls·aria-labelledby를 연결합니다.', '탭 너비는 라벨, 패널 너비는 상위 컨테이너를 기준으로 합니다. 본문 길이로 탭 바가 바뀌지 않아야 합니다.', '가려진 패널의 입력·버튼이 키보드 초점 순서에 남지 않게 합니다.'],
    keyboard: ['←/→로 탭을 전환하고 Home/End로 처음/마지막 탭으로 이동합니다.', 'Tab으로 선택한 패널의 다음 조작 요소로 이동합니다.'],
    checks: ['내용 길이가 다른 패널·긴 탭명·좁은 화면에서 너비와 활성 상태를 확인합니다.'],
    specification: [['너비', '탭 바 width: max-content / max-width: 100% · 패널은 부모 기준'], ['포커스', '선택 상태와 키보드 초점을 별도로 표시']],
  },
  dialog: {
    usage: {when: '현재 맥락에서 짧은 작업·확인·미리보기를 할 때 사용합니다.', alternative: '긴 작성 과업은 페이지, 가벼운 보조 설명은 Popover를 사용합니다.'},
    rules: ['제목으로 이름을 제공하고 열릴 때 내부로 초점을 이동합니다.', '모달이 열린 동안 배경을 조작하지 못하게 하고 닫으면 실행한 요소로 초점을 돌립니다.', '중첩 모달을 피합니다. 긴 내용은 내부 스크롤로 보여주고 닫기를 가리지 않습니다.'],
    keyboard: ['Tab/Shift+Tab은 모달 내부를 이동합니다. Escape 또는 닫기 버튼으로 닫습니다.'],
    checks: ['열기·닫기·초점 복귀·긴 내용·오류·모바일 키보드 상태를 확인합니다.'],
    specification: dialogSpecs,
    assets: ['icon-tooltips.js'],
  },
  'alert-dialog': {
    usage: {when: '삭제 등 영향이 큰 행동의 대상과 결과를 확인받을 때 사용합니다.', alternative: '되돌릴 수 있는 가벼운 결과 안내는 Toast 또는 Snackbar를 사용합니다.'},
    rules: ['실제 대상과 복구 가능 여부를 명시합니다. 확인 버튼은 ‘삭제’처럼 행동 이름으로 씁니다.', '최초 초점은 취소에 둡니다. 확인 전에는 데이터를 변경하지 않습니다.'],
    keyboard: ['Tab/Shift+Tab은 내부를 이동합니다. Escape는 취소이며, 닫힌 뒤 실행한 요소로 복귀합니다.'],
    checks: ['취소·Escape에서 실제 데이터가 바뀌지 않고 확인 시 한 번만 실행되는지 검수합니다.'],
    specification: dialogSpecs,
    assets: ['extensions.css', 'extension-demos.js', 'icon-tooltips.js'],
  },
  alert: {
    usage: {when: '현재 화면에서 계속 확인해야 할 상태·제약·오류를 안내할 때 사용합니다.', alternative: '짧은 완료 알림은 Toast, 개별 입력 오류는 해당 Field에 표시합니다.'},
    rules: ['상태에 맞는 문구와 다음 행동을 제공합니다. 색상만으로 의미를 전달하지 않습니다.', '반드시 알아야 하는 안내를 자동으로 사라지게 하지 않습니다.'],
    checks: ['본문과 아이콘의 의미가 일치하고 긴 안내·링크가 잘리지 않는지 확인합니다.'],
    specification: [['상태', '--info / --success / --warning / --destructive와 각 배경 토큰'], ['글자', '일반 안내 --text-primary/--text-secondary · 상태 문구는 해당 의미 토큰']],
  },
  toast: {
    usage: {when: '저장·복사 등 현재 작업을 막지 않는 짧은 결과를 알릴 때 사용합니다.', alternative: '수정해야 하는 오류는 Field/Alert, 행동이 필요한 알림은 Snackbar를 사용합니다.'},
    rules: ['실제 처리 완료 후 알립니다. 중요한 실패를 Toast로만 전달하지 않습니다.', '초점을 빼앗지 않고 결과를 읽을 수 있게 전달합니다. 같은 알림을 연속으로 쌓지 않습니다.'],
    checks: ['연속 실행·모달 위 표시·작은 화면에서 안내가 겹치거나 가려지지 않는지 확인합니다.'],
    specification: [['전환', '--duration-normal: 180ms · 처리 완료 시점과 애니메이션을 구분'], ['배치', '현재 화면의 고정 행동·다른 알림을 가리지 않게 배치']],
  },
  tooltip: {
    usage: {when: '아이콘 버튼의 기능명이나 짧은 보조 설명을 제공할 때 사용합니다.', alternative: '필수 입력 조건은 본문/도움말, 링크·행동이 필요한 상세 설명은 Popover를 사용합니다.'},
    rules: ['hover와 키보드 focus 모두에서 표시합니다. 필수 정보를 툴팁에만 넣지 않습니다.', '버튼의 접근 가능한 이름은 툴팁 표시 여부와 관계없이 유지합니다.'],
    keyboard: ['트리거에 초점을 두면 표시하고 Escape로 닫습니다. 툴팁 자체에 초점을 이동하지 않습니다.'],
    checks: ['모달·스크롤 영역·화면 가장자리에서 잘리지 않는지, 터치 환경에 필수 설명이 남는지 확인합니다.'],
    specification: [['아이콘 툴팁 글자', 'Label 2 13/18'], ['아이콘 툴팁 색', '--surface-inverse / --text-inverse'], ['아이콘 툴팁 너비', 'max-width: min(280px, 100vw - 24px) · 긴 문구 줄바꿈']],
    assets: ['icon-tooltips.js'],
  },
  card: {
    usage: {when: '문서·컨설턴트처럼 독립적인 정보 하나와 진입 행동을 묶을 때 사용합니다.', alternative: '항목 간 값 비교는 Table, 단순한 반복 정보는 Item을 사용합니다.'},
    rules: ['카드 전체의 대표 링크와 삭제·복사 등 보조 버튼을 중첩하지 않습니다.', '카드 클릭과 제목 링크는 같은 목적지로 연결하며 보조 행동은 별도로 실행합니다.', '밀도 높은 문서 목록은 제목·상태·보조정보의 순서를 통일합니다.'],
    keyboard: ['대표 링크와 보조 버튼 각각에 Tab으로 접근합니다. 같은 대표 이동을 불필요하게 중복 초점으로 제공하지 않습니다.'],
    checks: ['카드 빈 공간·제목·보조 버튼의 클릭 결과, 긴 제목, 홀수 개 항목의 반응형 너비를 확인합니다.'],
    specification: [['문서 목록 제목', 'Body 1 Normal 16/24 / 600'], ['보조정보', 'Body 2 Normal 14/22 · 날짜 Caption 1 12/18'], ['카드 배치', '같은 열의 너비 규칙 유지 · 마지막 항목만 100%로 늘리지 않음']],
  },
  table: {
    usage: {when: '여러 문서·사용자의 같은 속성을 행과 열로 비교할 때 사용합니다.', alternative: '핵심 정보가 짧고 비교가 필요하지 않으면 Item 또는 Card를 사용합니다.'},
    rules: ['제목·열 헤더·데이터 셀 관계를 유지합니다. 정렬 가능 여부와 현재 정렬 상태를 전달합니다.', '빈 결과·로딩·오류를 구분합니다. 모바일에서 핵심 열 또는 가로 스크롤을 제공합니다.', '열 선택·전체 선택·페이지 이동 시 기존 대상 범위를 보존합니다.'],
    keyboard: ['일반 표 셀을 임의의 Tab 정지점으로 만들지 않습니다. 정렬·선택·행동 버튼에 접근할 수 있어야 합니다.'],
    checks: ['긴 값·빈 결과·정렬·선택·페이지 이동·좁은 화면의 열 대응을 확인합니다.'],
    specification: [['너비', '비교할 정보에 맞춰 열 너비 결정 · 좁은 화면의 가로 스크롤 허용'], ['텍스트', '열의 역할에 따라 타이포그래피 지정 · 표 전체를 임의로 축소하지 않음']],
  },
  empty: {
    usage: {when: '아직 만든 문서가 없거나 검색 조건에 맞는 결과가 없을 때 사용합니다.', alternative: '통신·서버 실패는 Fallback view, 권한 제한은 제한 이유와 가능한 경로를 안내합니다.'},
    rules: ['처음 사용·검색 결과 없음·접근 제한을 서로 다른 문구로 설명합니다.', '문서 만들기 또는 조건 초기화처럼 현재 상태를 해결하는 행동을 제공합니다.'],
    checks: ['빈 상태를 오류처럼 표현하지 않는지, 행동이 실제 가능한 경로인지 확인합니다.'],
    specification: [['내용', '상태 제목 · 필요한 설명 · 가능한 행동'], ['크기', '부모 영역에 맞춤 · 장식 아이콘이 주 행동보다 강조되지 않게 배치']],
  },
  progress: {
    usage: {when: '실제 전체 작업량과 완료 비율을 알고 있을 때 사용합니다.', alternative: '완료 비율을 모르면 Spinner와 처리 중 문구를 사용합니다.'},
    rules: ['서버나 작업 상태에서 얻은 실제 진행률을 표시합니다. 시간에 따라 임의의 퍼센트를 만들지 않습니다.', '완료·실패·재시도를 진행 중 상태와 구분합니다.'],
    checks: ['0%·진행 중·완료·실패에서 실제 상태와 수치가 일치하는지 확인합니다.'],
    specification: [['값', '실제 진행률 · 수치 또는 처리 문구를 함께 표시'], ['색상', '--primary와 상태에 맞는 의미 토큰']],
  },
  skeleton: {
    usage: {when: '곧 표시할 콘텐츠의 구조와 공간을 알고 있을 때 사용합니다.', alternative: '레이아웃을 알 수 없는 짧은 대기는 Spinner, 완료된 빈 결과는 Empty state를 사용합니다.'},
    rules: ['실제 콘텐츠와 비슷한 영역만 예약하고 장식용 자리표시자를 늘리지 않습니다.', '로딩 종료 후 콘텐츠·빈 결과·오류로 전환합니다. 무한 로딩에 복구 경로를 제공합니다.'],
    checks: ['실제 콘텐츠로 전환할 때 큰 레이아웃 이동이 없는지, 실패가 빈 카드로 남지 않는지 확인합니다.'],
    specification: [['크기', '예상 콘텐츠의 실제 영역 기준'], ['상태', '로딩 문구를 함께 제공 · 읽기 순서에 반복된 장식 요소를 추가하지 않음']],
  },
  editor: {
    usage: {when: '자기소개서 문항과 본문을 작성하고 AI 제안을 검토할 때 사용합니다.', alternative: '서식 없이 긴 글만 받으면 Textarea를 사용합니다. 운영 편집기는 기존 기능을 유지합니다.'},
    rules: ['원문·AI 제안·사용자가 적용한 결과를 구분합니다. 검토 없이 원문을 덮어쓰지 않습니다.', '작성 중·저장 중·저장 완료·저장 실패를 구분하고 실패해도 입력을 유지합니다.', '라이브러리 내부 DOM·선택 영역·인쇄/PDF는 주변 CSS와 별도로 검수합니다.'],
    keyboard: ['본문 편집의 기본 단축키·한글 조합을 유지하고 도구 모음에 키보드로 접근할 수 있게 합니다.'],
    checks: ['긴 글·붙여넣기·한글 조합·AI 결과 적용·저장 실패·인쇄/PDF를 확인합니다.'],
    specification: [['본문', 'Body 1 Reading 16/28 · 일반 굵기 최대 700'], ['저장', '저장 상태는 실제 처리와 연결 · 예제의 로컬 상태를 운영 저장으로 사용하지 않음']],
  },
  accordion: {
    usage: {when: 'FAQ·문항별 피드백처럼 제목으로 내용을 예상할 수 있는 상세를 펼칠 때 사용합니다.', alternative: '항상 필요한 입력이나 핵심 결과는 기본 화면에 유지합니다.'},
    rules: ['제목만 읽어도 펼칠 내용을 알 수 있어야 합니다. 펼침 상태는 aria-expanded 또는 native details로 전달합니다.', '숨긴 내용은 초점 순서에서 제외합니다. 같은 섹션의 제목 계층을 유지합니다.'],
    keyboard: ['트리거에 Tab으로 이동하고 Enter/Space로 펼치거나 접습니다.'],
    checks: ['펼침·접힘·긴 내용과 접힌 내부의 초점 제외 여부를 확인합니다.'],
    specification: [['전환', '--duration-normal: 180ms · 최신 전환 미지원 시에도 최종 상태 동일'], buttonFocus],
  },
  stepper: {
    usage: {when: '자소서 작성·면접 준비처럼 순서가 있는 절차의 현재 단계를 알릴 때 사용합니다.', alternative: '동등한 콘텐츠 전환은 Tabs, 수치 진행률은 Progress를 사용합니다.'},
    rules: ['예정·현재·완료·오류를 색상만으로 구분하지 않습니다.', '표시만 있는 단계를 클릭 가능한 것처럼 만들지 않습니다. 이동이 가능하면 기존 검증과 입력 보존을 유지합니다.'],
    checks: ['단계 이동 전후 입력 보존·현재 단계·오류 표시·긴 단계명을 확인합니다.'],
    specification: [['표시', '단계 순서 · 제목 · 상태를 함께 제공'], ['상태', '현재 --primary · 완료와 오류는 표식/문구 병행']],
  },
};

export function componentContract(c = {}) {
  const family = families[c.group] || families['Data display'];
  const custom = overrides[c.id] || {};
  const assets = [...baseAssets];
  if (c.added) assets.push('extensions.css', 'extension-demos.js');
  assets.push(...(custom.assets || []));
  return {
    usage: {...{when: family.when, alternative: family.alternative}, ...custom.usage},
    rules: [...(custom.rules || [c.rule || '이 요소의 역할과 사용처를 먼저 정하고 기존 동작에 맞춰 적용합니다.'])],
    keyboard: [...(custom.keyboard || family.keyboard)],
    checks: [...(custom.checks || defaultChecks)],
    specification: (custom.specification || family.specification).map(row => [...row]),
    assets: [...new Set(assets)],
  };
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const list = items => `<ul class="plain-list">${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;

// Insert inside an existing Usage section. The caller owns headings, IDs and specs.
export function renderComponentContract(c) {
  const contract = componentContract(c);
  return `<h3>선택 기준</h3><div class="table-wrap"><table class="dds-rules-table"><tbody><tr><th scope="row">사용할 때</th><td>${escapeHTML(contract.usage.when)}</td></tr><tr><th scope="row">다른 선택</th><td>${escapeHTML(contract.usage.alternative)}</td></tr></tbody></table></div><h3>동작 규칙</h3>${list(contract.rules)}<h3>키보드</h3>${list(contract.keyboard)}<h3>검수</h3>${list(contract.checks)}`;
}
