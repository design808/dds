import {implementationRules} from './service-guidelines.js?v=bbadd9cd6ada5a3d';

const table = (headings, rows) => `<div class="table-wrap"><table class="dds-rules-table"><thead><tr>${headings.map(text => `<th scope="col">${text}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((text, i) => i ? `<td>${text}</td>` : `<th scope="row">${text}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const section = (title, content) => `<section class="doc-section"><h2>${title}</h2>${content}</section>`;

export function handoffPage() {
  return `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>개발 적용</span></div>
    <div class="page-heading"><div><h1>개발 적용 안내</h1><p class="lead">회사의 기존·신규 서비스에 DDS 디자인 기준을 연결하는 방법.</p></div></div>
    <div class="reading wide">
      ${section('프로젝트에 DDS 등록', `<p><a href="#/setup">AI로 적용하기</a>에서 설정 프롬프트와 고정 버전 파일을 제공합니다. 기준 파일 준비와 AI 규칙 등록 후, 적용할 화면을 지정해 아래 순서로 진행합니다.</p>`)}
      ${section('먼저 읽을 파일', table(['파일', '용도'], [
        ['<a href="./handoff.md" download>handoff.md</a>', '개발자·AI용 적용 지침. 작업 범위와 기준 파일을 먼저 확인합니다.'],
        ['<a href="./data/dds-contracts.json" download>dds-contracts.json</a>', '컴포넌트별 용도·규격·동작·검수. 웹 문서와 같은 데이터에서 생성합니다.'],
        ['<a href="./tokens.css?v=bbadd9cd6ada5a3d" download>tokens.css</a>', '색·간격·형태·입력 크기·모션과 라이트/다크 값. 웹폰트 파일을 함께 배포합니다.'],
        ['<a href="./typography-system.js?v=bbadd9cd6ada5a3d" download>typography-system.js</a>', '서체·크기·행간·굵기·자간이 묶인 글자 역할. 코드와 토큰 표시에도 Pretendard를 사용합니다.'],
        ['<a href="./service-typography.js?v=bbadd9cd6ada5a3d" download>service-typography.js</a>', '서비스 선택자와 글자 역할의 연결 원본. CSS 생성 후 적용합니다.'],
        ['<a href="./visibility.css?v=bbadd9cd6ada5a3d" download>visibility.css</a>', '카드·메타정보·상태·개수·탐색의 공통 표시 규칙. 기존 선택자와 적용 범위를 확인해 연결합니다.'],
        ['<a href="./visibility.js?v=bbadd9cd6ada5a3d" download>visibility.js</a>', '실제 개수와 상태 문구를 표시하는 순수 도움 함수. 기존 데이터 처리와 이벤트를 대신하지 않습니다.']
      ]))}
      ${section('프로젝트에 따른 적용', table(['대상', '적용 방법'], [
        ['기존 서비스 개선', '현재 프레임워크·기능·이벤트를 보존하며 CSS와 필요한 마크업을 연결하고 변경 전 동작과 대조합니다.'],
        ['신규 서비스 구축', '요구사항에 맞춰 화면과 재사용 컴포넌트를 설계하고 DDS 토큰·글자 역할·규격·상태·조작 규칙을 연결합니다. 특정 프레임워크나 기존 서비스 메뉴를 전제로 하지 않습니다.']
      ]) + '<p>딥레쥬메·딥인터뷰 화면은 적용 예시입니다. 콘텐츠·권한·업무 흐름과 기술 환경은 대상 서비스에 맞게 정합니다.</p>')}
      ${section('기존 서비스 개선 순서', table(['단계', '작업'], implementationRules))}
      ${section('카드·상태·목록 규칙', table(['요소', '적용 기준'], [
        ['카드 정보', '식별 제목 16/24/600은 <code>--text-strong</code>, 기업·직무 14/22/500은 <code>--text-primary</code>. 보조 설명 14/22는 <code>--text-secondary</code>, 날짜 12/18은 <code>--text-tertiary</code>.'],
        ['카드 행동', '<code>.dds-content-card</code> 안에 실제 href를 가진 <code>.dds-card-link</code>를 두고 카드 전체를 같은 목적지로 연결합니다. <code>.dds-card-tools</code>는 대표 링크 바깥에 두며 버튼·다른 링크를 대표 링크 안에 중첩하지 않습니다. 이동·실행이 없는 카드는 클릭을 암시하는 hover를 사용하지 않습니다.'],
        ['상태', '<code>.dds-status[data-status]</code>에 실제 상태 문구와 의미 아이콘을 표시합니다. draft·complete·pending·error는 기존 처리 결과에 연결합니다.'],
        ['개수', '<code>.dds-collection-count</code>는 실제 데이터와 단위를 표시합니다. 0도 표시하고 항목 추가·삭제·필터 변경 시 갱신합니다.'],
        ['텍스트형 탐색', '<code>.dds-nav-link</code>는 Label 1 14/20/500과 색상·1px Primary 포커스(offset 0)를 적용합니다. 본문·경로·돌아가기 링크에 hover나 현재 위치 배경을 자동 추가하지 않습니다.'],
        ['메뉴 컨트롤', '<code>.dds-nav-control</code>은 최소 높이 40px·패딩 10px 12px·간격 8px, inline-flex·세로 가운데·시작 정렬을 사용합니다. 단독 사용하거나 <code>.dds-nav-link</code>와 함께 사용할 수 있습니다. 기본 배경은 투명, hover는 <code>--surface</code>, 현재 항목은 <code>--accent</code>입니다.'],
        ['메뉴 상태·배치', '현재 위치는 <code>aria-current="page"</code>로 전달하되 배경을 모든 링크에 강제하지 않습니다. 글자·아이콘 외곽 전체에 내부 패딩을 두고 부모 여백으로 대신하지 않습니다. 사이드바·목차·하위 메뉴는 고유 너비와 밀도를 유지하며 좌우 패딩을 명시합니다. hover·현재·focus에서 크기와 굵기는 유지하고, 탭 선택은 Tabs 규칙을 따릅니다.'],
        ['좁은 화면', '현재 서비스 적용 예시의 GNB는 1180px 이하에서 최소 높이 44px·패딩 12px 12px을 사용합니다. 긴 메뉴명에서도 배경과 클릭 영역이 일치하고 인접 항목을 침범하지 않는지 확인합니다.'],
        ['섹션', '제목 앞 장식 아이콘이나 섹션별 회색 바탕을 추가하지 않습니다. 배경 캔버스가 필요하면 페이지·body 수준에서 정합니다.']
      ]))}
      ${section('변경 범위', table(['대상', '적용 방법'], [
        ['CSS', '기존 선택자에 색·글자·여백·테두리·배치를 연결합니다. 인라인 스타일·유틸리티·!important와의 우선순위를 확인합니다.'],
        ['HTML·아이콘', '레이아웃 래퍼, 라벨, 번역 제외 속성, 아이콘과 읽기 순서를 보완합니다. 이벤트용 id·class·name·data-*와 서버 템플릿 조건을 보존합니다.'],
        ['기존 기능', '인증·권한·AI·저장·결제·녹화는 기존 처리를 유지합니다. 새 인터랙션이나 위젯 교체는 필요한 기능 변경을 별도로 정의합니다.'],
        ['플러그인·출력', '기존 편집기·달력의 DOM과 동적 치수를 확인합니다. 인쇄/PDF, canvas, 외부 iframe은 화면 CSS와 별도로 검수합니다.']
      ]))}
      ${section('파일 연결', `<ul class="plain-list"><li>운영 화면의 기존 선택자에 맞는 스킨 CSS를 작성하고 적용 범위를 제한합니다.</li><li><code>tokens.css</code>와 <code>assets/fonts/pretendard/</code>를 같은 경로 구조로 배포합니다. 기존 전역 변수와 충돌하는지 확인합니다.</li><li><code>visibility.css</code>는 공통 표시 클래스에 연결합니다. <code>visibility.js</code>의 <code>collectionCount(count, {label, unit})</code>와 <code>statusBadge(state, label, renderIcon)</code>에는 기존 데이터·상태·Lucide 렌더러를 전달합니다. 이 파일은 카드 이동이나 저장 이벤트를 자동으로 연결하지 않습니다.</li><li>글자 역할은 대상 서비스의 선택자에 맞게 <code>service-typography.js</code>에서 매핑하고 <code>service-typography.css</code>를 생성합니다. 적용 예시의 매핑을 다른 서비스에 그대로 연결하거나 생성 파일을 직접 편집하지 않습니다.</li><li><code>style.css</code>, <code>app.js</code>, <code>extension-demos.js</code>, <code>document-*.js/css</code>는 DDS 문서용입니다. 운영 서비스에 일괄 추가하지 않습니다.</li><li><code>custom-controls.js</code> 등 위젯 참조 소스는 값·검증·이벤트·초기화 연결을 확인한 뒤 적용합니다.</li></ul><p>컴포넌트의 참조 파일은 <code>assetGroups.service</code>(서비스 기준), <code>documentation</code>(문서 예제 전용), <code>adapter</code>(서비스 연결 검토가 필요한 참조)로 구분합니다. 참조 파일 목록 전체를 운영 설치 목록으로 사용하지 않습니다.</p>`)}
      ${section('선택자 대응표', `<p>대상 화면마다 다음 항목을 기록합니다. 현재 서비스의 선택자는 적용할 템플릿에서 확인합니다.</p>${table(['항목', '기록할 내용'], [
        ['화면', 'URL·템플릿·계정 역할·확인한 상태'],
        ['스타일 연결', '기존 선택자 → DDS 컴포넌트·글자 역할·토큰'],
        ['보존할 연결', '필드 id/name·제출값·이벤트·서버 조건·동적 속성'],
        ['변경·검수', 'CSS/HTML/기능 변경 구분·검수 환경·결과·미확인 항목']
      ])}`)}
      ${section('생성과 검사', `<pre><code>npm run typography:build
npm run handoff:build
npm run check
npm run typography:check -- --css &lt;서비스 CSS 경로&gt;</code></pre><p>자동 검사 후 실제 화면에서 저장·재진입·오류·권한·동적 항목을 확인합니다. 문서의 로컬 예제는 운영 서비스 통합 검증을 대신하지 않습니다. <a href="#/process">대표 검증 시나리오</a>와 <a href="#/foundations/accessibility">접근성 기준</a>을 함께 확인합니다.</p>`)}
      ${section('적용할 디자인 결정', `<ul class="plain-list"><li>Primary #FFAD31. Primary 채움 글자 흰색·700. 일반 글자 굵기는 400–700.</li><li>입력 Small 36px/14px, Medium 44px/16px, Large 52px/16px. 글자·패딩·아이콘 크기를 함께 적용합니다.</li><li>입력 포커스는 전체 외곽 1px Primary·offset 0. 활성 칩은 Primary 글자·테두리.</li><li>모달 패딩 24px. 아이콘 전용 버튼에는 기능 이름과 hover·focus 툴팁.</li><li>흰 글자/Primary 대비 1.86:1과 운영체제 동작 줄이기 설정을 따르지 않는 모션은 기존 확정 예외입니다.</li></ul><p class="helper">제공 범위: 디자인 기준·로컬 예제. 운영용 스킨과 Figma 라이브러리는 별도 작업입니다. 전달 데이터에 포함된 원본 사용처는 2026-09-16 조사 기준이므로 현재 소스에서 다시 확인합니다.</p>`)}
    </div>`;
}
