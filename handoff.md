# DDS 개발 적용 안내

DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스를 포함한 회사 서비스 공통 디자인 시스템입니다.
토큰·글자 역할·컴포넌트 규칙은 공유하고, 콘텐츠·정보 구조·업무 흐름·기술 환경은 서비스별로 정합니다.
컴포넌트 문서와 서비스가 같은 UI 원본을 사용합니다. 115개 컴포넌트의 HTML 템플릿, 범위가 지정된 CSS와 생성·동작 API를 제공합니다.
문구·데이터·요청·저장·권한은 서비스에 연결해야 하며, UI 원본 제공이 해당 서비스의 기능 통합 완료를 뜻하지는 않습니다.
현재 조사와 화면 예시는 딥레쥬메·딥인터뷰 중심이며, 그 메뉴·회원 역할·선택자를 다른 서비스의 필수 구조로 취급하지 않습니다.

## 프로젝트 설정

AI 설정 프롬프트는 https://design808.github.io/dds/#/setup 에서 제공합니다.
DDS 0.6.16의 고정 참조 묶음은 releases/0.6.16/manifest.json과 bundle.json을 기준으로 확인합니다.
기준 파일 준비·프로젝트 규칙 등록·서비스 화면 적용·기능 검증은 각각 기록합니다.
자세한 연결 방법은 dds-adoption.md를 읽습니다. 기준 설정만 요청한 작업에서 기존 서비스 파일을 수정하지 않습니다.

## 먼저 읽을 파일

- public/ui/README.md: 현재 프레임워크와 기존 템플릿에 연결하는 방법.
- public/ui/registry.json: 115개 컴포넌트의 원본·템플릿·수정 가능한 파트·의존성.
- public/ui/templates/<id>.html: 서비스와 문서가 함께 사용하는 컴포넌트 HTML.
- public/ui/tokens-scoped.css, public/ui/dds.css: .dds-ui 범위에 연결할 토큰과 컴포넌트 CSS.
- public/ui/index.js: createComponent, componentSource, mountDDS와 cleanup API.
- public/ui/source.js: 같은 HTML을 생성하는 renderComponentSource·serviceMarkup·componentParts.
- public/tokens.css: 색상·간격·형태·컨트롤 크기·모션과 라이트/다크 값.
- public/typography-system.js: 크기·행간·굵기·자간이 묶인 글자 역할.
- public/service-typography.js: 서비스 선택자별 역할 원본. scripts/service-typography.mjs로 CSS 생성.
- public/visibility.css: 카드·텍스트·상태·개수·탐색에 필요한 공통 표시 클래스.
- public/visibility.js: 선택적인 collectionCount/statusBadge 순수 마크업 함수. 기존 데이터·상태·Lucide 렌더러를 전달.
- public/button-system.css: Solid·Outlined 버튼의 크기·색·상태·아이콘·전체 너비 스타일.
- public/content-primitives.css: 목록 셀·섹션 헤더·Bottom navigation·Command·Fallback view·표의 공통 스타일.
- public/component-contracts.js: 컴포넌트 선택·조작·규격·검수 기준.
- public/service-guidelines.js: 폼·오류·번역·서비스 패턴의 처리 기준.
- public/data/dds-contracts.json: 위 문서와 같은 데이터에서 생성한 전체 규칙.
- AGENTS.md: 저장소의 수정·검증 규칙.

## 프로젝트에 따른 적용

- 기존 서비스 개선: 현재 프레임워크·기능·이벤트를 보존하며 UI 원본의 클래스·구조와 CSS를 연결합니다. 필요한 HTML 보완은 기존 id·name·값·CSRF·이벤트 관계를 유지하고 변경 전 동작과 대조합니다.
- 신규 서비스 구축: 요구사항에 맞춰 정보 구조와 화면 배치를 정하고 같은 UI 원본을 조합합니다. 컴포넌트의 폰트·패딩·경계·모서리·상태 CSS를 비슷하게 다시 만들지 않습니다.
- React·Vue 등은 현재 프레임워크 안에서 API를 연결하거나 같은 템플릿을 프레임워크 문법으로 옮깁니다. Django 등 서버 템플릿도 같은 HTML과 CSS를 사용합니다.
- 서비스별 기술과 주요 작업은 프로젝트 기록에 남깁니다. 신규 기능은 요구사항과 API 계약으로 검증합니다.

## 기존 서비스 개선 순서

1. UI 원본: ui/registry.json과 ui/README.md에서 컴포넌트·파트·의존성을 확인합니다. ui/templates의 HTML 또는 ui/index.js의 createComponent를 사용하고 ui/tokens-scoped.css·ui/dds.css·.dds-ui 범위를 유지합니다. 문서와 같은 원본을 재사용하며 모양이 비슷한 UI를 따로 만들지 않습니다.
2. 토큰과 글자: 색·간격·컨트롤 값의 원본은 tokens.css, 글자 역할은 typography-system.js입니다. service-typography.js는 현재 적용 예시의 매핑이므로 대상 서비스의 사용처에 맞춰 연결합니다. UI 원본의 크기·패딩·모서리·경계를 임의로 바꾸지 않습니다.
3. 적용 범위: 대상 URL·템플릿·기존 선택자·상태 클래스·필드 id/name·연결 이벤트를 먼저 기록합니다. CSS 변경과 HTML 보완을 구분합니다.
4. 콘텐츠 연결: createComponent의 text·attributes·slots 또는 기존 템플릿 바인딩으로 문구·링크·이름·입력값·개수·상태를 실제 데이터로 바꿉니다. 반복 인스턴스의 id와 for·aria 참조는 고유하게 유지합니다. 텍스트를 HTML로 실행하지 않습니다.
5. UI 동작: mountDDS는 선택·탭·열기와 닫기·초점 등 UI 상태를 연결합니다. 저장·AI·결제·업로드·권한은 dds:action이나 onAction에서 서비스의 기존 처리 함수와 연결합니다. 성공 상태는 실제 처리 결과를 받은 뒤 표시합니다.
6. 초기화와 해제: 현재 위젯이 있는 곳은 controls:false로 시작해 중복 초기화를 막습니다. 컨트롤 향상이 필요하면 명시한 root에 연결하고, 화면을 제거할 때 cleanup을 호출해 이벤트·관찰자·포털을 정리합니다. custom-controls.js의 문서 전체 자동 변환은 서비스에 연결하지 않습니다.
7. 상태 보존: 권한·hidden·disabled·로딩·오류는 기존 로직에서 결정합니다. CSS로 숨겨진 기능을 강제로 노출하거나 데이터를 만들어 채우지 않습니다.
8. 정보 위계: 카드 제목 16/24/600은 --text-strong, 기업·직무 14/22/500은 --text-primary, 보조 설명 14/22는 --text-secondary, 날짜 12/18은 --text-tertiary로 연결합니다.
9. 카드 행동: 대표 이동은 실제 href가 있는 카드 전체 링크로 연결하고 보조 행동은 대표 링크 바깥에 둡니다. 정적 카드에 클릭을 암시하는 hover를 넣지 않습니다.
10. 탐색 표현: .dds-nav-link는 글자·색·포커스만 적용하고 배경을 자동 추가하지 않습니다. 배경이 필요한 메뉴에는 .dds-nav-control을 사용해 글자·아이콘 전체에 패딩과 클릭 영역을 확보합니다. 부모 여백은 항목 내부 패딩을 대신하지 않습니다.
11. 탐색 상태: 메뉴 컨트롤은 최소 높이 40px·패딩 10px 12px·간격 8px을 기본으로 합니다. 현재 서비스 적용 예시의 GNB는 1180px 이하에서 최소 높이 44px·패딩 12px 12px을 사용합니다. 현재 위치는 aria-current로 전달하며 hover·현재·focus에서 크기와 굵기를 유지합니다.
12. 공통 스타일: 목록 셀·섹션 헤더·하단 탐색·명령 검색·오류 대체 화면·표도 ui/dds.css와 원본 HTML의 클래스를 그대로 사용합니다. 문서의 축소 미리보기 크기는 복사하지 않습니다. 라우팅·검색·재시도 등 실제 처리는 서비스 로직에 연결합니다.
13. 반응형 배치: 페이지뿐 아니라 실제 컴포넌트 컨테이너의 320px·390px·전환 경계에서 확인합니다. flex/grid의 본문은 min-width:0, 아이콘·스위치·아바타는 수축하지 않게 하고 긴 제목·행동은 줄바꿈합니다. 표·차트·칸반의 필요한 가로 스크롤만 해당 영역 안에 둡니다.
14. 간격과 팝업: 제목과 개수는 8px, 오류 설명과 복구 행동은 20px을 둡니다. 검색 아이콘·입력·지우기는 한 외곽 안에 정렬합니다. 펼친 메뉴는 화면 가장자리에서 위치를 조정하고, 문서 프레임이나 서비스 래퍼가 잘라내지 않는지 확인합니다.
15. 상태·개수: 처리 상태는 실제 문구와 의미 아이콘, 목록 개수는 실제 데이터의 배지로 표시합니다. 항목 추가·삭제·필터 변경 시 개수도 갱신합니다.
16. 섹션 구성: 섹션 제목에 장식 아이콘을 넣거나 섹션마다 회색 바탕의 틀을 추가하지 않습니다. 배경 캔버스가 필요하면 페이지·body 수준에서 정합니다.
17. 검수: PC·모바일, 라이트·다크, 긴 제목·빈 값·오류·대기·동적 항목에서 확인합니다. 계산된 폰트·색·경계·패딩·높이를 UI 원본과 대조하고 기존 CSS의 덮어쓰기를 해결합니다. 메뉴의 hover·현재 위치·focus, 키보드 순서와 실제 제출 값을 변경 전과 대조합니다.
18. 완료 보고: 수정 파일·선택자 매핑·화면별 검수 결과·미검증 항목을 남깁니다. 예제 표시와 실서비스 검증 완료를 구분합니다.

## 디자인 결정

- 모든 텍스트·코드·토큰·숫자 표시는 Pretendard와 --font-sans 사용. 별도 고정폭 폰트 없음.
- Primary #FFAD31; Primary 채움 글자 흰색·700. 대비 1.86:1의 기존 예외 유지.
- 일반 글자 굵기 400–700. 장식 예외는 대상·이유 기록.
- Small 입력 36px/14px, Medium 44px/16px, Large 52px/16px.
- 버튼 Solid Primary·Assistive·Negative / Outlined Primary·Assistive. 크기 36/44/52px와 글자 13/14/16px. 기본 600, Solid Primary·Negative 700. 실제 비동기 상태는 서비스에서 관리.
- 입력 외곽 포커스 1px Primary·offset 0; 활성 칩 Primary 글자·경계.
- 모달 패딩 24px. 아이콘 전용 버튼에는 기능 이름과 hover·focus 툴팁.
- 문서 카드 제목 16/24/600 Strong, 기업·직무 14/22/500 Primary, 보조정보 14/22 Secondary, 날짜 12/18 Tertiary.
- 상태는 실제 라벨·의미 아이콘, 목록 개수는 실제 데이터의 배지. 변경 뒤에도 갱신.
- 이동 카드의 실제 링크는 전체 영역에 연결하고 보조 동작은 링크 바깥에 분리. 정적 카드는 클릭 hover 없음.
- 섹션 제목 장식 아이콘과 회색 섹션·목록 트레이 없음. 배경 캔버스는 페이지/body에서 결정.
- 현재 DDS는 운영체제 동작 줄이기 설정을 따르지 않음.

## 적용 파일 구분

- UI 폴더와 registry에 기록된 의존성·폰트·아이콘 자산의 상대 경로를 함께 유지합니다. ui/tokens-scoped.css 다음에 ui/dds.css를 연결하고 .dds-ui 범위를 유지합니다.
- 템플릿을 사용하거나 createComponent로 같은 HTML을 생성합니다. 반복 인스턴스는 고유 ID와 for·aria 참조를 유지하고 문구·링크·날짜·개수·상태는 실제 서비스 데이터로 바꿉니다. 차트 생성에는 실제 항목·계열·단위를 data로 전달합니다.
- mountDDS는 UI의 선택·탭·열기와 닫기·초점을 연결합니다. dds:action 또는 onAction에서 기존 저장·AI·결제·업로드·계정 처리 함수를 연결하고 처리 결과에 따라 상태를 갱신합니다. 화면을 제거할 때 cleanup을 호출합니다.
- 기존 선택기·달력·에디터가 있는 화면은 controls:false로 시작해 이중 초기화를 막습니다. 컨트롤 향상을 직접 연결하면 ui/controls.js의 mountControls를 지정한 root에 사용하고 해제 시 cleanup을 호출합니다. id·name·값·min/max·검증·폼 reset·기존 이벤트를 확인합니다.
- tokens.css, visibility.css, button-system.css, content-primitives.css는 UI 스타일을 만드는 규칙 원본입니다. 서비스의 기본 연결은 ui/dds.css를 사용하며 같은 스타일을 중복 연결하지 않습니다. visibility.js는 실제 데이터로 상태·개수 마크업을 만들며 저장이나 권한을 처리하지 않습니다.
- 서비스의 페이지 배치와 기존 CSS 우선순위를 확인합니다. 글자 역할 매핑이 필요하면 현재 선택자에 맞춰 생성하고 service-typography.css를 직접 편집하지 않습니다.
- 컴포넌트 계약의 source·serviceAssets는 재사용할 UI 원본·API·템플릿을 연결합니다. assetGroups의 documentation은 문서 전용이며 adapter는 개별 연결 검토 대상입니다. 원본 파일 일부만 복사해 의존성을 빠뜨리지 않습니다.
- document-shell.js, style.css, app.js, extension-demos.js, preview-layout.js, button-demos.js, button-docs.css, custom-controls.js는 문서 셸·문서 자동 동작용입니다. 서비스에는 연결하지 않습니다.
- research-data/의 기존 사용처는 정적 검출 후보입니다. 확인하지 않은 선택자를 임의로 채우지 않습니다.
- 원본 인벤토리는 2026-09-16 / 8e913146 기준입니다. 현재 checkout과 자동 동기화되지 않으므로 대상 템플릿과 선택자를 현재 소스에서 다시 확인합니다.

## 변경 기록에 남길 항목

URL / 템플릿 / 기존 선택자 / DDS 컴포넌트 / 적용 토큰 / 보존한 id·name·이벤트 / CSS·HTML 변경 / 검수 결과.

## 검증

- DDS UI 원본을 변경했다면 npm run ui:build로 CSS·registry·HTML을 갱신합니다.
- npm run typography:build
- npm run check
- npm run typography:check -- --css <서비스에 추가한 CSS 경로>
- 대상 화면에서 320px·390px·PC·라이트·다크·긴 내용·오류·키보드·동적 항목을 확인합니다. 계산된 폰트·색·경계·패딩·높이를 문서의 같은 컴포넌트와 대조합니다.
- 반복 mount의 이벤트 중복, cleanup 후 포털·이벤트 정리, 범위 밖 입력의 변화 유무와 폼 reset·실제 FormData를 확인합니다.
- 저장·AI·업로드·권한·출력은 기존 기능과 대조합니다. 문서 예제 클릭만으로 완료 처리하지 않습니다.
- 현재 공통 브라우저 검수 환경은 Chromium입니다. Firefox·Safari·다른 OS는 별도 확인 대상입니다.

이 파일과 dds-contracts.json은 npm run handoff:build로 생성합니다.
