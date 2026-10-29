import {contrast} from './color-contrast.js?v=ec100736812be7db';

export const textScale = [
  ['50','#F7F8FA'],['100','#EEF0F3'],['200','#DDE1E7'],['300','#B4BCC8'],
  ['400','#949DAA'],['500','#6B727C'],['600','#626974'],['700','#4B5564'],
  ['800','#3B4555'],['900','#293241'],['950','#252D3A'],
];
const textScaleRoles = [
  ['Strong · 제목 강조','950','100'],['Primary · 기본 본문','900','200'],
  ['Secondary · 보조 설명','600','300'],['Tertiary · 메타정보','500','400'],
  ['Placeholder · 입력 예시','500','400'],['Inverse · 반전 면','50','950'],
];
export function textScaleSection({includeMapping=true}={}){
  return `<section class="text-scale-section" aria-labelledby="text-scale-title">
    <h3 id="text-scale-title">Text color scale</h3>
    <p>50부터 950까지, 밝은 회색에서 짙은 차콜로 이어지는 11단계입니다. 스케일은 테마와 무관한 원색 토큰이며, 실제 글자는 역할 토큰으로 라이트·다크에 맞게 전환합니다. 번호는 명도 순서이고 단계별 명도 차이가 같다는 뜻은 아닙니다.</p>
    <div class="brand-ramp text-scale-ramp">${textScale.map(([step,hex])=>`<button type="button" class="ramp-swatch text-scale-swatch" data-copy="var(--text-scale-${step})" aria-label="Text ${step}, ${hex}, 색상 토큰 복사" style="--swatch:${hex};--swatch-ink:${contrast(hex,'#252D3A')>=4.5?'#252D3A':'#FFFFFF'}"><span>${step}</span><b>${hex}</b></button>`).join('')}</div>
    ${includeMapping?textScaleMapping():''}
    <p class="helper">화면에는 <code>--text-primary</code> 같은 역할 토큰을 사용합니다. 700·800은 중간 단계 원색이며 새로운 역할로 적용할 때 사용처와 배경 대비를 함께 정합니다. Disabled는 비활성 전용 값, 링크·상태·Primary 위의 글자는 각 의미 토큰을 유지합니다. 밝은 단계는 밝은 배경 위의 본문용이 아닙니다.</p>
  </section>`;
}
export function textScaleMapping(){
  return `<div class="table-wrap"><table><caption class="sr-only">텍스트 역할과 테마별 스케일 연결</caption><thead><tr><th>텍스트 역할</th><th>Light 단계</th><th>Dark 단계</th></tr></thead><tbody>${textScaleRoles.map(([name,light,dark])=>`<tr><th scope="row">${name}</th><td><code>text-scale-${light}</code></td><td><code>text-scale-${dark}</code></td></tr>`).join('')}</tbody></table></div>`;
}

export const textColors = [
  {id:'strong', name:'Strong · 강조', light:'#252D3A', dark:'#EEF0F3', usage:'페이지·섹션 제목, 핵심 수치. 긴 본문 전체에는 사용하지 않습니다.', sample:'자기소개서 작성'},
  {id:'primary', name:'Primary · 기본', light:'#293241', dark:'#DDE1E7', usage:'본문, 입력한 값, 메뉴 등 대부분의 텍스트. 페이지가 상속하는 기본색입니다.', sample:'나의 경험을 문장으로 정리하세요.'},
  {id:'secondary', name:'Secondary · 보조', light:'#626974', dark:'#B4BCC8', usage:'제목을 보완하는 설명, 도움말, 부가 정보.', sample:'최근 작성한 문서를 이어서 작성할 수 있어요.'},
  {id:'tertiary', name:'Tertiary · 낮은 강조', light:'#6B727C', dark:'#949DAA', usage:'수정 일시, 문서 수, 부가 메타데이터. 읽어야 하는 정보에 투명도를 추가하지 않습니다.', sample:'마지막 수정 · 오늘 14:30'},
  {id:'placeholder', name:'Placeholder · 입력 예시', light:'#6B727C', dark:'#949DAA', usage:'입력 전 예시·힌트. 필드 이름과 필수 안내는 별도 라벨로 제공합니다.', sample:'예: 서비스 기획 인턴'},
  {id:'disabled', name:'Disabled · 비활성', light:'#A2A8B1', dark:'#646D79', usage:'실제로 비활성화된 컨트롤만 사용. 읽기 전용 값이나 일반 도움말에는 쓰지 않습니다.', sample:'선택할 수 없는 항목', exempt:true},
  {id:'inverse', name:'Inverse · 반전 면', light:'#F7F8FA', dark:'#252D3A', usage:'반전 배경의 툴팁·안내. 반드시 --surface-inverse와 함께 사용합니다.', sample:'수정 내용이 저장되었습니다.', background:'--surface-inverse', lightBg:'#252D3A', darkBg:'#EEF0F3'},
  {id:'link', name:'Link · 링크', light:'#C24C00', dark:'#FFBE5C', usage:'본문 링크. 밑줄을 함께 표시해 일반 본문과 구분합니다.', sample:'작성 가이드 보기'},
  {id:'on-primary', name:'On primary · 주 행동 위', light:'#FFFFFF', dark:'#FFFFFF', usage:'Primary 채움 위의 버튼·선택 라벨. 기본 굵기 700을 유지합니다.', sample:'저장 후 다음', background:'--primary', lightBg:'#FFAD31', darkBg:'#FFAD31', exception:true},
  {id:'success', name:'Success · 완료', light:'#18734B', dark:'#87D7AA', usage:'완료·성공 상태를 명시하는 문구.', sample:'저장이 완료되었습니다.', background:'--success-bg', lightBg:'#EDF8F1', darkBg:'#1C3528'},
  {id:'warning', name:'Warning · 주의', light:'#8A5500', dark:'#F5C76C', usage:'확인이 필요한 조건이나 제한 안내.', sample:'제출 전에 지원 분야를 확인하세요.', background:'--warning-bg', lightBg:'#FFF5DA', darkBg:'#382E1B'},
  {id:'error', name:'Error · 오류', light:'#C02A32', dark:'#FF959B', usage:'입력 오류와 실패 이유. 수정 방법을 함께 안내합니다.', sample:'날짜를 올바르게 입력해 주세요.', background:'--destructive-bg', lightBg:'#FFF0F0', darkBg:'#3E2327'},
  {id:'info', name:'Info · 정보', light:'#265EBC', dark:'#99BAFF', usage:'정보성 안내. 일반 보조 설명에는 Secondary를 사용합니다.', sample:'작성한 내용은 임시저장할 수 있습니다.', background:'--info-bg', lightBg:'#EDF3FF', darkBg:'#202F48'},
];

export function textColorSection({includeScale=true,headingLevel=2}={}) {
  const cell = (role, theme) => {
    const background = role[theme + 'Bg'] || (theme === 'light' ? '#F7F8FA' : '#1E2125');
    const ratio = contrast(role[theme], background).toFixed(2);
    return `<td><span class="text-token-value"><i style="background:${role[theme]}"></i><code>${role[theme]}</code></span><small>${role.exempt ? '비활성 전용' : `${ratio}:1${role.exception ? ' · 브랜드 예외' : ''}`}</small></td>`;
  };
  return `<section class="text-color-section" aria-labelledby="text-color-title">
    <h${headingLevel} id="text-color-title">텍스트·상태 색상</h${headingLevel}>
    <p>텍스트는 크기와 독립적으로 역할에 따라 색을 선택합니다. 기본색은 부드러운 차콜 <code>#293241</code>이며, 제목은 Strong, 본문은 Primary, 설명은 Secondary로 구분합니다. 텍스트의 Primary는 주황색 브랜드 토큰 <code>--primary</code>와 역할이 다릅니다.</p>
    ${includeScale?textScaleSection():''}
    <div class="text-hierarchy-demo">
      <span class="text-hierarchy-kicker">예시 · 문서 카드</span>
      <h${headingLevel+1}>서비스 기획 직무 자기소개서</h${headingLevel+1}>
      <p class="text-hierarchy-body">사용자의 문제를 발견하고 팀과 함께 개선한 경험을 작성하세요.</p>
      <p class="text-hierarchy-description">경험의 배경과 본인의 역할을 구체적으로 적으면 좋아요.</p>
      <span class="text-hierarchy-meta">마지막 수정 · 오늘 14:30</span>
    </div>
    <div class="table-wrap text-color-table"><table>
      <caption class="sr-only">텍스트 색상 13개 역할, 라이트·다크 값과 사용처</caption>
      <thead><tr><th scope="col">역할 / 토큰</th><th scope="col">현재 테마 예시 / 사용처</th><th scope="col">Light</th><th scope="col">Dark</th></tr></thead>
      <tbody>${textColors.map(role => `<tr>
        <th scope="row">${role.name}<button class="token-copy" data-copy="var(--text-${role.id})" aria-label="text-${role.id} 토큰 복사"><code>--text-${role.id}</code></button></th>
        <td><span class="text-role-example ${role.id === 'link' ? 'text-role-link' : ''}" style="color:var(--text-${role.id});background:var(${role.background || '--surface'});${role.id === 'on-primary' ? 'font-weight:700;' : ''}">${role.sample}</span><p>${role.usage}</p></td>
        ${cell(role, 'light')}${cell(role, 'dark')}
      </tr>`).join('')}</tbody>
    </table></div>
    <p class="helper">대비 수치는 기본 역할은 Surface, 반전·주 행동·상태 역할은 예시의 배경을 기준으로 계산했습니다. 비활성 색은 일반 정보 전달에 사용하지 않습니다. Primary 위의 흰색은 기존 브랜드 예외이며 굵기를 높여도 대비 수치는 변하지 않습니다.</p>
    <div class="guideline"><b>값 대신 역할을 연결합니다</b><p><code>--foreground → --text-primary</code>, <code>--muted-foreground → --text-secondary</code>로 연결해 기존 컴포넌트도 같은 색상 체계를 사용합니다. 오류·성공·링크는 역할 토큰을 명시하고 색상만으로 의미를 전달하지 않습니다.</p></div>
  </section>`;
}
