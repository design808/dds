export const ddsRelease = '0.2.6';
export const ddsSite = 'https://design808.github.io/dds/';
export const ddsReleaseURL = `${ddsSite}releases/${ddsRelease}/`;

export const ddsProjectRule = `사용자가 'DDS 써', '디자인 시스템 써', 'use DDS', 'use the design system'이라고 하면 이 프로젝트에 등록된 DDS ${ddsRelease}을 사용한다. DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스를 포함한 회사 서비스 공통 디자인 시스템이다. 먼저 프로젝트 기록 docs/dds-adoption.md와 기준 파일 docs/dds/${ddsRelease}/dds-adoption.md, docs/dds/${ddsRelease}/handoff.md, docs/dds/${ddsRelease}/data/dds-contracts.json, docs/dds/${ddsRelease}/visibility.css를 읽는다. 공통 토큰·글자 역할·컴포넌트 규칙을 재사용하되 서비스의 기술 환경·콘텐츠·업무 흐름에 맞춰 구현한다. 표면·제목·핵심정보·날짜·상태·보조동작의 역할을 구분하고 visibility.css의 필요한 공통 스타일을 서비스 스킨에 연결한다. .dds-nav-link는 글자·색·focus만 제공하고 배경은 추가하지 않는다. 배경이 있는 탐색은 .dds-nav-control의 높이·패딩·정렬·상태를 함께 적용한다. 모바일 헤더는 로고 왼쪽·44px 이상 메뉴 버튼 오른쪽으로 구성하고 언어·프로필은 같은 펼침 패널 안에 둔다. 접힌 메뉴의 초점을 제외하고 Escape·초점 복귀·전환 너비 양쪽을 검수한다. 섹션 제목에 장식 아이콘을 추가하거나 섹션을 회색 배경으로 감싸지 않는다. 기존 서비스는 프레임워크·기능·사용자 수정을 보존하고, 신규 서비스는 합의된 기술과 요구사항에 맞춰 구성한다. 문서용 CSS·데모 JS를 운영 화면에 연결하지 않는다. 버전을 자동 변경하거나 기능 검증 없이 서비스 적용 완료라고 기록하지 않는다.`;

export const ddsSetupPrompt = `이 프로젝트의 디자인 기준을 DDS(Deep Design System) ${ddsRelease}로 설정해줘. DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스를 포함해 회사 서비스 전반에서 사용하는 공통 디자인 시스템이야. 특정 서비스의 프레임워크·메뉴·업무 흐름을 다른 프로젝트의 기본값으로 가져오지 마.

기준 파일 준비, AI 프로젝트 규칙 등록, 적용 기록까지 완료해서 이후에는 "DDS 써" 또는 "디자인 시스템 써"라고 요청해도 이 버전을 사용하게 해줘. 이 요청은 디자인 기준 설정이야. 서비스 구현이나 기존 화면 변경은 후속 요청의 범위에 맞춰 진행해줘.

고정 버전 참조
- 매니페스트: ${ddsReleaseURL}manifest.json
- 기준 묶음: ${ddsReleaseURL}bundle.json
- 준비 도구: ${ddsReleaseURL}dds-install.js
- 웹 안내: https://design808.github.io/dds/#/setup
- 보충 참조: https://design808.github.io/dds/llms.txt
보충 참조와 웹사이트는 이후 변경될 수 있어. 설치 기준은 ${ddsRelease} 매니페스트와 묶음으로 고정하고 임의 업그레이드하지 마. 이 묶음은 프레임워크 독립적인 디자인 기준·참조 소스이며, 완성된 운영 UI 라이브러리는 아니야.

1. 서비스 이름·대상 사용자·주요 작업과 기존 서비스 개선인지 신규 구축인지 먼저 확인해줘. 프레임워크·패키지 관리자·스타일 방식·테마·경로 별칭·AI 지침·Git 변경 상태를 실제 프로젝트에서 확인하고 사용자 수정을 유지해줘. 기존 서비스는 현재 기술 환경과 기능을 보존해줘. 신규 프로젝트는 사용자 요구와 저장소 기준에 맞는 기술을 사용하고, 아직 결정되지 않았다면 선택 근거를 기록해줘. DDS를 이유로 특정 프레임워크를 강제하거나 기존 환경을 교체하지 마.

2. 같은 DDS 버전이 준비되어 있으면 파일 해시와 수정 여부를 확인해서 재사용해줘. 없으면 위 세 파일을 내려받고 매니페스트의 버전·SHA-256·파일 목록을 검증해줘. Node.js 18 이상과 파일 수정 도구가 있다면 준비 도구를 먼저 읽고 아래 명령의 경로를 환경에 맞춰 실행해줘. 첫 명령의 결과를 확인한 뒤 두 번째를 실행해줘.
node dds-install.js --version ${ddsRelease} --bundle bundle.json --manifest manifest.json --target docs/dds/${ddsRelease} --dry-run
node dds-install.js --version ${ddsRelease} --bundle bundle.json --manifest manifest.json --target docs/dds/${ddsRelease}
도구는 기준 파일만 준비해. 기존 파일이 다르면 덮어쓰지 말고 차이를 보고해줘. 접근 실패나 해시 불일치 시 추측한 코드로 대신하지 마. 접근 가능한 같은 버전 파일을 요청해줘. 새 의존성 설치나 별도 컴포넌트 설치 명령은 필요 없어.

3. 실제 AI가 읽는 기존 프로젝트 지침 파일에 다음 규칙을 한 번만 병합해줘. 기존 규칙은 보존하고 모든 AI 도구의 설정 파일을 무작정 만들지 마. 지침 파일이 없으면 현재 AI가 읽는 파일 하나만 만들어줘. 아래의 docs 경로는 이 프로젝트에서 선택한 실제 경로에 맞게 수정해줘.
"${ddsProjectRule}"
현재 AI가 어느 지침을 읽는지 확인할 수 없으면 자동 활성화됐다고 말하지 말고 규칙과 수동 시작 경로를 알려줘.

4. docs/dds-adoption.md에 서비스 이름·기존 개선/신규 구축 구분·버전·매니페스트/묶음 SHA-256·파일 위치·AI 지침 위치·기술 환경·토큰/폰트/공통 가시성 스타일 연결 여부·적용한 화면·검수 결과·남은 제한을 기록해줘. DDS-REFERENCE.json의 referencePrepared와 runtimeIntegrated/rulesRegistered 상태를 혼동하지 마. 기준 파일 준비, 규칙 등록, 화면 디자인 적용, 기능 검증을 각각 구분해줘. 기준 설정만 요청받았으면 여기까지 하고 서비스 구현이나 기존 화면 변경은 시작하지 마.

5. 구현을 요청받으면 공통 디자인 기준과 서비스 고유 기능을 구분해줘. 기존 서비스 개선은 현재 라우트·템플릿 또는 컴포넌트·이벤트 연결을 조사하고, 범위를 제한한 CSS부터 적용해줘. 레이아웃에 필요한 HTML이나 컴포넌트 마크업은 읽기 순서를 맞춰 보완해줘. id/name/value/data-*·form·CSRF·이벤트·DOM 탐색·조건부 렌더링·동적 속성·제출 payload를 보존해줘. 신규 서비스는 요구사항에 맞춰 화면 구조와 재사용 컴포넌트를 설계하고 DDS 규칙을 연결해줘. 신규 구현을 CSS 교체에만 제한하지 마. 적용 예시의 메뉴·회원 역할·자기소개서·면접 기능은 해당 서비스의 사례이므로 다른 서비스에 그대로 복제하지 마. 기존 인증·권한·데이터 처리 변경이 필요하면 영향과 대안을 제시하고 그 변경에 한해서 확인받아줘. 이미 승인된 범위는 계속 진행해줘.

6. tokens.css는 전역 :root 값을 포함하므로 대상 환경의 CSS 변수·reset·인라인 스타일·!important 충돌을 확인해줘. 기존 서비스는 적용 범위를 제한한 어댑터로 연결하고, 신규 서비스는 공통 스타일 진입점에 토큰과 글자 역할을 연결해줘. visibility.css의 필요한 클래스와 토큰·마크업을 서비스 루트 범위의 스킨 또는 재사용 컴포넌트에 연결해줘. visibility.js는 선택적인 개수·상태 마크업 helper이며 상태 관리나 이벤트를 제공하지 않아. 필요한 상태 아이콘은 서비스의 Lucide renderer를 주입하고 DDS 문서용 icons.js는 import하지 마. 문서용 style.css를 가져와 외형을 맞추지 마. 제목은 강한 텍스트, 핵심정보는 기본 텍스트, 날짜와 부가정보는 보조 텍스트 역할로 구분해줘. 밀도 높은 문서 카드 제목은 Body 1 Normal/600, 식별 메타정보는 Body 2 Normal/500을 사용하고 모든 카드에 큰 제목 역할을 일괄 적용하지 마. 카드 경계·그림자·호버·포커스, 상태 라벨, 목록 개수, 탐색 선택 상태는 공통 기준을 재사용해줘. 이동 카드의 주동작은 카드 전체의 실제 링크로 제공하고 메뉴·삭제 같은 보조동작은 링크와 분리해줘. 정적 카드를 클릭 가능한 것처럼 꾸미거나 상태·개수를 장식용 고정값으로 넣지 마. 섹션 제목 장식 아이콘과 회색 섹션 래퍼는 추가하지 마. 페이지 바탕 변경이 필요하면 body 또는 페이지 루트에서 정하고 기존 배경을 임의로 바꾸지 마. 폰트와 라이선스는 상대경로를 유지해 함께 배포하고 Pretendard를 한 번만 로드해줘. Primary #FFAD31·채움 라벨 흰색/700, 일반 텍스트 최대 굵기 700, 명명된 글자 역할, 입력 Small 36px/14px·Medium 44px/16px·Large 52px/16px를 유지해줘. 포커스는 박스 전체 1px Primary·offset 0, 활성 칩은 Primary 글자·경계, 모달 패딩 24px야. 아이콘은 Lucide 원본을 사용하고 아이콘 전용 동작에는 접근 가능한 이름과 hover/focus 툴팁을 붙여줘. 서비스별 차이가 필요하면 대상·이유·영향을 기록하고 디자인 결정을 먼저 확인해줘. 색이나 크기를 임의로 재해석하지 마.

탐색은 텍스트 링크와 배경이 있는 컨트롤을 구분해줘. .dds-nav-link는 글자·색·focus만 제공하며 hover·현재 위치에 배경을 자동으로 칠하지 않아. 본문·히어로·푸터·뒤로가기·앵커 링크에도 임의의 배경을 추가하지 마. 배경이 필요한 항목에만 .dds-nav-control을 명시해줘. 기본은 최소 높이 40px·패딩 10px 12px·간격 8px·가운데 수직 정렬이고, hover는 surface·현재 위치는 accent·focus는 Primary 1px/offset 0이야. 같은 GNB의 링크와 버튼에는 같은 클릭 영역을 제공해줘. 현재 서비스 적용 예시는 1180px 이하에서 모바일 메뉴로 전환하고 최소 높이 44px·패딩 12px 12px를 사용해. 새 서비스의 전환 너비는 메뉴·로고·서체에 맞춰 정하되 CSS와 드롭다운 JS의 기준을 일치시켜줘. 사이드바·목차·하위메뉴는 고유한 밀도를 유지할 수 있지만 배경을 쓰면 양옆 패딩을 확보해줘. 실제 계산된 높이·패딩·정렬과 hover·현재 위치·focus에서의 레이아웃 이동을 확인해줘.

버튼은 button-system.css의 .dds-button을 재사용해줘. Solid는 primary·assistive·negative, Outlined는 primary·assistive만 사용하고 지원하지 않는 조합을 추측해 만들지 마. 기본은 Solid/Primary/Medium이며 Small·Medium·Large는 높이 36/44/52px와 글자 13/14/16px를 함께 적용해줘. 같은 행동 영역의 주 행동은 하나만 두고 Negative는 실제 파괴 행동에만 사용해줘. 이동은 a, 실행은 button을 사용하며 비동기 작업은 aria-busy와 native disabled로 중복 실행을 막아줘. aria-disabled만으로 동작이 막히지는 않아. 로딩의 실제 요청·완료·오류와 기능명·초점 처리는 서비스에서 유지하고 button-demos.js·button-docs.css는 운영에 연결하지 마.

모바일 상단 내비게이션은 로고와 맨 오른쪽 햄버거만 첫 줄에 남겨줘. 언어·프로필·로그아웃은 같은 펼침 패널 안에 두고 접힌 항목은 Tab 초점에서도 제외해줘. 전환 너비는 콘텐츠에 맞춰 정하되 CSS와 JS에서 같은 기준을 사용해줘. 320px과 전환 경계에서 열기·닫기·Escape·초점 복귀를 확인해줘.

7. 라이트·다크 토큰과 light 기본값을 유지하고 사용자가 선택한 모드를 저장해줘. 저장 키와 테마 연결 방식은 대상 서비스에 맞춰 정하고, 기존 구현이 있으면 통합해 provider나 토글을 중복 추가하지 마. 번역 기능이 있는 서비스에서는 서비스명과 언어 원문을 translate="no"와 notranslate로 보호하고 기존 번역 연결을 유지해줘. 모든 서비스에 번역 기능이나 특정 저장 키를 강제로 추가하지 마. 흰 글자/Primary 대비 1.86:1과 OS 동작 줄이기를 따르지 않는 모션은 현재 확정 예외로 기록하고 접근성 충족으로 보고하지 마.

8. style.css·app.js·document-*·extension-demos.js 등 DDS 문서/데모 파일과 prototypes의 가짜 저장/AI 동작을 운영에 복사하지 마. custom-controls.js는 범용 운영 컴포넌트가 아닌 참조 구현이야. 기존 위젯을 교체하거나 신규 컨트롤을 구현하면 원본 값·required·reset·input/change·포커스·동적 항목·날짜 min/max의 초기값 및 이후 변경을 해당 기능에 맞춰 검증해줘. 예제를 클릭해 본 것만으로 운영 동작을 완료 처리하지 마.

9. 프로젝트에서 사용 가능한 관련 검사와 화면 검수를 실행해줘. PC·모바일·라이트·다크·키보드·긴 값·빈 값·오류·모달과 해당 서비스의 주요 작업 흐름을 확인해줘. 제목·핵심정보·보조정보의 글자 역할과 실제 계산값, 카드와 배경의 구분, hover/focus/선택/비활성 상태의 시인성을 대조해줘. 카드 전체 이동과 보조동작이 충돌하지 않고 목록 개수와 상태가 추가·복사·삭제·필터 후 실제 데이터와 맞는지 확인해줘. 기존 서비스는 변경 전 동작과 대조하고, 신규 서비스는 요구사항과 API 계약을 기준으로 검증해줘. 저장·AI 생성·유료 호출·업로드·녹화 등은 해당 기능이 있는 경우에만 승인된 테스트 환경에서 확인해줘. 확인하지 못한 브라우저나 기능은 미검증으로 남기고 실패한 검사나 남은 작업을 숨기지 마. 운영 배포는 별도 승인 범위를 따라줘.`;

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section = (title, body) => `<section class="doc-section"><h2>${title}</h2>${body}</section>`;

export function setupPage() {
  return `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>개발 적용</span></div>
    <div class="page-heading"><div><h1>AI로 적용하기</h1><p class="lead">회사의 기존·신규 서비스에 DDS 기준과 적용 규칙을 등록합니다.</p></div><span class="badge">DDS ${ddsRelease}</span></div>
    <div class="reading wide">
      ${section('프로젝트 설정', `<p>DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스를 포함한 회사 서비스 공통 디자인 시스템입니다. 색상·타이포그래피·컴포넌트 규칙을 함께 사용하고, 화면 구조와 업무 흐름은 서비스의 목적에 맞게 구성합니다.</p><p>아래 프롬프트를 대상 프로젝트의 파일을 읽고 수정할 수 있는 AI에게 전달합니다. 프로젝트 지침에 규칙을 등록하면 <strong>“DDS 써”</strong>라고 요청해 지정한 버전을 사용할 수 있습니다.</p><div class="demo-row"><button type="button" class="btn primary" data-copy="${esc(ddsSetupPrompt)}">설정 프롬프트 복사</button><a class="btn" href="./dds-setup.md" download>프롬프트 내려받기</a></div><details><summary>프롬프트 전체 보기</summary><pre tabindex="0" aria-label="DDS 프로젝트 설정 프롬프트"><code>${esc(ddsSetupPrompt)}</code></pre></details>`)}
      ${section('설정과 서비스 적용', `<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">단계</th><th scope="col">완료 기준</th></tr></thead><tbody><tr><th scope="row">기준 준비</th><td>고정 버전 파일을 내려받고 SHA-256을 확인합니다. 서비스 구현은 시작하지 않습니다.</td></tr><tr><th scope="row">규칙 등록</th><td>대상 프로젝트에서 AI가 읽는 지침에 DDS 사용 규칙을 등록합니다.</td></tr><tr><th scope="row">화면 적용</th><td>대상 서비스의 기술 환경과 화면 구조에 공통 토큰·컴포넌트 규칙을 연결합니다.</td></tr><tr><th scope="row">기능 검증</th><td>기존 서비스는 변경 전 동작과 대조하고, 신규 서비스는 요구사항과 API 계약에 맞는지 확인합니다.</td></tr></tbody></table></div><p>현재 제공물은 디자인 기준과 참조 소스입니다. 기준 파일 준비만으로 운영 서비스에 디자인이나 기능이 연결되지는 않습니다.</p>`)}
      ${section('서비스별 적용 방법', `<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">대상</th><th scope="col">적용 방법</th></tr></thead><tbody><tr><th scope="row">기존 서비스 개선</th><td>현재 프레임워크와 기능을 보존하며 CSS부터 연결합니다. 레이아웃에 필요한 마크업은 보완하고 기존 이벤트·데이터 연결을 검증합니다.</td></tr><tr><th scope="row">신규 서비스 구축</th><td>요구사항에 맞춰 화면과 재사용 컴포넌트를 설계하고 DDS 토큰·글자 역할·상태·조작 규칙을 적용합니다. 특정 프레임워크나 기존 서비스의 메뉴 구성을 전제로 하지 않습니다.</td></tr></tbody></table></div><p>서비스별 콘텐츠·권한·업무 흐름은 해당 프로젝트에서 정합니다. 문서의 딥레쥬메·딥인터뷰 화면은 적용 예시이며 다른 서비스가 따라야 하는 화면 구조는 아닙니다. <a href="#/handoff">개발 적용 안내</a>에서 연결과 검수 기준을 확인합니다.</p>`)}
      ${section('고정 버전 파일', `<p>${ddsRelease}은 회사 서비스 공통 적용 지침과 카드·텍스트·상태·탐색의 공통 기준을 담은 참조 묶음입니다. 웹 문서는 계속 갱신되지만 이미 선택한 버전은 자동 변경하지 않습니다. 이전 공개 버전은 보존합니다.</p><ul class="plain-list"><li><a href="/releases/${ddsRelease}/manifest.json" download>manifest.json</a> — 버전·파일 목록·SHA-256</li><li><a href="/releases/${ddsRelease}/bundle.json" download>bundle.json</a> — 토큰·가시성 스타일·규칙·차트 참조·폰트·라이선스</li><li><a href="/releases/${ddsRelease}/dds-install.js" download>dds-install.js</a> — Node.js 18 이상에서 기준 폴더 준비</li><li><a href="./dds-adoption.md" download>dds-adoption.md</a> — 기존·신규 서비스 적용 지침</li><li><a href="./llms.txt">llms.txt</a> · <a href="./llms-full.txt">llms-full.txt</a> — AI용 문서</li></ul><p>준비 도구는 지정한 폴더에 기준 파일만 저장합니다. 앱·의존성·AI 지침을 자동 수정하거나 다른 파일을 덮어쓰지 않습니다.</p>`)}
    </div>`;
}
