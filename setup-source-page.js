import {ddsRelease,ddsSetupPrompt} from './ui-setup-content.js?v=f963c57c0fc718c6';
import {buildProjectProfilePrompt} from './project-profile.js?v=f963c57c0fc718c6';
import {parseDesignProfile,PROFILE_STORAGE_KEY} from './design-profile.js?v=f963c57c0fc718c6';
import {FONT_OPTIONS} from './design-preferences.js?v=f963c57c0fc718c6';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const section=(title,body)=>`<section class="doc-section"><h2>${title}</h2>${body}</section>`;
function savedProfile(){try{return parseDesignProfile(globalThis.window?.localStorage.getItem(PROFILE_STORAGE_KEY));}catch{return null;}}
function profileSummary(profile){
 if(!profile)return '프로젝트에 사용할 색상·배경·서체를 우측 하단 디자인 설정에서 선택한 뒤 저장하세요. 저장 전에는 DDS 기본값을 사용합니다.';
 const font=value=>FONT_OPTIONS.find(option=>option.value===value).label;
 return `저장된 설정: ${profile.settings.primary} · 제목 ${font(profile.settings.headingFont)} · 본문 ${font(profile.settings.bodyFont)} · 화면 배경 ${profile.settings.pageBackground} · ${profile.settings.colorMode==='functional'?'기능별로 다른 색상 사용':'메인 색상만 사용'}`;
}
export function refreshSetupPrompt(root){
 const profile=savedProfile(),prompt=buildProjectProfilePrompt(profile);
 for(const button of root.querySelectorAll('[data-dds-setup-copy]'))button.dataset.copy=prompt;
 for(const code of root.querySelectorAll('[data-dds-setup-content]'))code.textContent=prompt;
 for(const summary of root.querySelectorAll('[data-dds-setup-profile]'))summary.textContent=profileSummary(profile);
}
export function downloadSetupPrompt(doc){
 const prompt=buildProjectProfilePrompt(savedProfile());
 const url=URL.createObjectURL(new Blob([prompt+'\n'],{type:'text/plain;charset=utf-8'}));
 const link=doc.createElement('a');link.href=url;link.download=`DDS-${ddsRelease}-project-setup.txt`;doc.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function setupPage(){
 const profile=savedProfile(),prompt=buildProjectProfilePrompt(profile);
 return `<div class="breadcrumbs"><a href="#/">DDS</a><span>/</span><span>개발 적용</span></div>
 <div class="page-heading"><div><h1>AI로 적용하기</h1><p class="lead">컴포넌트 원본과 적용 규칙을 프로젝트에 연결합니다.</p></div><span class="badge">DDS ${ddsRelease}</span></div>
 <div class="reading wide">
 ${section('프로젝트 설정',`<p>DDS는 딥레쥬메·딥인터뷰와 향후 신규 서비스가 함께 사용하는 회사 서비스 공통 디자인 시스템입니다. 컴포넌트 페이지와 같은 115종의 UI 원본을 제공합니다.</p><p>프로젝트 파일을 읽고 수정할 수 있는 AI에게 아래 프롬프트를 전달합니다. 이후 <strong>“DDS 써”</strong>라고 요청하면 등록한 원본으로 화면을 구성하도록 설정합니다.</p><p data-dds-setup-profile>${esc(profileSummary(profile))}</p><div class="demo-row"><button type="button" class="btn primary" data-dds-setup-copy data-copy="${esc(prompt)}">설정 프롬프트 복사</button><button class="btn" type="button" data-dds-prompt-download>프롬프트 내려받기</button></div><details><summary>프롬프트 전체 보기</summary><pre tabindex="0" aria-label="DDS 프로젝트 설정 프롬프트"><code data-dds-setup-content>${esc(prompt)}</code></pre></details>`)}
 ${section('같은 원본 사용',`<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">파일</th><th scope="col">사용 방법</th></tr></thead><tbody><tr><th scope="row">ui/registry.json · ui/templates/</th><td>115종의 실제 HTML과 변경 가능한 콘텐츠·속성·슬롯을 확인합니다.</td></tr><tr><th scope="row">ui/core.js · extended.js · button.js · charts.js</th><td>문서와 서비스가 함께 사용하는 렌더러입니다. 비슷한 컴포넌트를 따로 만들지 않습니다.</td></tr><tr><th scope="row">tokens.css · ui/dds.css</th><td>같은 글자·색·크기·간격·상태 스타일을 연결합니다. 기존 변수와 충돌할 때는 ui/tokens-scoped.css를 사용합니다.</td></tr><tr><th scope="row">ui/index.js</th><td>컴포넌트 생성과 UI 동작을 연결합니다. 서비스 요청·저장·권한은 기존 기능에 연결합니다.</td></tr></tbody></table></div><div class="demo-row"><a class="btn" href="./ui/README.md">원본 사용 안내</a><a class="btn" href="./ui/registry.json">컴포넌트 원본 목록</a></div>`)}
 ${section('설정과 화면 적용',`<div class="table-wrap"><table class="dds-rules-table"><thead><tr><th scope="col">단계</th><th scope="col">완료 기준</th></tr></thead><tbody><tr><th scope="row">원본 준비</th><td>고정 버전 파일과 해시를 확인하고 원본을 준비합니다.</td></tr><tr><th scope="row">프로젝트 연결</th><td>정적 자산·CSS 범위·테마·UI 모듈과 AI 지침을 연결합니다.</td></tr><tr><th scope="row">화면 적용</th><td>원본 컴포넌트에 실제 콘텐츠·데이터·이벤트를 연결하고 페이지 레이아웃을 구성합니다.</td></tr><tr><th scope="row">검수</th><td>원본과 글자·높이·패딩·경계·상태를 대조하고 주요 기능을 확인합니다.</td></tr></tbody></table></div><p>기존 서비스의 프레임워크·ID·제출값·권한·기능을 보존합니다. 원본 준비만으로 전체 서비스의 디자인과 기능이 연결되는 것은 아닙니다. <a href="#/handoff">개발 적용 안내</a>에서 연결과 검수 기준을 확인합니다.</p>`)}
 ${section('컴포넌트와 페이지 구성',`<p>같은 디자인을 유지할 대상은 입력창·버튼의 크기, 글자, 경계와 상태 표현입니다. 컴포넌트 페이지의 예제 문구·도움말·개수·묶음 배치는 서비스의 필수 요소가 아닙니다.</p><p>예를 들어 검색창은 입력만으로 의미가 분명하면 하단 도움말을 생략합니다. 도움말은 입력 형식이나 제한처럼 추가 설명이 필요한 경우에만 넣습니다. 모달의 본문과 카드의 정보 항목도 작업에 맞게 구성합니다.</p><p>화면을 만들 때는 사용자가 할 일과 중요한 정보부터 정하고, 그에 맞는 목록·편집·상세 구조를 선택합니다. 모든 내용을 같은 카드에 넣거나 컴포넌트 견본을 순서대로 나열하는 방식은 피합니다. <a href="./ui/composition.md">페이지 구성 기준</a>을 함께 확인하세요.</p>`)}
 ${section('화면 설계 skill',`<p>설정 프롬프트는 DDS 화면 설계 skill도 연결합니다. 새 페이지나 큰 레이아웃 변경에서 화면 목적과 정보 순서, 구조 대안, 실제 브라우저 검토를 진행합니다. 저장한 색상·서체와 기존 컴포넌트 규격은 유지합니다.</p><p>스킬 미지원 AI도 같은 지침 파일을 직접 읽어 사용할 수 있습니다. 파일 준비만으로 해당 AI에 등록됐다고 보지는 않으며, 실제로 읽는 프로젝트 지침과 연결 위치를 확인합니다.</p><div class="demo-row"><a class="btn" href="./skills/dds-page-design/SKILL.md">화면 설계 지침</a><a class="btn" href="./skills/dds-page-design/references/page-design.md">설계·검토 기준</a></div>`)}
 ${section('고정 버전 파일',`<p>${ddsRelease}의 UI 원본·토큰·폰트·라이선스·적용 규칙을 함께 받습니다. 이미 등록한 버전은 자동 변경하지 않으며 이전 버전은 보존합니다.</p><ul class="plain-list"><li><a href="./releases/${ddsRelease}/manifest.json" download>manifest.json</a> — 버전·파일 목록·SHA-256</li><li><a href="./releases/${ddsRelease}/bundle.json" download>bundle.json</a> — 115종 UI 원본과 기준 파일</li><li><a href="./releases/${ddsRelease}/dds-install.js" download>dds-install.js</a> — 검증된 원본 준비</li><li><a href="./dds-adoption.md" download>dds-adoption.md</a> — 기존·신규 서비스 연결</li><li><a href="./llms.txt">llms.txt</a> · <a href="./llms-full.txt">llms-full.txt</a> — AI용 문서</li></ul>`)}
 </div>`;
}
