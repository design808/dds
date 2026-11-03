// Component guidance describes the target behavior; it is not a production API.
// Only confirmed shared CSS measurements are listed as fixed specifications.
const baseAssets = ['tokens.css', 'style.css', 'brand-refinement.css', 'layout-focus.css', 'interactions.css'];
const visibilityAssets = ['visibility.css', 'visibility.js', 'service-typography.css'];
const serviceAssets = new Set(['tokens.css', 'visibility.css', 'visibility.js', 'button-system.css']);
const documentationAssets = new Set(['style.css', 'brand-refinement.css', 'layout-focus.css', 'extensions.css', 'extension-demos.js', 'button-demos.js', 'button-docs.css']);
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
const chartKeyboard = ['범례와 데이터 표 열기에 Tab으로 이동하고 Enter/Space로 실행합니다.', '데이터 지점은 마우스 hover와 키보드 focus에서 같은 항목명·수치를 제공합니다. 터치로도 수치를 확인할 수 있어야 합니다.'];
const chartChecks = ['원본 데이터와 차트의 지점·툴팁·표의 수치 및 단위가 일치하는지 확인합니다.', '0개·1개·90개·365개, 값 0·누락·전체 누락, 긴 한글 항목명과 많은 계열을 확인합니다.', '첫·끝 날짜 눈금과 인접 눈금이 겹치지 않고, 범례가 줄바꿈 후에도 항목명·색·값을 구분하는지 확인합니다.', '라이트·다크·좁은 화면·200% 확대와 웹폰트 로딩·서체 변경 후 축·범례·값의 간격과 내부 스크롤을 확인합니다.'];
const chartSpecification = [['표시 정보', '제목 · 항목명 · 단위 · 필요한 기간과 비교 기준'], ['타이포그래피', '제목 Body 1 Normal / 600 · 축 눈금 Caption 1 · 범례·툴팁 Label 2 · 원형 중앙 Title 2 / 700'], ['계열 색상', '주 계열 --primary · 보조 중립 slate · 기능별 색상 설정에서는 기존 기능 팔레트 사용'], ['너비', '부모 너비에 맞춤 · 범주별 최소 폭·행 높이 확보 · 필요한 스크롤은 해당 차트 안에 배치'], ['날짜 눈금', '실제 서체·글자 폭·표시 너비로 간격 계산 · 첫·끝 포함 충돌 금지 · 글자 축소·회전으로 해결하지 않음'], ['범례', '계열 수와 항목명에 맞춰 줄바꿈 · 인접 범례·차트와 간격 확보'], ['데이터 대안', '눈금 생략과 별개로 전체 지점·정확한 툴팁·같은 항목명·수치·단위의 HTML 표 유지']];
const chartLineColor = ['선 색상', '라이트 주 계열 --brand-700 · 다크 --primary'];
const chartGuidance = (when, alternative, rules = [], specification = [], checks = []) => ({
  usage: {when, alternative},
  rules: ['제목·단위·기간·비교 기준을 함께 제공합니다. 누락값을 0으로 바꾸지 않습니다.', '색상 외에 범례 이름·수치·선 모양 등을 함께 사용하고 같은 데이터는 모든 화면에서 같은 의미로 표시합니다.', '날짜축은 실제 글자 폭으로 눈금 간격을 정합니다. 첫·끝 눈금도 겹치면 둘 다 강제로 표시하지 않습니다. 글자를 축소하거나 회전하지 않고 눈금만 줄이며 전체 지점·툴팁·표는 보존합니다.', '컨테이너 너비·웹폰트 로딩·서체 변경 후 눈금 간격을 다시 계산합니다. 계열이 많으면 범례를 줄바꿈하고, 범주가 많거나 길면 가로 막대 또는 항목별 최소 폭·행 높이와 내부 스크롤을 사용합니다.', ...rules],
  keyboard: [...chartKeyboard],
  checks: [...chartChecks, ...checks],
  specification: [...chartSpecification, ...specification],
  assets: ['chart-catalog.js', 'chart-system.css', 'chart-system.js', 'chart-layout.js'],
});
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
    specification: [buttonFocus, ['타이포그래피', '.dds-nav-link와 .dds-nav-control: Label 1 14/20/500 · 상태별 크기·굵기 유지'], ['텍스트형 링크', '.dds-nav-link: 글자·색·포커스만 적용 · hover와 현재 위치에 자동 배경 없음'], ['메뉴 컨트롤', '.dds-nav-control: 최소 높이 40px · 패딩 10px 12px · 간격 8px'], ['컨트롤 배치', 'inline-flex · 세로 가운데 · 시작 정렬 · 글자와 아이콘 전체에 내부 패딩 확보'], ['컨트롤 상태', '기본 투명 · hover --surface · 현재 --accent · 포커스 1px Primary / offset 0'], ['현재 위치', 'aria-current="page"와 강조 색 사용 · 배경은 메뉴 컨트롤에서만 적용 · 탭 선택은 Tabs 규칙 사용'], ['현재 GNB 적용 예시', '너비 1180px 이하: 최소 높이 44px · 패딩 12px 12px'], ['밀도 조정', '사이드바·목차·하위 메뉴의 고유 너비·밀도 유지 · 개별 항목의 좌우 패딩 명시']],
    checks: [...defaultChecks, 'hover·현재 위치·키보드 포커스에서 크기와 글자 너비가 유지되는지 확인합니다.', '배경이 있는 항목은 글자·아이콘 외곽 전체에 내부 패딩이 있는지 확인합니다. 부모 여백으로 대체하지 않습니다.', '긴 메뉴명과 좁은 화면에서 배경·클릭 영역·줄바꿈이 일치하고 인접 항목을 침범하지 않는지 확인합니다.'],
    assets: visibilityAssets,
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
  Charts: {
    when: '값의 비교·변화·구성·분포를 시각화할 때 사용합니다.',
    alternative: '정확한 값만 조회하거나 항목이 적으면 Table 또는 수치 요약을 사용합니다.',
    keyboard: chartKeyboard,
    specification: chartSpecification,
  },
};
const overrides = {
  'top-navigation': {
    usage: {when:'서비스의 로고·주 메뉴·언어와 계정 메뉴를 제공할 때 사용합니다.', alternative:'페이지 내부의 동등한 콘텐츠 전환은 Tabs를 사용합니다.'},
    rules: ['데스크톱은 로고·주 메뉴·보조 메뉴를 한 줄에 배치합니다. 모바일 첫 줄은 왼쪽 로고와 맨 오른쪽 메뉴 버튼으로 구성합니다.', '언어 변경·프로필·로그아웃 등 보조 메뉴는 모바일에서 햄버거가 여는 같은 패널 안에 배치합니다. 닫힌 상태로 첫 줄에 남기지 않습니다.', '전환 너비는 로고·메뉴 수·서체에 맞춰 정하고 CSS와 JS에서 같은 화면 또는 컨테이너 너비를 사용합니다. 640px 예제나 기존 서비스의 1180px를 모든 서비스에 강제하지 않습니다.', '펼침 패널의 같은 컨트롤을 재사용하고 ID·이벤트·언어와 계정 상태를 유지합니다. 접힌 패널은 display:none 또는 hidden으로 숨겨 키보드 초점에서도 제외합니다.', '화면 크기가 전환되면 메뉴의 열림 상태를 정리합니다. 현재 초점이 숨겨질 때만 보이는 로고·메뉴 버튼으로 옮깁니다.'],
    keyboard: ['메뉴 버튼은 Enter/Space로 열고 닫으며 aria-expanded와 aria-controls를 연결합니다.', 'Escape는 열린 하위 메뉴부터 닫고, 다음 Escape에서 전체 모바일 메뉴를 닫아 햄버거 버튼으로 초점을 돌립니다.', '메뉴가 닫혔을 때 내부 링크·언어·계정 컨트롤로 Tab 초점이 들어가지 않아야 합니다.'],
    specification: [...families.Navigation.specification, ['모바일 첫 줄','로고 왼쪽 · 햄버거 맨 오른쪽 · 언어·계정은 펼침 패널 안'], ['모바일 메뉴 버튼','최소 44×44px · aria-expanded / aria-controls · 기능 툴팁'], ['펼침 패널','주 메뉴와 언어·계정 그룹 · 같은 DOM 재사용 · 접힘 시 초점 제외']],
    checks: [...defaultChecks, '320px·390px와 전환 너비 양쪽에서 로고·햄버거가 한 줄이고 겹치거나 줄바꿈되지 않는지 확인합니다.', '언어·계정은 모바일 메뉴가 열렸을 때만 보이고 사용할 수 있는지 확인합니다.', '메뉴 열기·언어 선택·계정 이동·Escape·Tab 순서·초점 복귀와 PC↔모바일 전환을 확인합니다.'],
  },
  'navigation-menu': {
    rules: ['일반 페이지 링크를 사용하며 사이트 탐색을 애플리케이션 menubar 키보드 모델로 바꾸지 않습니다.', '하위 메뉴의 트리거와 펼침 영역을 aria-expanded·aria-controls 또는 native details/summary로 연결합니다.', '모바일에서는 주 메뉴와 언어·계정 같은 보조 메뉴를 같은 펼침 패널 안에 배치합니다. 닫힌 메뉴의 내부 항목은 초점에서 제외합니다.'],
    keyboard: ['Tab으로 링크와 펼침 버튼을 순서대로 이동합니다. Enter/Space로 하위 메뉴를 여닫습니다.', 'Escape로 하위 메뉴를 먼저 닫고 해당 트리거에 초점을 돌립니다. 상위 모바일 메뉴의 닫기와 구분합니다.'],
    checks: [...defaultChecks, '접힌 하위 메뉴가 보이지 않고 Tab 초점에서도 제외되는지 확인합니다.', '모바일 패널 안에서 언어·프로필과 하위 메뉴가 겹치지 않는지 확인합니다.'],
  },
  chart: chartGuidance(
    '비교할 데이터의 성격에 맞는 차트 종류와 공통 표시 규칙을 정할 때 사용합니다.',
    '단일 값은 수치 요약, 정확한 값의 조회는 데이터 테이블을 사용합니다.',
    ['항목 비교는 막대, 시간 변화는 선·영역, 전체의 구성은 원·도넛, 같은 척도의 역량 비교는 레이더를 선택합니다.', '로딩·데이터 없음·요청 실패를 구분합니다. 결과가 없거나 요청이 실패했다고 0점을 만들지 않습니다.', '기존 Chart.js·ApexCharts 등 데이터 연결과 이벤트를 유지하고 색·서체·축·범례 설정을 DDS에 맞춥니다. 라이브러리를 일괄 교체하지 않습니다.', 'canvas 내부 색·글자·선은 외부 CSS만으로 바뀌지 않습니다. 해당 라이브러리의 옵션과 라이트·다크 전환도 연결합니다.'],
    [['서비스 연결', '기존 데이터·집계·툴팁·범례·내보내기 유지 · 예제 데이터와 분리']],
    ['데이터의 단위·집계 방식·비교 대상이 같은지, 실제 로딩·빈 결과·실패 상태가 구분되는지 확인합니다.']
  ),
  'bar-chart': chartGuidance(
    '평가 항목별 점수·횟수처럼 범주 사이의 크기를 비교할 때 사용합니다.',
    '시간에 따른 연속적인 흐름은 선 차트, 전체 대비 비중은 도넛 차트 또는 누적 막대를 검토합니다.',
    ['막대의 길이는 0을 기준으로 비교합니다. 음수는 같은 0 기준선의 반대 방향으로 표시합니다.', '긴 항목명은 가로 막대를 사용합니다. 그룹은 같은 항목의 여러 계열, 누적은 항목별 전체와 구성을 비교할 때 사용합니다.', '누적 막대의 합계와 개별 수치를 구분합니다. 비율 누적은 각 항목의 전체가 100%라는 기준을 표시합니다.'],
    [['종류', '세로 · 가로 · 다중 · 누적 · 수치 라벨 · 음수'], ['막대 두께', '세로 최대 48px · 가로 20px'], ['끝 모양', '노출된 끝 반경 4px · 0 기준은 평평하게 · 누적 내부는 직각'], ['기준선', '길이 비교는 0 기준 · 음수에서 기준선 유지']],
    ['음수·양수가 섞인 경우와 모든 값이 0인 경우의 기준선·눈금을 확인합니다.']
  ),
  'line-chart': chartGuidance(
    '면접 회차별 점수나 일별 사용량처럼 순서가 있는 값의 변화를 볼 때 사용합니다.',
    '순서 없는 항목 비교는 막대 차트, 개별 두 수치의 관계는 산점도를 사용합니다.',
    ['가로축의 순서와 시간 간격을 유지합니다. 누락 구간을 실제 측정값처럼 이어 그리지 않습니다.', '여러 계열은 이름·점 모양·선 모양으로 함께 구분합니다. 범례 선택 후에도 같은 축 범위를 유지합니다.', '세로축을 0부터 시작하지 않으면 축의 범위를 명확히 보여 주고 작은 차이가 과장되지 않는지 확인합니다.'],
    [['종류', '직선 · 곡선 · 계단 · 데이터 점 · 다중'], ['선·점', '선 2px · 기본 점은 hover/focus에서 표시 · 데이터 점 방식만 상시 표시'], chartLineColor, ['축', '시간·회차 순서 유지 · 축 최소/최대와 단위 표시']],
    ['시간 간격이 불규칙하거나 중간 값이 누락된 데이터의 연결을 확인합니다.']
  ),
  'area-chart': chartGuidance(
    '시간에 따른 양의 변화와 여러 항목이 전체에서 차지하는 구성을 함께 볼 때 사용합니다.',
    '계열 사이의 작은 차이를 정확히 비교하려면 선 차트 또는 다중 막대를 사용합니다.',
    ['면적으로 크기를 표현하므로 기본 기준선은 0으로 둡니다. 누적 영역은 계열별 값과 합계를 구분합니다.', '겹친 면적이 뒤의 계열을 가리지 않도록 채움의 강도를 조절하고 경계선을 함께 표시합니다.', '음수나 서로 다른 단위를 같은 누적 영역에 섞지 않습니다. 시간축의 순서와 누락 구간을 보존합니다.'],
    [['종류', '기본 · 직선 · 계단 · 누적 · 100% 누적 · 그라데이션'], ['선·채움', '선 2px · 연한 계열 채움 · 그라데이션은 채움 투명도만 변경'], chartLineColor, ['값', '같은 단위의 양수 계열 · 누적 시 전체 합계 명시']],
    ['계열을 숨기고 다시 표시해도 누적 합계와 표의 수치 해석이 일치하는지 확인합니다.']
  ),
  'pie-chart': chartGuidance(
    '서로 겹치지 않는 소수 항목이 하나의 전체에서 차지하는 비중을 볼 때 사용합니다.',
    '항목이 많거나 비중이 비슷하면 막대 차트, 가운데 합계를 강조하면 도넛 차트를 사용합니다.',
    ['음수를 사용하지 않습니다. 각 항목의 합이 같은 전체를 이루는지 확인하고 분모를 표시합니다.', '항목명과 값·비율을 함께 제공하고 작은 조각의 값도 표에서 확인할 수 있게 합니다.', '전체가 0이면 빈 원을 실제 결과처럼 표시하지 않고 데이터 없음으로 안내합니다.'],
    [['비율', '같은 전체를 구성하는 0 이상의 값 · 반올림 오차 안내']],
    ['합계 0·한 항목 100%·작은 조각·비율 반올림의 합을 확인합니다.']
  ),
  'donut-chart': chartGuidance(
    '전체 대비 항목별 비중을 보여 줄 때 사용합니다. 합계가 중요하면 중앙 수치를 표시하는 방식을 선택합니다.',
    '목표 대비 한 항목의 달성률은 방사형 차트, 여러 항목의 정확한 비교는 막대 차트를 사용합니다.',
    ['원형 조각은 같은 전체의 부분이어야 합니다. 음수나 서로 겹치는 항목을 함께 넣지 않습니다.', '중앙 수치를 표시하는 경우 전체 합계인지 선택 항목의 값인지 이름과 단위로 구분합니다.', '범례 선택으로 계열을 숨겨도 원래 전체 대비 비중인지 표시한 항목끼리의 비중인지 기준을 유지합니다.'],
    [['링 두께', '24px'], ['중앙 정보', '합계 방식에서 이름·단위와 함께 표시 · 기본 방식은 표시하지 않음'], ['비율', '합계가 0이면 데이터 없음 · 원본 값과 비율 함께 제공']],
    ['범례 선택 전후 중앙 합계·조각 비율·표의 기준이 일치하는지 확인합니다.']
  ),
  'radar-chart': chartGuidance(
    '직무 이해·논리성·표현력처럼 같은 척도의 여러 역량을 함께 비교할 때 사용합니다.',
    '항목별 점수 차이를 정확히 읽어야 하면 가로 막대 차트를 사용합니다.',
    ['모든 축에 같은 최소·최대·단위를 사용하고 평가 기준을 설명합니다. 서로 다른 단위의 원본 값을 그대로 섞지 않습니다.', '비교 대상의 축 순서와 범위를 유지합니다. 면적이 넓다는 이유만으로 종합 점수가 높다고 해석하지 않습니다.', '여러 대상을 비교할 때 선 모양과 수치도 함께 제공하고 채움이 겹쳐도 구분되게 합니다.'],
    [['선·눈금', '선 2px · 50/100 눈금 · 0–100점 척도'], chartLineColor, ['척도', '같은 최소/최대·단위 · 동일한 축 순서'], ['종류', '단일 평가 · 두 대상 비교']],
    ['레이더의 면적과 실제 종합 점수를 혼동시키지 않는지, 긴 축 이름이 잘리지 않는지 확인합니다.']
  ),
  'radial-chart': chartGuidance(
    '목표 대비 달성률이나 같은 목표 척도를 가진 여러 항목의 진행 정도를 요약할 때 사용합니다.',
    '전체의 여러 부분을 비교하면 도넛 차트, 정확한 값의 순위를 비교하면 막대 차트를 사용합니다.',
    ['목표·현재 값·단위를 함께 표시합니다. 다른 항목의 원호 길이를 서로 다른 척도로 비교하지 않습니다.', '여러 원호는 각각의 항목명과 수치를 제공하고 원호 반지름에 따른 길이 차이를 성과 차이로 해석하지 않도록 합니다.', '0%·100%·목표 초과의 표시 방식을 정합니다. 알 수 없는 처리 진행률을 임의의 원형 퍼센트로 표시하지 않습니다.'],
    [['종류', '단일 목표 달성률 · 여러 항목'], ['원호 두께', '14px · 트랙과 동일'], ['척도', '현재 값 / 실제 목표 · 목표 초과 시 원본 수치 유지']],
    ['0·목표 완료·목표 초과와 목표가 없는 경우의 수치 표시를 확인합니다.']
  ),
  'scatter-chart': chartGuidance(
    '답변 길이와 평가 점수처럼 두 수치의 관계와 분포를 볼 때 사용합니다.',
    '시간순 변화는 선 차트, 범주별 값 비교는 막대 차트를 사용합니다.',
    ['가로·세로축의 이름과 단위, 관측 단위를 표시합니다. 각 점이 어떤 관측값인지 수치 확인에서 설명합니다.', '분포의 관계를 인과관계로 단정하지 않습니다. 이상값이나 겹친 점을 숨기지 않습니다.', '비교 화면은 같은 축 범위를 유지합니다. 점 크기에 의미가 없으면 임의로 크기를 바꾸지 않습니다.'],
    [['축', '서로 다른 두 수치의 이름·단위 · 관측 단위 표시']],
    ['같은 좌표에 겹친 값·이상값·한 점만 있는 경우의 수치 대안을 확인합니다.']
  ),
  'heatmap-chart': chartGuidance(
    '요일·시간별 사용량이나 회차·평가 항목의 점수처럼 두 범주의 값 분포를 볼 때 사용합니다.',
    '행·열별 정확한 수치 비교가 주목적이면 데이터 테이블, 시간 흐름만 비교하면 선 차트를 사용합니다.',
    ['범위와 단위를 적은 단계형 명도 범례를 제공합니다. 밝기 차이의 방향은 모든 화면에서 유지합니다.', '누락값과 실제 0을 다른 상태로 표시합니다. 색상만으로 해석하지 않도록 각 셀의 값과 표를 제공합니다.', '순서 있는 행·열은 정렬 기준을 유지합니다. 비교 대상이 바뀔 때 같은 값의 색상 범위를 임의로 바꾸지 않습니다.'],
    [['색상', '순차 명도 단계 · 최소/최대와 단위가 있는 범례'], ['셀', '행·열 이름 · 값 · 누락 여부']],
    ['색상 경계값·누락값·0과 좁은 화면의 셀·헤더 대응을 확인합니다.']
  ),
  'chart-tooltip': chartGuidance(
    '다중 막대 차트의 같은 항목에서 여러 계열의 정확한 값을 함께 확인할 때 사용합니다.',
    '항상 알아야 하는 핵심 수치는 라벨이나 요약에 표시하고, 전체 데이터는 표로 제공합니다.',
    ['선택한 항목명 아래에 계열별 점 표식·이름·값·단위를 함께 표시합니다. 점 표식의 색은 차트와 범례의 계열 색과 일치시킵니다.', 'hover·focus·터치 선택에서 같은 항목과 계열 값을 제공합니다. 필요한 정보는 hover에만 숨기지 않습니다.', '차트나 화면 경계를 벗어나지 않게 배치합니다. 선택 항목과 툴팁의 연결을 유지하고 범례에서 숨긴 계열은 툴팁에서도 구분합니다.', '툴팁이 닫혀도 데이터 표에서 같은 값을 읽을 수 있어야 합니다. 툴팁 안에 별도 조작이 필요하면 팝오버를 검토합니다.'],
    [['내용', '항목명 · 계열별 점 표식·이름·원본 수치·단위'], ['입력 방식', '마우스 hover · 키보드 focus · 터치 선택']],
    ['같은 항목의 여러 계열이 차트·범례·툴팁·표에서 같은 수치와 색으로 대응하는지 확인합니다.', '가장자리 항목·긴 이름·범례 선택·터치와 키보드에서 수치를 확인합니다.']
  ),
  button: {
    usage: {when: '저장·생성·다음 단계처럼 사용자가 실행하는 행동에 사용합니다.', alternative: '페이지 이동은 링크, 짧은 보조 행동은 Text button을 사용합니다.'},
    rules: ['한 행동 영역에는 주 행동을 하나만 둡니다. 임시저장은 보조, 저장 후 다음은 주 행동으로 표현합니다.', 'Solid는 primary·assistive·negative, Outlined는 primary·assistive를 지원합니다. Outlined negative를 임의로 만들지 않습니다.', 'Negative는 삭제·해제처럼 실제로 손실이나 되돌리기 어려운 결과를 만드는 행동에 사용합니다. 취소·닫기 같은 일반 보조 행동을 Negative로 표시하지 않습니다.', '실행은 button, 목적지가 있는 이동은 href가 있는 a로 구현합니다. button의 type과 기존 form·이벤트·제출값을 유지합니다.', '로딩은 aria-busy와 native disabled로 중복 실행을 막고 기능명을 유지합니다. 비동기 작업은 button을 사용하며 실제 요청·완료·실패 처리는 서비스가 관리합니다. aria-disabled만으로는 링크나 버튼의 동작이 차단되지 않습니다.', '아이콘만 있는 버튼에도 접근 가능한 기능명과 hover·focus 툴팁을 제공합니다. 전체 너비와 아이콘 전용 형태는 명시적인 속성으로 지정합니다.'],
    keyboard: ['button은 Tab으로 이동하고 Enter/Space로 실행합니다. a는 Enter로 이동합니다.', 'native disabled는 실행되지 않으며 Tab 순서에서 제외됩니다. aria-disabled를 사용한 요소는 개발자가 클릭과 키보드 실행을 차단해야 합니다. 로딩 종료 후 초점과 다음 조작 경로를 확인합니다.'],
    checks: [...defaultChecks, '지원하는 다섯 색·형태 조합을 라이트·다크와 hover·pressed·focus·disabled·loading에서 확인합니다.', '긴 문구·아이콘·전체 너비·로딩 전환에서 내용과 클릭 영역이 잘리지 않는지 확인합니다.', 'button type·링크 목적지·기존 제출값이 유지되고 로딩 중 중복 요청이 발생하지 않는지 확인합니다.'],
    specification: [
      ['공통 CSS', 'button-system.css · .dds-button · 기본 Solid / Primary / Medium'],
      ['형태', 'data-variant="solid | outlined" · data-color="primary | assistive | negative" · Outlined negative 미지원'],
      ['Solid Primary', '--primary / --primary-hover / --primary-active · 흰색 / 700 · 기존 대비 예외 유지'],
      ['Solid Assistive', '연한 표면 · 강한 텍스트 / 600'],
      ['Solid Negative', '--destructive 기반 표면 · 흰색 / 700 · 다크 표면은 대비를 보정'],
      ['Outlined Primary', 'Primary 글자 / 600 · 1px Primary 경계'],
      ['Outlined Assistive', '기본 글자색 / 600 · 1px 경계'],
      ['Small', 'data-control-size="sm" · 최소 높이 36px · Label 2 13/18 · 좌우 10px · 아이콘 16px · 간격 6px'],
      ['Medium', 'data-control-size="md" · 최소 높이 44px · Label 1 14/20 · 좌우 12px · 아이콘 18px · 간격 8px'],
      ['Large', 'data-control-size="lg" · 최소 높이 52px · Body 1 Normal 16/24 · 좌우 16px · 아이콘 20px · 간격 8px'],
      ['너비·아이콘', 'data-full-width="true" · data-icon-only="true"'],
      ['로딩 마크업', '.dds-button-label과 .dds-button-loading을 미리 배치해 너비 확보 · 원래 기능명은 aria-label로 유지 · 아이콘 전용은 spinner만 표시'],
      ['로딩·비활성', 'aria-busy="true" + native disabled · 요청 상태는 서비스가 관리'],
      buttonFocus,
    ],
    assets: ['button-system.css', 'button-demos.js', 'button-docs.css', 'icon-tooltips.js'],
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
    rules: ['.dds-content-card 안에 실제 href가 있는 .dds-card-link를 두고 카드 전체에서 같은 목적지로 이동하게 합니다. .dds-card-tools는 대표 링크 바깥의 별도 영역에 둡니다.', '대표 링크 안에 삭제·복사 버튼이나 다른 링크를 중첩하지 않습니다. 보조 행동은 대표 이동과 별도로 실행합니다.', '제목·기업·직무는 식별 정보로 먼저 읽히게 하고 보조 설명과 날짜를 구분합니다.', '상태는 실제 문구와 의미 있는 아이콘으로 표시하고, 문서 수는 실제 데이터를 사용한 개수 배지로 표시합니다.', '이동이나 행동이 없는 정적 카드에는 손 모양 커서·배경 전환·떠오르는 hover 효과를 넣지 않습니다.'],
    keyboard: ['대표 링크와 보조 버튼 각각에 Tab으로 접근합니다. 같은 대표 이동을 불필요하게 중복 초점으로 제공하지 않습니다.'],
    checks: ['카드 빈 공간·제목·보조 버튼과 키보드의 실행 결과가 의도한 기능으로 분리되는지 확인합니다.', '기업·직무와 긴 제목의 가독성, 실제 상태·개수, 정적 카드의 hover, 홀수 개 항목의 반응형 너비를 확인합니다.'],
    specification: [['식별 제목', '.dds-card-title: Body 1 Normal 16/24 / 600 · --text-strong'], ['기업·직무', '.dds-meta-primary: Body 2 Normal 14/22 / 500 · --text-primary'], ['보조정보', '.dds-meta-secondary: Body 2 Normal 14/22 · --text-secondary'], ['날짜', '.dds-meta-date: Caption 1 12/18 · --text-tertiary'], ['행동 구조', '.dds-card-tools는 대표 링크 바깥에 배치 · 대표 링크는 한 번만 초점 이동'], ['카드 배치', '같은 열의 너비 규칙 유지 · 마지막 항목만 100%로 늘리지 않음']],
    assets: [...visibilityAssets, 'icon-tooltips.js'],
  },
  badge: {
    usage: {when: '문서의 실제 처리 상태나 목록의 실제 개수를 짧게 표시할 때 사용합니다.', alternative: '값을 선택하거나 행동을 실행하려면 Chip 또는 Button을 사용합니다.'},
    rules: ['상태와 개수를 구분합니다. 상태는 .dds-status에 실제 상태 문구와 의미 아이콘을 함께 표시합니다.', 'draft·complete·pending·error는 기존 처리 결과에 연결합니다. 색상이나 CSS만으로 저장·완료 상태를 만들지 않습니다.', '개수는 .dds-collection-count에 실제 데이터와 단위를 표시합니다. 장식용 숫자나 임의의 기본 개수를 넣지 않고 실제 0도 표시합니다.'],
    keyboard: ['읽기 전용 상태·개수 배지는 Tab 정지점으로 만들지 않습니다. 색상 없이도 문구로 의미를 알 수 있어야 합니다.'],
    checks: ['실제 상태와 문구·아이콘이 일치하는지, 항목 추가·삭제·필터 변경 후 개수가 갱신되는지 확인합니다.'],
    specification: [['상태', '.dds-status[data-status="draft | complete | pending | error"] · 실제 문구 + 의미 아이콘'], ['개수', '.dds-collection-count · 실제 숫자와 단위 · 0 포함'], ['글자', '일반·상태 배지 Label 2 13/18 / 500 · 개수 배지 13/18 / 600'], ['역할', '배지는 정보 표시 · 독립적인 클릭·hover 행동 없음']],
    assets: visibilityAssets,
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
  const custom = overrides[c.chartFamily || c.id] || {};
  const assets = [...baseAssets, ...(family.assets || [])];
  if (c.added) assets.push('extensions.css', 'extension-demos.js');
  assets.push(...(custom.assets || []));
  const rules = [...(custom.rules || [c.rule || '이 요소의 역할과 사용처를 먼저 정하고 기존 동작에 맞춰 적용합니다.'])];
  if (c.chartNote && !rules.includes(c.chartNote)) rules.push(c.chartNote);
  const specification = (custom.specification || family.specification)
    .filter(([label]) => !c.chartFamily || label !== '종류')
    .map(row => [...row]);
  if (c.chartFamily) specification.push(['표시 방식', c.ko]);
  return {
    usage: {...{when: family.when, alternative: family.alternative}, ...custom.usage},
    rules,
    keyboard: [...(custom.keyboard || family.keyboard)],
    checks: [...(custom.checks || family.checks || defaultChecks)],
    specification,
    assets: [...new Set(assets)],
    assetGroups: {
      service: [...new Set(assets.filter(file => serviceAssets.has(file)))],
      documentation: [...new Set(assets.filter(file => documentationAssets.has(file)))],
      adapter: [...new Set(assets.filter(file => !serviceAssets.has(file) && !documentationAssets.has(file)))],
    },
  };
}

const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
const list = items => `<ul class="plain-list">${items.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;

// Insert inside an existing Usage section. The caller owns headings, IDs and specs.
export function renderComponentContract(c) {
  const contract = componentContract(c);
  return `<h3>선택 기준</h3><div class="table-wrap"><table class="dds-rules-table"><tbody><tr><th scope="row">사용할 때</th><td>${escapeHTML(contract.usage.when)}</td></tr><tr><th scope="row">다른 선택</th><td>${escapeHTML(contract.usage.alternative)}</td></tr></tbody></table></div><h3>동작 규칙</h3>${list(contract.rules)}<h3>키보드</h3>${list(contract.keyboard)}<h3>검수</h3>${list(contract.checks)}`;
}
