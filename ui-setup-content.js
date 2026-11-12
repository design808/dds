import {UI_VERSION} from './ui/version.js?v=124c9ad30d73cda6';
export const ddsRelease=UI_VERSION;
export const ddsSite='https://design808.github.io/dds/';
export const ddsReleaseURL=`${ddsSite}releases/${ddsRelease}/`;
const ddsShellRule='Top navigation은 전체 헤더 폭의 부모에 연결하고 하단 경계는 바깥 헤더에 유지한다. 내부 최대 폭(좌우 여백 포함)·여백은 부모의 --dds-topnav-content-width·--dds-topnav-gutter로 정하며 100vw나 음수 여백으로 부모를 벗어나지 않는다. 서비스 화면의 테마 전환은 푸터에 아이콘 버튼 하나로 두고 기존 provider·저장 키를 재사용하며 상태별 기능 이름과 hover·키보드 탐색 툴팁을 제공한다. DDS 문서 사이트의 상단 테마 버튼은 문서 탐색용이며 서비스 헤더에 복사하지 않는다. 열린 모달의 제목·본문·행동 간격은 원본을 따르고 문서 견본의 상하 margin을 복사하지 않는다.';
const ddsBlockRule='새 페이지나 큰 레이아웃 변경에서는 ui/composition.md의 블록 선택 기준을 읽고 https://design808.github.io/dds/#/blocks 에서 관련 구성 예시를 확인한다. 구분선형 목록은 https://design808.github.io/dds/#/blocks?block=job-list 를 참고한다. 블록은 정보 배치와 컴포넌트 조합의 참고이며 설치용 컴포넌트 원본이 아니다. 블록의 문서용 CSS·스크립트·축소 배치·예제 문구를 서비스에 복사하지 않고 설치 버전의 UI 원본과 실제 콘텐츠로 구성한다. 웹 블록이 더 최신이면 설치 버전에서 지원하는 부분만 사용한다. 접근할 수 없으면 확인했다고 하지 않고 설치한 ui/composition.md의 구성 기준으로 진행한다.';

const ddsScrollCheckRule='컴포넌트를 변경하면 실제 페이지에서 사용하는 변형·활성·키보드 초점과 긴 문구를 320px·390px·PC에서 확인한다. 탭은 항목이 넘칠 때의 가로 스크롤만 허용하며 밑줄·초점 때문에 생긴 세로 스크롤은 수정한다. 문서 CSS 없는 서비스 화면도 검수하고 overflow:hidden으로 감추지 않는다.';

const ddsMetricRule='대시보드 현황은 Card·Icon과 ui/index.js의 metricContent/metricTrend 공용 조합을 사용한다. 항목 아이콘, 실제 현재/이전 값과 비교 기준을 연결하고 증가·감소 방향과 긍정·부정 색상을 분리한다. 이탈률처럼 낮을수록 좋은 값은 better:lower를 명시하고, 비교 없음·이전 값 0·변화 없음을 실제 상태대로 표시한다. ui/composition.md의 대시보드 현황 규칙을 따른다.';

const ddsCanvasRule='저장 프로필의 pageBackground는 밝은 모드의 화면 배경이다. 다크 모드 배경은 #17191C로 고정한다. pageBackgroundDark는 이전 프로필을 읽기 위한 호환 필드이며 과거 선택값은 적용하지 않는다. ui/profile.js와 canvasTextTokens가 --page-background와 필요한 보조 글자 대비를 생성하며 전역은 body, 범위 방식은 .dds-ui 안의 실제 페이지 상자에 data-dds-page를 지정해 연결한다. 카드·입력·모달·헤더의 --background/--surface와 입력 placeholder는 유지하고 양쪽 모드에서 글자·경계를 확인한다.';

export const ddsProjectRule=`사용자가 'DDS 써', '디자인 시스템 써', 'use DDS', 'use the design system'이라고 하면 이 프로젝트에 등록된 DDS ${ddsRelease}의 실제 UI 원본을 사용한다. 회사의 기존·신규 서비스에 공통 적용하며 프로젝트의 프레임워크와 기능을 유지한다. 먼저 docs/dds-adoption.md에 기록한 설치 위치의 ui/README.md, ui/composition.md, ui/registry.json, ui/templates/<component-id>.html, ui/dds.css와 data/dds-contracts.json을 읽는다. docs/dds-profile.json이 있으면 저장한 색상·제목/본문 서체·기능 색상·화면 배경과 생성 CSS를 재사용한다. 새 페이지 구축이나 큰 레이아웃 변경은 같은 설치 위치의 skills/dds-page-design/SKILL.md와 연결된 참고 문서를 읽고 화면 목적·정보 우선순위·구조 대안·브라우저 시각 검토 절차를 적용한다. 스킬을 지원하지 않는 AI도 이 파일을 직접 읽어 같은 절차를 따른다. 작은 컴포넌트 수정이나 백엔드 작업에 전체 설계 절차를 강제하지 않는다. 새 디자인 시스템이나 외부 색상·서체·스타일 프리셋을 생성하지 않는다. 토큰·설명만 보고 컴포넌트를 새로 그리지 않는다. 같은 렌더러·CSS와 공식 variants를 사용하되 견본의 예제 문구·도움말·개수·묶음 배치는 복사하지 않는다. 필요한 내용은 text/attributes/slots/items/tabs/data로 연결하고 optional로 보조 항목을 선택한다. 컨트롤 높이·글자·내부 패딩·색·경계·모서리·상태는 DDS 규격을 유지하고, 가용 폭·페이지 그리드·외부 여백·필요한 영역 높이는 서비스가 정한다. 입력·목록·탭 본문은 부모 폭을 사용하고 버튼·아이콘·달력·팝업의 공식 고유 크기와 화면 경계 제한은 유지한다. 문서의 440px 폭 제한·가운데 정렬·축소·견본 미디어 프레임은 복사하지 않는다. ui/index.js의 createComponent/mountDDS 또는 같은 원본의 프레임워크 어댑터를 사용한다. 기존 위젯을 이중 초기화하지 않고 ID/name/value/CSRF/이벤트/권한/제출값을 보존한다. 문서용 app.js·style.css·component-specimens.css·예제 동작은 운영에 연결하지 않는다. 부모 폭 240·320·510·800px와 Grid/Flex에서 모달 필드·2열 각 셀·실제 미디어의 폭 적응을 확인한다. 등록 버전·원본 해시·저장 프로필·실제 연결과 검수 결과를 기록하고 자동 업그레이드하지 않는다. ${ddsShellRule} ${ddsBlockRule} ${ddsScrollCheckRule} ${ddsMetricRule} ${ddsCanvasRule}`;

export const ddsSetupPrompt=`이 프로젝트의 기본 디자인 시스템을 DDS(Deep Design System) ${ddsRelease}로 설정해줘. DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스를 포함해 회사 서비스 전반에서 사용하는 공통 시스템이야. 이후 신규 서비스 구축이나 기존 서비스 개선에서 컴포넌트 페이지와 같은 UI 원본·내부 디자인 규격을 사용하게 해줘. 문서의 폭과 정렬은 서비스 배치로 복사하지 마.

고정 버전
- 매니페스트: ${ddsReleaseURL}manifest.json
- 원본 묶음: ${ddsReleaseURL}bundle.json
- 준비 도구: ${ddsReleaseURL}dds-install.js
- 웹 문서: ${ddsSite}#/components
설치 기준은 위 버전의 매니페스트와 묶음이야. 현재 웹 문서가 더 최신이어도 임의 업그레이드하지 마.

1. 프로젝트의 프레임워크·패키지 관리자·스타일 방식·테마·정적 자산 경로·AI 지침·Git 변경 상태를 먼저 확인해줘. 기존 사용자 수정과 개발 기능을 보존해줘. 특정 프레임워크나 다른 디자인 시스템을 새로 설치하지 마. 기존 서비스 개선과 신규 서비스 구축에 맞는 연결 방법을 선택해줘.

2. 같은 DDS 버전이 있으면 해시와 수정 여부를 검증해 재사용해줘. 없으면 위 세 파일을 내려받아 버전·SHA-256·파일 목록을 확인하고 아래 명령의 경로를 실제 환경에 맞춰 실행해줘. 첫 결과를 확인한 뒤 두 번째를 실행해줘.
node dds-install.js --version ${ddsRelease} --bundle bundle.json --manifest manifest.json --target docs/dds/${ddsRelease} --dry-run
node dds-install.js --version ${ddsRelease} --bundle bundle.json --manifest manifest.json --target docs/dds/${ddsRelease}
기존 파일이 다르면 덮어쓰지 마. 이 도구는 UI 원본과 기준 파일을 준비하며 앱 연결·AI 규칙 등록·기능 통합까지 자동 완료하지는 않아.

3. 설치 위치의 ui/README.md, ui/composition.md, ui/registry.json, 필요한 ui/templates/<id>.html, 해당 renderer, ui/dds.css를 읽어줘. skills/dds-page-design/SKILL.md와 skills/dds-page-design/references/page-design.md도 함께 준비돼. 이 skill은 화면 설계 절차이며 디자인 시스템을 생성하지 않아. registry의 115종은 컴포넌트 페이지와 같은 core.js·extended.js·button.js·charts.js에서 생성돼. 원본 클래스·CSS와 공식 variants를 재사용해줘. 템플릿의 예제 문구·도움말·날짜·개수·묶음 배치는 필수가 아니야. 실제 콘텐츠와 필요한 항목만 넣고 참조 데이터나 가짜 완료 상태를 남기지 마.

4. 프로젝트의 기존 정적 자산/번들 처리에 UI 모듈과 폰트·라이선스·마스크 자산을 같은 상대 경로로 연결해줘. 신규 시스템은 tokens.css 다음 ui/dds.css를 로드하고, 기존 서비스의 CSS 변수와 충돌하면 ui/tokens-scoped.css를 대신 사용해줘. component-layout.css는 ui/dds.css에 포함돼 있으니 중복 로드하지 마. .dds-ui 범위를 유지하고 기존 테마를 연결해줘. createComponent(id, {variants, optional, text, attributes, slots, props, items, tabs, data})와 mountDDS(root)를 쓰거나 같은 원본을 현재 프레임워크 문법으로 연결해줘. 도움말은 text.hint를 전달할 때만 표시하고, 필요 없는 보조 항목은 optional:{hint:false}처럼 해당 파트의 false로 생략해줘. 일반 모달은 slots.content에 서비스 본문을 넣고 실제 영상은 slots.media로 연결해줘. 입력·목록·탭 본문은 부모 폭을 사용하고 모달의 필드는 본문 폭, 2열 필드는 각 셀 폭을 채우게 해줘. 버튼·아이콘·달력·팝업의 공식 고유 크기는 유지해줘. 필요한 스크롤 영역 높이는 부모의 --dds-scroll-height/--dds-scroll-max-height로 정하고 기본 auto/none에 견본 높이를 강제하지 마. 서버 템플릿에서도 optional 파트를 조건부 출력하되 선택한 변형의 구조·클래스·고유 ID와 라벨/aria 참조를 유지해줘. React/Vue 등은 수명주기에 맞춰 초기화·cleanup을 연결해줘. 문서용 style.css/app.js/extension-demos.js와 SDK에 없는 component-specimens.css를 운영에 복사하지 마.
${ddsShellRule} ${ddsBlockRule} ${ddsScrollCheckRule} ${ddsMetricRule} ${ddsCanvasRule}

5. mountDDS는 UI 상태만 처리하고 저장·AI·업로드·결제·인증을 수행하지 않아. onAction 또는 dds:action에서 서비스의 기존 함수를 연결해줘. 이미 달력/select/편집기가 있으면 controls:false로 시작해 이중 초기화를 막고 기존 위젯과 DDS 외형의 어댑터를 확인해줘. id/name/value/data-*·form·CSRF·이벤트·DOM 관계·동적 속성·권한·제출 payload를 보존해줘. 날짜 min/max의 초기값과 이후 갱신, reset/required/input/change/disabled/readonly도 확인해줘. 기능 연결 전에 성공 상태나 가짜 데이터를 넣지 마.

6. 실제 AI가 읽는 기존 프로젝트 지침 한 곳에 아래 규칙을 병합하고 기존 지침을 유지해줘. 여러 AI용 파일을 무작정 만들지 마. docs 경로는 선택한 실제 경로로 맞춰줘.
"${ddsProjectRule}"
스킬을 지원하는 AI라면 그 AI가 실제로 읽는 프로젝트 스킬 폴더 한 곳에 skills/dds-page-design 폴더 전체를 복사하거나 연결해줘. 이미 같은 내용이 있으면 재사용하고 수정된 파일은 덮어쓰지 마. 여러 AI용 폴더를 무작정 만들지 마. 등록한 스킬에서 원본 설치 위치와 저장 프로필을 찾을 수 있도록 위 적용 기록을 함께 연결해줘. 스킬 미지원 환경에서는 위 규칙을 통해 원본 SKILL.md를 직접 읽으면 돼. 어떤 지침을 읽는지 확인할 수 없으면 자동 등록됐다고 말하지 말고 수동 시작 경로를 알려줘. 파일 준비와 스킬 등록 완료를 구분해줘.

7. docs/dds-adoption.md에 버전·매니페스트/묶음 해시·원본 경로·정적 자산 URL·CSS/테마/폰트/모듈 연결·AI 지침 위치·스킬 등록 위치·컴포넌트별 어댑터·검수 결과를 기록해줘. DDS-REFERENCE.json은 파일 준비 시점의 기록으로 유지하고, 실제 앱 연결·규칙/스킬 등록·화면 적용·기능 검증은 docs/dds-adoption.md에 별도로 기록해줘. pageDesignSkillIncluded는 스킬 원본 포함 여부이며 등록 완료를 뜻하지 않아. 기준 설정만 요청받았으면 기존 화면을 임의로 리디자인하지 말고 원본 연결과 재사용 준비를 확인한 뒤 마무리해줘.

8. 새 페이지 구축이나 큰 레이아웃 변경을 요청받으면 등록한 dds-page-design 절차를 실행해줘.
화면 목적과 정보 우선순위를 정하고, 적합한 참고 자료에서 배치 근거를 살펴보고, 중요한 구조 선택은 실제 콘텐츠로 비교한 뒤 DDS로 구현해줘. PC·모바일의 실제 렌더링을 보고 위계·밀도·빈 공간과 사용 흐름을 다듬어줘. 설계 메모는 제품 화면에 넣지 마. 검색 자료는 참고 후보이며 검색 순위나 업종명만으로 화면 구성을 강제하지 마. 내부 규격과 저장한 색상·서체는 유지하되 가용 폭·그리드·외부 여백·영역 높이는 서비스에 맞게 설계해줘. 문서의 440px 제한·가운데 정렬·축소·견본 미디어 프레임은 가져오지 마. 저장 프로필이 없으면 기본 DDS를 사용해줘. 초기 설정만 요청받았으면 이 절차로 화면을 임의 생성하지 마.

9. 연결한 UI와 ui/templates의 원본에서 계산된 글자 역할·컨트롤 높이·내부 패딩·색·경계·모서리·아이콘을 대조해줘. 외부 폭과 영역 높이는 문서 견본이 아니라 서비스 부모를 기준으로 검수해줘. 부모 폭 240·320·510·800px와 Grid/Flex에서 모달의 전체 폭 필드·2열의 각 필드·실제 이미지/영상 슬롯이 가용 영역을 사용하는지 확인해줘. 320px·390px·PC, 라이트·다크, 긴 문구·빈 값·오류·대기, 키보드·열기/닫기·초점 복귀·폼의 실제 제출 값과 서비스 주요 작업을 검수해줘. 표·차트·칸반의 필요한 스크롤은 내부에 두고 페이지 overflow:hidden으로 잘림을 숨기지 마. 프로젝트의 의존성·타입·빌드 검사와 요구사항과 API 계약에 맞는 기능 검증을 실행해줘. 기존 CSS가 내부 규격을 덮으면 연결 범위와 우선순위를 해결해줘. Primary 흰색 대비1.86:1과 OS 동작 줄이기를 따르지 않는 모션은 확정 예외이며 접근성 충족으로 보고하지 마. 실제 브라우저/기능을 확인하지 못했으면 미검증으로 남겨줘. 운영 배포는 승인된 범위에 따라줘.

주소나 같은 버전 파일에 접근할 수 없으면 원본을 추측해 만들거나 설치했다고 말하지 마. 접근 가능한 배포 주소 또는 같은 버전 파일을 요청해줘. 설정 프롬프트를 읽은 것과 UI가 실제 프로젝트에 연결된 것은 별개야.`;
