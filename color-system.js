import {contrast} from './color-contrast.js?v=f6c1f153a6058e30';
import {textColorSection,textScaleSection,textScaleMapping} from './text-colors.js?v=f6c1f153a6058e30';
export {contrast};
export const brandScale=[['50','#FFF9EF'],['100','#FFF0D6'],['200','#FFDFA8'],['300','#FFCA7A'],['400','#FFBE5C'],['500','#FFAD31'],['600','#FF941A'],['700','#E8750A'],['800','#C24C00'],['900','#A83D00'],['950','#8A2E00']];

const sections=[['color-principles','기준과 원칙'],['color-scales','색상 스케일'],['color-roles','역할별 토큰'],['color-usage','화면 적용'],['color-contrast','대비와 검수']];
const heading=(index,description)=>`<header class="color-section-heading"><span>0${index+1}</span><div><h2>${sections[index][1]}</h2><p>${description}</p></div></header>`;
const tokenTable=(rows,caption)=>`<div class="table-wrap color-token-table"><table><caption class="sr-only">${caption}</caption><thead><tr><th scope="col">역할 / 토큰</th><th scope="col">Light</th><th scope="col">Dark</th><th scope="col">사용 원칙</th></tr></thead><tbody>${rows.map(([name,token,light,dark,usage])=>`<tr><th scope="row">${name}<br><button class="token-copy" data-copy="var(${token})" aria-label="${token} 토큰 복사"><code>${token}</code></button></th><td><span class="color-dot" style="background:${light}"></span><code>${light}</code></td><td><span class="color-dot" style="background:${dark}"></span><code>${dark}</code></td><td>${usage}</td></tr>`).join('')}</tbody></table></div>`;

export function colorPage(){
 const rows=[
 ['페이지 기본 면','--workspace-background','#FFFFFF','#17191C','본문 전체의 색상 틴트를 제거한 기본 면'],
 ['공통 푸터','--footer-background','transparent','transparent','배경 채움 없이 상단 경계로 구분'],
 ['입력 경계','--control-border','#C2C7CF','#626A76','입력·선택 위치를 구획용 선보다 선명하게 표시'],
 ['구획 경계','--border','#E4E6EA','#353A43','카드·구분선의 낮은 강조'],
 ['브랜드·주 행동','--primary','#FFAD31','#FFAD31','브랜드 앵커는 두 테마에서 동일'],
 ['주 행동 글자','--primary-foreground','#FFFFFF','#FFFFFF','브랜드 결정 · 흰색 / weight 700'],
 ['호버','--primary-hover','#FF941A','#FFBE5C','라이트는 짙게, 다크는 밝게'],
 ['누르는 중','--primary-active','#E8750A','#FFCA7A','호버 다음 단계의 피드백'],
 ['주 행동 경계','--primary-border','transparent','transparent','채움색으로 구분 · 진한 테두리 없음'],
 ['브랜드 텍스트','--brand-ink','#C24C00','#FFBE5C','링크·아이콘·작은 강조 문구'],
 ['선택 배경','--accent','#FFF9EF','#3C2013','선택된 메뉴·칩의 약한 면'],
 ['선택 글자','--accent-foreground','#C24C00','#FFBE5C','선택 배경과 함께 사용'],
 ['키보드 포커스','--ring','#FFAD31','#FFAD31','1px Primary 경계 · offset 0']
 ];

 return `<div class="color-docs">
  <nav class="color-page-nav" aria-label="색상 문서 목차">${sections.map(([id,label],index)=>`<button data-scroll="${id}"><span>0${index+1}</span>${label}</button>`).join('')}</nav>
  <section id="color-principles" class="color-doc-section">
    ${heading(0,'기준색을 정하고, 역할에 따라 화면에 적용합니다.')}
    <div class="color-token-flow"><span>원색 스케일 <code>--brand-500</code></span><span aria-hidden="true">→</span><span>역할 토큰 <code>--primary</code></span><span aria-hidden="true">→</span><span>컴포넌트 <code>주 행동 버튼</code></span></div>
    <div class="color-intro-grid">
      <div class="brand-anchor"><span class="color-anchor-label">브랜드 기준색 · Brand 500</span><strong>#FFAD31</strong><p>주 행동과 브랜드 강조에 사용합니다.</p><button class="btn" data-copy="#FFAD31">HEX 복사</button></div>
      <div class="color-principles">
        <article><h3>역할로 선택</h3><p>브랜드는 주 행동, 중립색은 본문·배경, 상태색은 완료·주의·오류·정보에 사용합니다.</p></article>
        <article><h3>주 행동은 하나</h3><p>같은 행동 영역의 채워진 Primary 버튼은 하나만 둡니다. 보조 행동은 중립색으로 구분합니다.</p></article>
        <article><h3>테마에 맞게 연결</h3><p>스케일 값은 고정하고 역할 토큰을 전환합니다. 화면에는 HEX 대신 역할 토큰을 연결합니다.</p></article>
        <article><h3>색과 문구를 함께</h3><p>상태명·아이콘·밑줄을 함께 사용합니다. 선택 상태와 경고 상태는 구분합니다.</p></article>
      </div>
    </div>
  </section>
  <section id="color-scales" class="color-doc-section">
    ${heading(1,'브랜드와 텍스트의 원색을 확인하고 토큰을 복사합니다.')}
    <section class="color-subsection"><h3>Brand scale</h3><p>500은 확정 기준색입니다. 600–950은 채도를 유지하면서 붉은 기가 있는 짙은 주황색으로 이어집니다. 단계 번호는 동일한 명도 간격을 뜻하지 않습니다.</p>
      <div class="brand-ramp">${brandScale.map(([n,h])=>`<button data-copy="var(--brand-${n})" class="ramp-swatch ${n==='500'?'anchor':''}" aria-label="Brand ${n}, ${h}, 색상 토큰 복사" style="--swatch:${h};--swatch-ink:${n==='500'?'#FFFFFF':contrast(h,'#252D3A')>=4.5?'#252D3A':'#FFFFFF'}"><span>${n}</span><b>${h}</b>${n==='500'?'<small>PRIMARY</small>':''}</button>`).join('')}</div>
    </section>
    ${textScaleSection({includeMapping:false})}
  </section>
  <section id="color-roles" class="color-doc-section">
    ${heading(2,'같은 역할은 라이트·다크 모드에서도 같은 토큰을 사용합니다.')}
    <section class="color-subsection"><h3>행동·선택·포커스</h3><p>채움, 내부 글자, 상호작용 상태를 한 묶음으로 적용합니다.</p>${tokenTable(rows.slice(4),'행동과 선택의 테마별 토큰')}</section>
    ${textColorSection({includeScale:false,headingLevel:3})}
    <details class="color-detail"><summary>텍스트 역할과 스케일 연결 보기</summary>${textScaleMapping()}</details>
    <section class="color-subsection"><h3>배경·경계</h3><p>구획선과 입력 경계를 구분하고, 푸터는 투명한 배경을 사용합니다.</p>${tokenTable(rows.slice(0,4),'배경과 경계의 테마별 토큰')}</section>
  </section>
  <section id="color-usage" class="color-doc-section">
    ${heading(3,'토큰을 조합해 버튼 상태와 화면 영역을 구분합니다.')}
    <section class="color-subsection"><h3>버튼 상태</h3><div class="color-state-demo"><button class="btn primary" data-toast="기본 Primary 버튼 예제입니다.">Default</button><span class="btn primary state-hover">Hover</span><span class="btn primary state-active">Pressed</span><button class="btn primary focus-example">Focus</button><button class="btn primary" disabled>Disabled</button><button class="btn primary" aria-busy="true" disabled>저장 중…</button></div><p class="helper">Hover·Pressed는 상태를 고정한 견본입니다. Disabled는 행동 불가, Loading은 처리 중으로 구분하고 로딩에는 진행 문구를 제공합니다. 키보드 포커스는 색상 채움과 별도의 외곽선으로 표시합니다.</p></section>
    <section id="surface-principles" class="color-subsection"><h3>페이지 배경과 푸터</h3><p>라이트모드 본문은 흰색을 기본으로, 구획은 여백·제목·얇은 경계로 구분합니다. 다크모드에서도 같은 역할 관계를 유지합니다.</p>
      <div class="color-surface-rules"><article><h4>작업 영역</h4><p>보조 면은 <code>--surface</code>, 선택 배경은 <code>--accent</code>를 사용합니다. 경험 입력 패널은 <code>--ai-input-background</code>와 <code>--ai-input-border</code>를 함께 적용합니다.</p></article><article><h4>푸터</h4><p>메인·서브 모두 배경 채움 없이 상단 1px 경계만 둡니다. 본문과 같은 최대 너비에 정렬하고, 내용과 여백으로 유형을 구분합니다.</p></article></div>
      <details class="color-detail"><summary>메인·서브 푸터 적용 예시 보기</summary><div class="footer-specimens"><article><h4>메인 · 확장형</h4><div class="footer-specimen footer-specimen--full"><img src="./assets/deepresume-logo.png" alt="DeepResume" width="130"><div class="footer-specimen-links"><span>회사소개</span><span>이용약관</span><span>개인정보처리방침</span><span>공지사항</span><span>1:1 문의</span></div><p>페나랩스 주식회사<br>(08501) 서울시 금천구 가산디지털1로 233 에이스하이엔드타워9차 2층</p><div class="footer-specimen-links"><span>블로그</span><span>YouTube</span></div><div class="footer-specimen-bottom"><small>© PENa Labs. All Rights Reserved.</small><span>화면 모드</span></div></div><p class="helper">회사 정보·바로가기·SNS를 담는 구성 견본. 기존 콘텐츠를 유지하고, 내부 여백은 데스크톱 48px / 모바일 32px를 기준으로 합니다.</p></article><article><h4>서브 · 축약형</h4><div class="footer-specimen footer-specimen--compact"><img src="./assets/deepresume-logo.png" alt="DeepResume" width="130"><div class="footer-specimen-bottom"><small>© PENa Labs. All Rights Reserved.</small><span>화면 모드</span></div></div><p class="helper">로고·저작권·화면 모드만 표시합니다. 내부 여백은 24–32px를 기준으로 하며, 모바일 고정 작업 버튼이 있으면 하단 공간을 추가합니다.</p></article></div></details>
    </section>
  </section>
  <section id="color-contrast" class="color-doc-section">
    ${heading(4,'최종 배경과 함께 대비를 확인하고, 채택한 예외를 구분합니다.')}
    <h3>Primary 라벨과 브랜드 텍스트</h3><div class="contrast-grid"><article class="contrast-example"><div style="background:#FFAD31;color:#FFFFFF;font-weight:400">저장 후 다음 →</div><b>White · weight 400</b><p>#FFFFFF / #FFAD31<br>굵기 비교용 견본.</p></article><article class="contrast-example"><div style="background:#FFAD31;color:#FFFFFF;font-weight:700">저장 후 다음 →</div><b>White · weight 700 · 채택</b><p>#FFFFFF / #FFAD31<br>주 행동과 주요 라벨의 기본 조합.</p></article><article class="contrast-example"><div style="background:#FFFFFF;color:#C24C00">상세 내용 보기 →</div><b>강조 글자 · ${contrast('#C24C00','#FFFFFF').toFixed(2)}:1</b><p>#C24C00 / #FFFFFF<br>밝은 배경의 링크·작은 글자용 파생색.</p></article></div><p class="helper">흰색 / Primary의 대비는 ${contrast('#FFAD31','#FFFFFF').toFixed(2)}:1입니다. 700 굵기는 시각적 선명도를 보완하지만 대비 수치를 바꾸지 않으며, 이 조합은 WCAG AA 텍스트 대비 기준을 충족하지 않습니다. 브랜드 결정으로 유지하는 예외로 기록합니다. <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">WCAG 대비 기준 ↗</a></p>
    <h3>적용 검수</h3><ul class="plain-list"><li>Primary 내부 라벨과 아이콘은 흰색, 주요 라벨은 700 굵기를 사용합니다.</li><li>밝은 배경의 링크는 <code>--brand-ink</code>와 밑줄을 함께 사용합니다.</li><li>차트의 범주는 색의 밝기만으로 구분하지 않고 범주명·수치·패턴을 함께 제공합니다.</li><li>반투명·비활성·이미지 위 배치는 합성된 실제 배경에서 대비를 다시 확인합니다.</li></ul>
    <a class="btn" href="./tokens.css?v=f6c1f153a6058e30" download>CSS 토큰 다운로드</a>
  </section>
 </div>`;
}
