# DDS 프로젝트 설정 프롬프트

DDS 0.2.0. 대상 프로젝트의 파일을 읽고 수정할 수 있는 AI에게 아래 내용을 전달합니다.

이 프로젝트의 디자인 기준을 DDS(Deep Design System) 0.2.0으로 설정해줘. 기준 파일 준비, AI 프로젝트 규칙 등록, 적용 기록까지 완료해서 이후에는 "DDS 써" 또는 "디자인 시스템 써"라고 요청해도 이 버전을 사용하게 해줘. 이 요청은 기준 설정이며, 기존 서비스 화면을 일괄 수정하는 요청은 아니야. 화면을 지정해 적용해 달라고 하면 아래 절차로 진행해줘.

고정 버전 참조
- 매니페스트: https://design808.github.io/dds/releases/0.2.0/manifest.json
- 기준 묶음: https://design808.github.io/dds/releases/0.2.0/bundle.json
- 준비 도구: https://design808.github.io/dds/releases/0.2.0/dds-install.js
- 웹 안내: https://design808.github.io/dds/#/setup
- 보충 참조: https://design808.github.io/dds/llms.txt
보충 참조와 웹사이트는 이후 변경될 수 있어. 설치 기준은 0.2.0 매니페스트와 묶음으로 고정하고 임의 업그레이드하지 마. 이 묶음은 프레임워크 독립적인 디자인 기준·참조 소스이며, 완성된 운영 UI 라이브러리는 아니야.

1. 현재 프레임워크·패키지 관리자·CSS 로딩 순서·기존 테마·경로 별칭·AI 지침·Git 변경 상태를 확인해줘. 현재 서비스의 URL→view→template→include→JS 연결을 실제 소스에서 확인하고 수정 중인 파일은 유지해줘. React·Tailwind·새 프레임워크를 전제로 설치하거나 마이그레이션하지 마. 딥레쥬메에서는 기존 Django 템플릿과 jQuery·Bootstrap·편집기 처리를 유지해줘.

2. 같은 DDS 버전이 준비되어 있으면 파일 해시와 수정 여부를 확인해서 재사용해줘. 없으면 위 세 파일을 내려받고 매니페스트의 버전·SHA-256·파일 목록을 검증해줘. Node.js 18 이상과 파일 수정 도구가 있다면 준비 도구를 먼저 읽고 아래 명령의 경로를 환경에 맞춰 실행해줘. 첫 명령의 결과를 확인한 뒤 두 번째를 실행해줘.
node dds-install.js --version 0.2.0 --bundle bundle.json --manifest manifest.json --target docs/dds/0.2.0 --dry-run
node dds-install.js --version 0.2.0 --bundle bundle.json --manifest manifest.json --target docs/dds/0.2.0
도구는 기준 파일만 준비해. 기존 파일이 다르면 덮어쓰지 말고 차이를 보고해줘. 접근 실패나 해시 불일치 시 추측한 코드로 대신하지 마. 접근 가능한 같은 버전 파일을 요청해줘. 새 의존성 설치나 별도 컴포넌트 설치 명령은 필요 없어.

3. 실제 AI가 읽는 기존 프로젝트 지침 파일에 다음 규칙을 한 번만 병합해줘. 기존 규칙은 보존하고 모든 AI 도구의 설정 파일을 무작정 만들지 마. 지침 파일이 없으면 현재 AI가 읽는 파일 하나만 만들어줘. 아래의 docs 경로는 이 프로젝트에서 선택한 실제 경로에 맞게 수정해줘.
"사용자가 'DDS 써', '디자인 시스템 써', 'use DDS', 'use the design system'이라고 하면 이 프로젝트에 등록된 DDS 0.2.0을 사용한다. 먼저 프로젝트 기록 docs/dds-adoption.md와 기준 파일 docs/dds/0.2.0/dds-adoption.md, docs/dds/0.2.0/handoff.md, docs/dds/0.2.0/data/dds-contracts.json을 읽는다. 기존 프레임워크·기능·사용자 수정을 유지하고 고정 버전의 토큰·글자 역할·컴포넌트 규칙을 재사용한다. 문서용 CSS·데모 JS를 운영 화면에 연결하지 않는다. 버전을 자동 변경하거나 기능 검증 없이 서비스 적용 완료라고 기록하지 않는다."
현재 AI가 어느 지침을 읽는지 확인할 수 없으면 자동 활성화됐다고 말하지 말고 규칙과 수동 시작 경로를 알려줘.

4. docs/dds-adoption.md에 버전·매니페스트/묶음 SHA-256·파일 위치·AI 지침 위치·현재 프레임워크·토큰/폰트 연결 여부·적용한 화면·검수 결과·남은 제한을 기록해줘. DDS-REFERENCE.json의 referencePrepared와 runtimeIntegrated/rulesRegistered 상태를 혼동하지 마. 기준 파일 준비, 규칙 등록, 화면 디자인 적용, 기능 검증을 각각 구분해줘. 기준 설정만 요청받았으면 여기까지 하고 기존 서비스 화면은 바꾸지 마.

5. 화면 적용을 요청받으면 우선 기존 선택자에 범위를 제한한 스킨 CSS를 작성해줘. CSS만으로 부족한 레이아웃은 필요한 래퍼·라벨·아이콘·번역 제외 속성 등 HTML을 보완하되 읽기 순서도 맞춰줘. id/name/value/data-*·버튼 type·form·CSRF·서버 템플릿 조건·이벤트·DOM 탐색 관계·동적 속성·제출 payload를 보존해줘. 클래스나 속성을 디자인 전용이라고 추정하지 마. DOM 이동·속성 순서까지 참조하는 코드가 있는지 검색해줘. 인증·권한·저장·AI·번역·결제·녹화 처리 변경이 필요하면 영향과 대안을 제시하고 그 변경에 한해서 확인받아줘. 이미 승인된 범위는 계속 진행해줘.

6. tokens.css는 전역 :root 값을 포함하므로 바로 운영에 연결하지 마. 기존 CSS 변수와 reset·인라인 스타일·!important 충돌을 확인한 뒤 페이지에 한정한 어댑터로 필요한 토큰을 연결해줘. 폰트와 라이선스는 상대경로를 유지해 함께 배포하고 Pretendard를 한 번만 로드해줘. Primary #FFAD31·채움 라벨 흰색/700, 일반 텍스트 최대 굵기 700, 명명된 글자 역할, 입력 Small 36px/14px·Medium 44px/16px·Large 52px/16px를 유지해줘. 포커스는 박스 전체 1px Primary·offset 0, 활성 칩은 Primary 글자·경계, 모달 패딩 24px야. 아이콘은 Lucide 원본을 사용하고 아이콘 전용 동작에는 접근 가능한 이름과 hover/focus 툴팁을 붙여줘. 색이나 크기를 임의로 재해석하지 마.

7. 라이트·다크 토큰과 현재 DDS의 light 기본값·사용자 선택 저장 방식을 보존해줘. 기존 테마 구현이 있다면 먼저 통합 지점을 확인하고 provider나 토글을 중복 추가하지 마. 서비스명과 언어 원문은 translate="no"와 notranslate로 보호하되 기존 번역 연결은 유지해줘. 흰 글자/Primary 대비 1.86:1과 OS 동작 줄이기를 따르지 않는 모션은 현재 확정 예외로 기록하고 접근성 충족으로 보고하지 마.

8. style.css·app.js·document-*·extension-demos.js 등 DDS 문서/데모 파일과 prototypes의 가짜 저장/AI 동작을 운영에 복사하지 마. custom-controls.js는 운영 어댑터가 아니야. 기존 모달·select·달력·편집기를 우선 유지하고, 교체 시 원본 값·required·reset·input/change·포커스·동적 항목·날짜 min/max의 초기값 및 이후 변경을 별도로 검증해줘. 예제를 클릭해 본 것만으로 기능 보존을 완료 처리하지 마.

9. 프로젝트에서 사용 가능한 관련 검사와 화면 검수를 실행해줘. PC·모바일·라이트·다크·키보드·긴 값·빈 값·오류·모달을 확인하고 저장·재진입·제출값·권한·동적 필드·인쇄/PDF 등 변경 영향이 있는 기능을 기존 동작과 대조해줘. 실제 저장·AI 생성·유료 호출·업로드·녹화는 승인된 테스트 환경에서만 확인하고, 확인하지 못한 브라우저나 기능은 미검증으로 남겨줘. 적용 파일과 검수 결과를 기록하고 실패한 검사나 남은 어댑터 작업을 숨기지 마. 운영 배포는 별도 승인 범위를 따라줘.
