// Pure prompt builder: a saved profile is an explicit project setting, not live preview.
import {ddsSetupPrompt,ddsRelease} from './ui-setup-content.js?v=d9735dada5500b56';
import {normalizeDesignProfile} from './design-profile.js?v=d9735dada5500b56';
import {FONT_OPTIONS} from './design-preferences.js?v=d9735dada5500b56';
export {createProfileCSS,profileTokens} from './ui/profile.js?v=d9735dada5500b56';

export function buildProjectProfilePrompt(input){
 if(input==null)return ddsSetupPrompt;
 const profile=normalizeDesignProfile(input);
 if(!profile)throw new TypeError('저장된 디자인 설정을 확인해 주세요.');
 const {settings}=profile;
 const font=value=>FONT_OPTIONS.find(item=>item.value===value).label;
 const json=JSON.stringify(profile,null,2);
 return `${ddsSetupPrompt}

이 프로젝트에 적용할 저장된 디자인 설정
아래 값은 DDS 기본값보다 우선하는 프로젝트 설정이야. 화면에 예시로 표시한 값이 아니라 실제 적용할 값이므로 기본 오렌지·Pretendard로 되돌리지 마.
- 브랜드 색상: ${settings.primary}
- 제목 서체: ${font(settings.headingFont)}
- 본문 서체: ${font(settings.bodyFont)}
- 색상 사용: ${settings.colorMode==='functional'?'기능별로 다른 색상 사용':'메인 색상만 사용'}
- 기능 색상: 탐색 ${settings.secondary}, AI ${settings.accent}, 완료 ${settings.positive}
- 화면 배경: ${settings.pageBackground}
- 다크 모드 배경: DDS 기본값 #17191C 고정

1. 아래 JSON을 프로젝트의 docs/dds-profile.json으로 저장해줘. 설정을 저장한 DDS 버전은 ${profile.ddsVersion}이며, 이번 설치 기준은 위의 ${ddsRelease}야. 이미 설치된 버전이 다르면 먼저 차이를 확인하고 자동으로 교체하지 마.
\`\`\`json
${json}
\`\`\`

2. 설치한 ui/profile.js의 createProfileCSS(profile, {scoped:false})로 ui/project-profile.css를 생성해줘. 기존 서비스에서 범위 토큰을 선택했다면 scoped:true를 사용해줘. 기본 상대 폰트 경로는 ../assets/fonts/이므로 생성 파일을 설치 폴더의 ui/에 두고, 다른 곳에 저장하면 assetBase를 실제 상대 경로로 지정해줘. 생성한 CSS는 토큰과 ui/dds.css 다음에 한 번만 연결해줘. 화면 배경은 --page-background로 분리되어 전역 방식에서는 body에 적용돼. 범위 방식에서는 실제 배치 상자인 페이지 부모를 .dds-ui 안에 두고 data-dds-page를 지정해줘. display:contents인 .dds-ui 자체에 배경을 칠하지 마. 카드·입력·모달·헤더의 --background/--surface를 페이지 배경색으로 덮지 마. 고정 버전의 원본 파일은 수정하지 마.

3. 묶음의 assets/fonts/에는 선택 가능한 서체의 WOFF2·fontfaces.css·라이선스가 포함돼. 선택한 제목·본문 서체의 CSS와 해당 CSS가 참조하는 폰트 파일을 실제 정적 경로로 배포해줘. 브라우저의 document.fonts와 계산된 font-family로 실제 로드를 확인해줘. 컴퓨터에 설치된 폰트나 fallback으로 표시된 것을 적용 완료로 취급하지 마.

4. 브랜드색 스케일·hover·active·포커스와 라이트/다크 값은 ui/profile.js와 profile-palette.js가 같은 규칙으로 생성해. 임의 HEX를 따로 만들지 마. 기능별 색상은 의미가 있는 기존 표면에 data-dds-color-role="secondary|accent|positive"를 명시해 적용하고, 모든 카드·제목에 색을 나눠 칠하거나 장식 선을 추가하지 마. 오류·경고 색을 장식용 기능 색상으로 바꾸지 마. 브랜드 로고는 원본을 보존하고 서비스의 브랜드 정책에 따라 결정해줘.

5. docs/dds-adoption.md와 실제 AI 지침에 docs/dds-profile.json 및 생성 CSS 경로를 함께 기록해줘. 이후 “DDS 써”라고 하면 이 저장 설정을 재사용해줘. 브랜드색 ${settings.primary}, 제목 ${font(settings.headingFont)}, 본문 ${font(settings.bodyFont)}, 화면 배경 ${settings.pageBackground}가 최종 화면의 실제 계산값에 반영되는지 확인해줘. 다크 모드 배경은 #17191C를 유지하며 JSON의 pageBackgroundDark는 이전 프로필을 읽기 위한 호환 필드로 취급해줘. 페이지 배경 위 글자와 카드·입력·모달의 독립 표면도 두 모드에서 검수해줘. 필요한 보조 글자 대비는 canvasTextTokens로 최소 보정하고 기본 표면이나 입력 placeholder 색을 바꾸지 마. 선택색에 따른 흰색 라벨 대비는 다시 측정하고, 기본 오렌지의 대비 수치를 다른 색에 그대로 적용하지 마.`;
}
