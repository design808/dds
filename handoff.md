# DDS 개발 적용 안내

일반회원·컨설턴트의 기존 화면에 DDS 디자인을 적용할 때 읽습니다.
현재 제공물은 디자인 기준과 로컬 예제입니다. 운영용 UI 패키지나 검증된 서비스 스킨은 아직 없습니다.

## 프로젝트 설정

AI 설정 프롬프트는 https://design808.github.io/dds/#/setup 에서 제공합니다.
DDS 0.2.0의 고정 참조 묶음은 releases/0.2.0/manifest.json과 bundle.json을 기준으로 확인합니다.
기준 파일 준비·프로젝트 규칙 등록·서비스 화면 적용·기능 검증은 각각 기록합니다.
자세한 연결 방법은 dds-adoption.md를 읽습니다. 기준 설정만 요청한 작업에서 기존 서비스 파일을 수정하지 않습니다.

## 먼저 읽을 파일

- public/tokens.css: 색상·간격·형태·컨트롤 크기·모션과 라이트/다크 값.
- public/typography-system.js: 크기·행간·굵기·자간이 묶인 글자 역할.
- public/service-typography.js: 서비스 선택자별 역할 원본. scripts/service-typography.mjs로 CSS 생성.
- public/component-contracts.js: 컴포넌트 선택·조작·규격·검수 기준.
- public/service-guidelines.js: 폼·오류·번역·서비스 패턴의 처리 기준.
- public/data/dds-contracts.json: 위 문서와 같은 데이터에서 생성한 전체 규칙.
- AGENTS.md: 저장소의 수정·검증 규칙.

## 적용 순서

1. 기준 파일: 색·간격·컨트롤 값은 tokens.css, 글자 역할은 typography-system.js, 서비스 사용처는 service-typography.js를 읽습니다. 문서 예제를 새 값의 근거로 삼지 않습니다.
2. 적용 범위: 대상 URL·템플릿·기존 선택자·상태 클래스·필드 id/name·연결 이벤트를 먼저 기록합니다. CSS 변경과 HTML 보완을 구분합니다.
3. 상태 보존: 권한·hidden·disabled·로딩·오류는 기존 로직에서 결정합니다. CSS로 숨겨진 기능을 강제로 노출하거나 데이터를 만들어 채우지 않습니다.
4. 검수: PC·모바일, 라이트·다크, 긴 제목·빈 값·오류·대기·동적 항목에서 확인합니다. 키보드 순서와 실제 제출 값을 변경 전과 대조합니다.
5. 완료 보고: 수정 파일·선택자 매핑·화면별 검수 결과·미검증 항목을 남깁니다. 예제 표시와 실서비스 검증 완료를 구분합니다.

## 디자인 결정

- 모든 텍스트·코드·토큰·숫자 표시는 Pretendard와 --font-sans 사용. 별도 고정폭 폰트 없음.
- Primary #FFAD31; Primary 채움 글자 흰색·700. 대비 1.86:1의 기존 예외 유지.
- 일반 글자 굵기 400–700. 장식 예외는 대상·이유 기록.
- Small 입력 36px/14px, Medium 44px/16px, Large 52px/16px.
- 입력 외곽 포커스 1px Primary·offset 0; 활성 칩 Primary 글자·경계.
- 모달 패딩 24px. 아이콘 전용 버튼에는 기능 이름과 hover·focus 툴팁.
- 현재 DDS는 운영체제 동작 줄이기 설정을 따르지 않음.

## 적용 파일 구분

- tokens.css와 같은 경로의 assets/fonts/pretendard/를 함께 배포합니다.
- 기존 선택자에 맞는 스킨 CSS와 타이포그래피 매핑을 작성합니다. 생성된 service-typography.css는 직접 편집하지 않습니다.
- style.css, app.js, extension-demos.js, preview-layout.js는 DDS 문서와 예제용입니다. 운영 서비스에 통째로 추가하지 않습니다.
- custom-controls.js는 원본 입력 옆에 UI를 생성합니다. 기존 위젯 교체 시 필드·이벤트·검증·초기화 연결을 별도 확인합니다.
- research-data/의 기존 사용처는 정적 검출 후보입니다. 확인하지 않은 선택자를 임의로 채우지 않습니다.
- 원본 인벤토리는 2026-09-16 / 8e913146 기준입니다. 현재 checkout과 자동 동기화되지 않으므로 대상 템플릿과 선택자를 현재 소스에서 다시 확인합니다.

## 변경 기록에 남길 항목

URL / 템플릿 / 기존 선택자 / DDS 컴포넌트 / 적용 토큰 / 보존한 id·name·이벤트 / CSS·HTML 변경 / 검수 결과.

## 검증

- npm run typography:build
- npm run check
- npm run typography:check -- --css <서비스에 추가한 CSS 경로>
- 대상 화면에서 PC·모바일·라이트·다크·긴 내용·오류·키보드·동적 항목을 확인합니다.
- 저장·AI·업로드·권한·출력은 기존 기능과 대조합니다. 문서 예제 클릭만으로 완료 처리하지 않습니다.
- 현재 공통 브라우저 검수 환경은 Chromium입니다. Firefox·Safari·다른 OS는 별도 확인 대상입니다.

이 파일과 dds-contracts.json은 npm run handoff:build로 생성합니다.
