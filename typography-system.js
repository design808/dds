import {textColorSection} from './text-colors.js?v=3ea17f0ff21b92cc';

export const typeStyles = [
  {id:'display-1', name:'Display 1', size:48, line:60, weight:700, tracking:'-0.01em', usage:'메인 히어로·캠페인의 대표 메시지'},
  {id:'display-2', name:'Display 2', size:40, line:52, weight:700, tracking:'-0.01em', usage:'짧은 소개 메시지·좁은 화면의 히어로'},
  {id:'title-1', name:'Title 1', size:32, line:44, weight:700, tracking:'-0.01em', usage:'서비스 페이지의 대표 제목'},
  {id:'title-2', name:'Title 2', size:28, line:38, weight:700, tracking:'-0.01em', usage:'좁은 화면의 페이지 제목·대형 패널 제목'},
  {id:'heading-1', name:'Heading 1', size:24, line:34, weight:600, tracking:'-0.01em', usage:'페이지 내 주요 섹션 제목'},
  {id:'heading-2', name:'Heading 2', size:20, line:28, weight:600, tracking:'-0.01em', usage:'하위 섹션·모달 제목'},
  {id:'headline-1', name:'Headline 1', size:18, line:26, weight:600, tracking:'0', usage:'카드 제목·짧은 요약 강조'},
  {id:'body-1-normal', name:'Body 1 / Normal', size:16, line:24, weight:400, tracking:'0', usage:'기본 본문·입력 값·짧은 설명'},
  {id:'body-1-reading', name:'Body 1 / Reading', size:16, line:28, weight:400, tracking:'0', usage:'자기소개서·긴 안내 등 연속해서 읽는 본문'},
  {id:'body-2-normal', name:'Body 2 / Normal', size:14, line:22, weight:400, tracking:'0', usage:'밀도 높은 목록·보조 설명·푸터 정보'},
  {id:'body-2-reading', name:'Body 2 / Reading', size:14, line:26, weight:400, tracking:'0', usage:'부가 안내·도움말의 긴 문단'},
  {id:'label-1', name:'Label 1', size:14, line:20, weight:500, tracking:'0', usage:'GNB·서브메뉴·필드 이름·기본 버튼·탭'},
  {id:'label-2', name:'Label 2', size:13, line:18, weight:500, tracking:'0', usage:'작은 칩·배지·보조 컨트롤 라벨'},
  {id:'caption-1', name:'Caption 1', size:12, line:18, weight:400, tracking:'0', usage:'작성 일시·보조 메타데이터'},
  {id:'caption-2', name:'Caption 2', size:11, line:16, weight:400, tracking:'0', usage:'공간이 제한된 그래프 주석 등 비핵심 정보'},
  {id:'code', name:'Code', size:13, line:20, weight:400, tracking:'0', usage:'HTML·CSS 예제·토큰명·기술 식별자'},
];

const defaultSample = '나의 경험이 더 나은 기회로 이어집니다.';
export function typeDeclarations(id) {
  if (!typeStyles.some(style => style.id === id)) throw new Error('Unknown typography role: ' + id);
  return [
    'font-family: var(--font-sans);',
    `font-size: var(--type-${id}-size);`,
    `line-height: var(--type-${id}-line-height);`,
    `font-weight: var(--type-${id}-weight);`,
    `letter-spacing: var(--type-${id}-tracking);`
  ].join('\n');
}
export function typographyPage() {
  return `<div class="typography-docs">
    <section aria-labelledby="type-basics"><h2 id="type-basics">기본 서체</h2>
      <div class="type-family-panel"><div><b>Pretendard</b><p>가나다라마바사 · Aa Bb Cc · 0123456789</p></div><code>--font-sans</code></div>
      <p>Pretendard 1.3.9 가변 웹폰트를 사이트에 포함합니다. DDS와 모든 시안은 같은 파일을 불러오므로 컴퓨터에 폰트를 설치할 필요가 없습니다. 외부 폰트 서버에 의존하지 않으며, 100–900의 굵기를 하나의 파일로 제공합니다. 일반 텍스트의 사용 범위는 400–700입니다.</p>
      <p>폰트를 불러오는 동안에는 시스템 폰트로 먼저 표시하고, 로딩이 끝나면 Pretendard를 적용합니다. 로딩에 실패하면 Apple SD Gothic Neo, Malgun Gothic, 시스템 sans-serif 순서로 대체합니다. 동일한 폰트를 사용해도 운영체제의 글자 렌더링 방식에 따른 미세한 차이는 있을 수 있습니다. <a href="./assets/fonts/pretendard/LICENSE" target="_blank" rel="noreferrer">폰트 라이선스</a></p>
      <p>다른 서비스에 적용할 때는 <code>tokens.css</code>와 <code>assets/fonts/pretendard/</code>를 같은 폴더 구조로 함께 배포합니다. 폰트 파일과 라이선스도 배포 파일에 포함합니다.</p>
      <p>코드 예제·토큰명·숫자도 <code>--font-sans</code>를 사용합니다. 문서의 제목 계층은 <code>h1–h6</code>로 정하고, 시각적 크기는 아래 역할 클래스로 지정합니다.</p>
    </section>
    <section aria-labelledby="type-scale-title"><h2 id="type-scale-title">스타일 체계</h2>
      <p>Display → Title → Heading → Headline → Body → Label → Caption 순서로 정보의 위계를 정합니다. 각 스타일은 크기·행간·기본 굵기·자간으로 구성합니다. Reading은 같은 본문 크기에서 행간만 넓힙니다.</p>
      <form class="type-playground" aria-label="타이포그래피 미리보기 설정">
        <div class="type-playground-field"><label for="type-sample">예시 문장</label><input id="type-sample" data-type-sample type="text" value="${defaultSample}" maxlength="160"></div>
        <div class="type-playground-field"><label for="type-weight">미리보기 굵기</label><select id="type-weight" data-type-weight><option value="default">스타일 기본값</option><option value="400">Regular · 400</option><option value="500">Medium · 500</option><option value="600">Semibold · 600</option><option value="700">Bold · 700</option></select></div>
        <button class="btn" type="reset">초기화</button>
      </form>
      <p class="helper">값의 순서는 크기 / 행간 / 굵기 / 자간입니다. 복사 버튼은 서체와 네 가지 값을 함께 복사합니다.</p>
      <div class="type-role-list">${typeStyles.map(style => `<article class="type-role" data-type-role="${style.id}">
        <div class="type-role-meta"><h3>${style.name}</h3><p>${style.usage}</p><button class="token-copy" data-copy="${typeDeclarations(style.id)}" aria-label="${style.name} 전체 스타일 복사"><code>${style.id} CSS 복사</code></button></div>
        <div class="type-role-preview"><p class="dds-type-${style.id}" data-type-specimen>${style.id === 'code' ? 'color: var(--text-primary);' : defaultSample}</p><div class="type-metrics"><span>${style.size}px</span><span>${style.line}px</span><span data-type-current-weight>${style.weight}</span><span>${style.tracking}</span></div></div>
      </article>`).join('')}</div>
    </section>
    <section aria-labelledby="type-reading-title"><h2 id="type-reading-title">Normal과 Reading</h2><p>짧은 인터페이스 문장은 Normal, 여러 줄을 연속해서 읽는 내용은 Reading을 사용합니다. 긴 문서를 작게 축소해 한 화면에 넣지 않습니다.</p>
      <div class="type-reading-grid">${[['normal','Normal · 16 / 24'],['reading','Reading · 16 / 28']].map(([id, label]) => `<article><h3>${label}</h3><p class="dds-type-body-1-${id}">자기소개서는 경험을 나열하는 문서가 아니라, 그 경험에서 어떤 역할을 맡고 무엇을 배웠는지 전달하는 글입니다. 상황과 행동, 결과를 순서대로 적고 지원하는 직무와 연결해 보세요.</p></article>`).join('')}</div>
    </section>
    <section aria-labelledby="type-weight-title"><h2 id="type-weight-title">굵기와 자간</h2>
      <div class="type-weight-grid">${[[400,'Regular','본문·입력 값'],[500,'Medium','메뉴·필드 라벨'],[600,'Semibold','섹션·카드 제목'],[700,'Bold','대표 제목·주 행동']].map(([value,name,usage]) => `<article><span style="font-weight:${value}">함께 만드는 경험</span><b>${name} · ${value}</b><small>${usage}</small></article>`).join('')}</div>
      <div class="guideline"><b>일반 텍스트의 최대 굵기는 700</b><p>제목·본문·메뉴·버튼·라벨·상태 문구는 400–700 범위에서 사용합니다. 필요하면 역할의 기본 굵기를 이 범위 안에서 조정하되, 같은 컴포넌트는 같은 값을 유지합니다. Primary 채움 버튼의 라벨은 700을 사용합니다.</p><p>로고·워드마크, 장식용 숫자, 타이포그래피 그래픽은 700을 초과할 수 있습니다. 컴포넌트 명세에 대상과 이유를 기록합니다. 일반 제목이나 버튼의 강조는 예외 사유가 아닙니다.</p></div>
      <div class="table-wrap"><table><caption class="sr-only">자간 사용 기준</caption><thead><tr><th>대상</th><th>자간</th><th>토큰 / 적용 기준</th></tr></thead><tbody><tr><td>본문·입력·메뉴·한글 라벨</td><td>0</td><td><code>--tracking-body</code> · 기본 간격 유지</td></tr><tr><td>Display·Title·Heading</td><td>−0.01em</td><td><code>--tracking-heading</code> · 큰 글자에만 약하게 적용</td></tr><tr><td>짧은 영문 대문자 구분 라벨</td><td>0.04em</td><td><code>--tracking-label</code> · 일반 문장에는 사용하지 않음</td></tr><tr><td>인증번호</td><td>컴포넌트 별도 정의</td><td>숫자 칸을 나누는 기능상 예외. 본문 스타일로 전파하지 않음</td></tr></tbody></table></div>
    </section>
    ${textColorSection()}
    <section aria-labelledby="type-usage-title"><h2 id="type-usage-title">화면에 적용하기</h2>
      <div class="table-wrap"><table><caption class="sr-only">화면별 타이포그래피 적용과 좁은 화면 대응</caption><thead><tr><th>요소</th><th>기본 스타일 / 색</th><th>좁은 화면 기준</th></tr></thead><tbody><tr><td>메인 대표 메시지</td><td>Display 1 / Strong</td><td>Display 2, 줄바꿈 허용</td></tr><tr><td>페이지 제목</td><td>Title 1 / Strong</td><td>Title 2</td></tr><tr><td>주요 섹션 제목</td><td>Heading 1 / Strong</td><td>Heading 2</td></tr><tr><td>일반 카드 제목</td><td>Headline 1 / Strong</td><td>동일 크기, 긴 제목은 줄바꿈</td></tr><tr><td>문서 목록 카드 제목 / 보조정보</td><td>Body 1 Normal · 600 / Body 2 Normal</td><td>16px / 14px 유지. 여러 문서를 훑어보는 목록은 제목을 굵기로 구분</td></tr><tr><td>자기소개서 본문</td><td>Body 1 Reading / Primary</td><td>16px 유지, 가용 너비 조절</td></tr><tr><td>입력 값 / 필드 라벨</td><td>Body 1 Normal / Label 1</td><td>기본 16px 유지. 명시적인 Small은 Body 2 Normal 14px</td></tr><tr><td>기본 버튼 / 메인 CTA</td><td>Label 1 / Body 1 Normal · 700</td><td>컴포넌트 크기에 맞춰 14px / 16px 유지</td></tr><tr><td>도움말 / 부가 일시</td><td>Body 2 Normal · Secondary / Caption 1 · Tertiary</td><td>도움말을 Caption 2로 축소하지 않음</td></tr><tr><td>푸터 정보</td><td>Body 2 Normal / Secondary</td><td>모든 화면에서 14px</td></tr></tbody></table></div>
      <h3>줄바꿈과 문장 길이</h3><ul class="plain-list"><li>한글은 <code>word-break: keep-all</code>로 어절을 유지하고, 긴 주소·식별자는 <code>overflow-wrap: anywhere</code>로 넘침을 방지합니다.</li><li>여러 줄 본문에는 행간을 고정 높이로 오해해 박스 높이를 제한하지 않습니다. 읽기 영역은 최대 약 42em로 제한하고 화면이 좁아지면 자연스럽게 줄바꿈합니다.</li><li>제목·필수 안내·오류 문구는 말줄임하지 않습니다. 목록의 보조 정보가 잘리는 경우 전체 값을 확인할 수단을 제공합니다.</li><li>반응형은 요소의 역할에 따라 크기를 바꿉니다. 모든 글자 크기를 한꺼번에 축소하지 않으며, 브라우저 확대에서도 내용과 컨트롤이 겹치지 않게 구성합니다.</li></ul>
      <h3>CSS 토큰과 클래스</h3><p>각 스타일은 <code>--type-{이름}-size</code>, <code>-line-height</code>, <code>-weight</code>, <code>-tracking</code> 토큰과 <code>.dds-type-{이름}</code> 클래스를 제공합니다. 클래스는 서체·크기·행간·굵기·자간만 지정하므로 글자 색상과 반응형 전환은 사용처에서 결정합니다.</p>
      <pre tabindex="0" aria-label="타이포그래피 적용 CSS 예시"><code>.document-title {
  font-family: var(--font-sans);
  font-size: var(--type-title-1-size);
  line-height: var(--type-title-1-line-height);
  font-weight: var(--type-title-1-weight);
  letter-spacing: var(--type-title-1-tracking);
  color: var(--text-strong);
}

.document-body {
  color: var(--text-primary);
  word-break: keep-all;
  overflow-wrap: anywhere;
}</code></pre>
      <a class="btn" href="./tokens.css?v=3ea17f0ff21b92cc" download>타이포그래피·색상 토큰 다운로드</a>
    </section>
    <section aria-labelledby="type-service-contract"><h2 id="type-service-contract">서비스 적용 규칙</h2>
      <p>같은 크기여도 역할이 다르면 사용처를 구분합니다. GNB와 서브메뉴는 Label 1(14 / 20 / 500), 작은 칩·배지는 Label 2(13 / 18 / 500)입니다. 일반 입력 값은 Body 1 Normal(16px), 작은 도구 모음의 Small 입력·선택 값은 Body 2 Normal(14px), 자기소개서 본문은 Body 1 Reading을 사용합니다. 메뉴나 입력란의 너비가 부족하면 간격·줄바꿈·배치를 조정합니다.</p>
      <p>메인 2종·지원정보·문항 작성·마이페이지·이력서 작성은 하나의 역할 매핑을 공유합니다. 메인 제목은 Display 역할에 500·600·700의 굵기 강약을 적용하며, 메인 CTA는 16px / 700, 푸터는 14px를 유지합니다. 반응형에서 크기가 달라지는 제목도 정의된 역할로 전환합니다.</p>
      <ol class="plain-list"><li>화면을 옮기기 전에 제목·메뉴·필드·도움말·상태 메시지의 역할을 지정합니다. 숨겨진 메뉴·모달·오류·동적 추가 항목도 포함합니다.</li><li><code>.dds-service</code> 범위에서 공통 적용 CSS를 마지막에 불러옵니다. 원본의 글자 크기 유틸리티·인라인 스타일·<code>!important</code>가 충돌하면 DDS를 적용하는 템플릿에서 정리합니다. 필드 ID·이벤트·서버 처리 코드는 유지합니다.</li><li>크기 하나만 바꾸지 않고 서체·크기·행간·굵기·자간을 한 역할로 적용합니다. 새 요소는 <code>service-typography.js</code> 매핑 또는 <code>.dds-type-*</code> 역할 클래스로 지정합니다. 굵기 예외는 대상과 이유를 함께 기록합니다.</li><li><code>npm run typography:build</code>로 CSS를 생성하고 <code>npm run typography:check</code>로 검사합니다. 기본 검사와 공유 패키지 생성에도 검사가 실행됩니다. 운영 적용 시에는 각 권한·상태·화면 너비의 실제 렌더링을 확인합니다.</li></ol>
      <p>자동 검사는 직접 지정한 글자값과 매핑 누락·변경을 감지합니다. 새로운 요소에 어떤 역할이 적합한지, 기존 CSS와 충돌하는지에 대한 화면 검수도 함께 진행해야 합니다.</p>
      <a class="btn" href="./service-typography.css?v=3ea17f0ff21b92cc" download>서비스 타이포그래피 CSS 다운로드</a>
    </section>
  </div>`;
}

export function bindTypography() {
  const form = document.querySelector('.type-playground');
  if (!form) return;
  const sample = form.querySelector('[data-type-sample]');
  const weight = form.querySelector('[data-type-weight]');
  const update = () => {
    for (const style of typeStyles) {
      const row = document.querySelector(`[data-type-role="${style.id}"]`);
      const specimen = row.querySelector('[data-type-specimen]');
      const text = sample.value.trim() || defaultSample;
      specimen.textContent = style.id === 'code' && text === defaultSample ? 'color: var(--text-primary);' : text;
      specimen.style.fontWeight = weight.value === 'default' ? '' : weight.value;
      row.querySelector('[data-type-current-weight]').textContent = weight.value === 'default' ? style.weight : weight.value;
    }
  };
  sample.addEventListener('input', update);
  weight.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('reset', () => setTimeout(() => weight.dispatchEvent(new Event('change', {bubbles:true})), 0));
}
