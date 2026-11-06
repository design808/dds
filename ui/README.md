# DDS UI 원본 사용

DDS 컴포넌트 페이지와 서비스가 같은 `core.js`, `extended.js`, `button.js`, `charts.js`를 사용한다. `registry.json`의 115개 항목과 `templates/`의 HTML은 이 렌더러에서 생성된다. 같은 디자인을 사용한다는 것은 내부 규격을 유지한다는 뜻이며, 문서에서 보여주는 폭과 정렬까지 고정한다는 뜻은 아니다.

새 페이지나 큰 레이아웃 변경에서는 설치 위치의 `skills/dds-page-design/SKILL.md`도 읽는다. DDS와 저장한 디자인 설정을 유지하며 화면의 목적·정보 우선순위·구조 선택과 실제 시각 검토를 진행한다. 이 skill은 새 토큰이나 UI를 생성하지 않는다.

## 연결

묶음의 폴더 구조를 유지해 서비스가 제공하는 정적 자산 경로에 연결한다. 폰트·아이콘 마스크·JS 상대 경로를 함께 유지한다.

```html
<link rel="stylesheet" href="/vendor/dds/tokens.css">
<link rel="stylesheet" href="/vendor/dds/ui/dds.css">
<div id="workspace"></div>
```

```js
import {createComponent, mountDDS} from '/vendor/dds/ui/index.js';

const root = document.querySelector('#workspace');
const search = createComponent('search', {
  idPrefix: 'document-search',
  text: {label: '문서 검색'},
  attributes: {
    control: {name: 'query', placeholder: '문서 제목', 'aria-label': '문서 검색'}
  }
});
const save = createComponent('button', {
  props: {label: '저장', before: 'Save', size: 'md'}
});
root.append(search, save);
const cleanup = mountDDS(root, {
  controls: true,
  onAction(detail) {
    // detail.action과 서비스의 기존 기능을 연결한다.
  }
});
// 화면을 제거할 때 cleanup()을 호출한다.
```

기존 서비스에서 사용하는 선택기·달력·편집기 이벤트를 먼저 확인한다. 이미 위젯이 연결된 곳은 `controls:false`로 시작해 이중 초기화를 막는다. UI의 ID·name·값·CSRF·서버 조건·제출·권한은 유지한다. `mountControls`를 직접 사용할 때도 명시한 root 안에서만 동작한다.

기존 서비스의 전역 토큰과 충돌을 피하려면 위 예제의 `tokens.css` 대신 `ui/tokens-scoped.css`를 연결한다. 둘 중 하나만 사용한다. 범위 토큰은 `.dds-ui` 밖에 영향을 주지 않으며 중첩된 DDS 영역은 바깥 값을 상속한다. 기본 토큰값과 라이트/다크값은 전역 버전과 동일하다. 호스트가 다크인 상태에서 DDS 일부만 라이트로 강제하는 별도 reset은 제공하지 않는다.

## 콘텐츠 변경

디자인 규격과 견본 콘텐츠를 구분한다. 검색창의 도움말, 카드의 상태·날짜, 모달의 문서 예시는 필수 요소가 아니다. 생략해도 버튼·입력의 최종 디자인은 같다. 화면 구조와 정보 밀도는 [페이지 구성 기준](./composition.md)을 함께 따른다.

- `text`: registry의 `kind:text` 파트에 일반 문자열을 넣는다. HTML로 해석하지 않는다.
- `attributes`: `kind:attributes` 파트의 name·value·href·disabled·aria 등 허용된 속성을 바꾼다. class·style·실행 속성은 받지 않는다.
- `slots`: `kind:slot` 파트에 DOM 노드·Fragment·일반 문자열을 넣는다. 노드는 서비스가 안전하게 생성한 콘텐츠여야 한다.
- `props`: Button의 공식 variant·color·size·아이콘·loading 속성이다. 등록된 조합만 사용한다.
- `data`: 차트의 실제 제목·항목·계열·단위다. 서비스 생성 API는 차트에 명시적인 data를 요구한다.
- `tabs`: `{label, content}` 배열로 탭과 연결 패널을 함께 만들 수 있다.
- `variants`: `registry.json`에 등록된 유형·크기·상태·표현을 선택한다. 지원하지 않는 값은 오류로 처리한다. 표시 옵션의 `false`는 제공한 콘텐츠에도 적용한다. `true`는 생략한 설명·개수 등을 자동으로 채우지 않는다. 버튼은 기존 `props`, 차트는 `data`를 사용한다.
- `optional`: 선택 콘텐츠 파트별 `true|false`다. 예: `{hint:false}`. 설명은 `text.hint`처럼 실제 내용을 전달하면 나타나고, 생략하면 숨겨진다. 빈 설명 영역을 남기기 위해 공백 문구를 넣지 않는다.
- `items`: Chip·Checkbox·Radio의 `{label,value,selected,disabled}` 배열이다. 견본의 세 항목을 서비스 기본 목록으로 사용하지 않는다. 개별 Chip·Avatar·Icon button·Badge는 기본 한 개부터 생성한다.

파트 이름과 선택자는 `registry.json`의 해당 컴포넌트에 있다. 기본 문구·개수·상태·링크·날짜는 원본을 확인하기 위한 값이므로 실제 서비스 데이터로 교체한다. 컴포넌트의 내부 규격과 페이지 배치는 아래 기준으로 구분한다.

## 대시보드 현황

Card·Icon 조합의 현황 표시는 `metricContent(options, icon)`을 사용한다. `.dds-ui` 안의 `.dds-content-card.dds-metric`에 결과를 연결한다. `metricTrend(value, previous, options)`는 숫자의 방향과 지표별 긍정·부정 판단을 별도로 반환한다. API 옵션·비교 단위·결측값·읽기 전용/선택형 사용법은 [페이지 구성 기준](./composition.md)의 대시보드 현황을 따른다. 스타일은 `ui/dds.css`에 포함되며 블록 전용 CSS를 복사하지 않는다.

## 구분선형 목록

Item은 `variants: {appearance: 'divided'}`로 외곽 경계 없이 행 사이를 나눈다. 기본값은 `outlined`다. `firstLeading`·`firstMetadataContent`·`firstTrailingInfo`·`firstActions` 슬롯으로 첫 행의 앞 요소·보조정보·후행 정보·독립 행동을 연결한다. 후행 정보와 행동은 제공할 때만 표시된다. 북마크·메뉴 버튼은 링크 바깥의 `firstActions`에 둔다.

여러 행은 `slots.items`에 실제 `<li>` 노드를 전달하거나 `ui/index.js`의 `renderItemList(items, {appearance, label})`로 같은 구조를 생성한다. 각 항목의 `title`·`href`·`metadata`는 이 helper가 이스케이프한다. `slots.leading`·`metadata`·`trailingInfo`·`actions`는 개발자가 작성한 안전한 DDS HTML 전용이며 사용자 입력 HTML을 넣지 않는다. 사용자 문자열·DOM을 직접 연결할 때는 `createComponent`의 슬롯을 사용한다. 이 helper는 마크업만 생성하며 실제 이동·북마크 저장은 서비스에서 연결한다. [페이지 구성 기준](./composition.md)의 목록·블록 사용 방법을 함께 따른다.

## 크기와 배치

컨트롤 높이·글자·내부 패딩·색·경계·모서리·상태는 DDS 규격을 유지한다. 가용 폭, 페이지 그리드, 컴포넌트 바깥 여백과 필요한 영역 높이는 서비스에서 정한다.

입력·목록·탭 본문과 실제 미디어는 부모의 가용 폭을 사용한다. 모달 안의 필드는 본문 폭을 채우고, 2열 폼에서는 각 셀의 폭을 채운다. 버튼·아이콘은 내용과 공식 크기를 따르며 달력·팝업·모달의 고유 크기와 화면 경계 제한은 유지한다. 모든 요소를 무조건 100%로 늘리지 않는다.

`component-layout.css`의 공통 배치 정책은 `ui/dds.css`에 포함되어 있으므로 별도로 중복 로드하지 않는다. 문서 전용 `component-specimens.css`는 SDK 묶음에 포함하지 않는다. 문서의 440px 폭 제한·가운데 정렬·축소 비율·견본 미디어 프레임을 서비스 배치에 복사하지 않는다. Video의 실제 영상은 `slots.media`에 넣고, 견본 프레임으로 한 번 더 감싸지 않는다.

스크롤 영역에 높이가 필요하면 페이지의 부모에 `--dds-scroll-height`와 `--dds-scroll-max-height`를 지정한다. 기본값은 각각 `auto`, `none`이다. 컴포넌트 내부를 다시 스타일링하거나 견본의 높이를 기본값으로 복사하지 않는다.

Top navigation은 전체 헤더 폭의 부모에 연결한다. 부모의 `--dds-topnav-content-width`로 좌우 여백을 포함한 내부 최대 폭을, `--dds-topnav-gutter`로 좌우 여백을 정한다. 하단 1px 경계는 바깥 헤더에 유지한다. `100vw`나 음수 여백으로 부모를 벗어나게 하지 않는다. 테마 전환 버튼은 푸터에 하나만 두며 기존 provider·저장 키를 재사용한다. 아이콘 버튼의 기능 이름과 hover·키보드 탐색 툴팁을 갱신한다.

열린 모달의 제목·본문·행동 사이 간격은 원본이 제공한다. 문서 견본의 상하 margin을 복사하지 않으며 슬롯 내부의 필드·문단 배치는 서비스에서 정한다.

## 프레임워크와 기존 템플릿

React·Vue 등에서는 현재 프레임워크를 유지한다. 클라이언트 root를 만들어 위 API를 연결하거나, `templates/<id>.html`을 해당 프레임워크 문법으로 옮기고 `dds.css`를 그대로 쓴다. 선택한 variant의 필수 구조와 라벨·aria 관계를 유지하고 보조 콘텐츠는 조건부 출력한다. 모든 견본 요소를 강제로 남기지 않는다.

Django 등 서버 템플릿도 같은 HTML을 사용한다. `dds-instance`로 시작하는 ID와 `for`·`aria-*` 참조를 인스턴스마다 고유하게 치환하고 값은 템플릿 엔진의 escaping을 유지한다. 실제 서비스의 기존 ID가 필요하면 그 ID와 연결 관계를 보존한다. 자산의 src/href는 서비스의 정적 경로로 연결한다.

`.dds-ui`는 UI 스타일의 명시적인 범위다. `createComponent`가 이 래퍼를 만든다. 서버 템플릿을 사용할 때도 유지한다. 페이지 제목에 `.dds-type-*` 역할을 쓰려면 그 텍스트도 DDS 범위 안에 둔다. 바깥 `.dds-ui` 래퍼는 `display:contents`로 배치 상자를 만들지 않는다. 서비스의 부모 요소에서 폭과 배치를 정하면 내부의 실제 UI가 그 공간을 사용한다.

## 저장한 디자인 설정

디자인 설정 패널에서 저장한 값은 프로젝트 설정 프롬프트에 JSON으로 포함된다. 미저장 미리보기는 포함되지 않는다. 프로젝트에 `docs/dds-profile.json`으로 기록하고, 설치한 `ui/profile.js`의 `createProfileCSS(profile,{scoped:false})`로 `ui/project-profile.css`를 생성해 토큰과 `ui/dds.css` 다음에 연결한다. 범위 토큰을 사용하면 `scoped:true`를 선택한다. 다른 위치에 저장하면 `assetBase`를 실제 폰트 디렉터리의 상대 경로로 맞춘다.

선택한 제목·본문 서체의 `assets/fonts/<서체>/fontfaces.css`와 연결된 WOFF2·라이선스도 함께 배포한다. 기본 토큰이나 고정 릴리스는 수정하지 않는다. 같은 저장 설정에서 라이트·다크·hover·active 색상을 생성하며 기능 색상은 의미가 있는 표면에 `data-dds-color-role="secondary|accent|positive"`로 연결한다.

## 동작과 검수

`mountDDS`는 선택·탭·열기/닫기·포커스·로컬 표시 등 UI 동작을 맡는다. 저장·AI·결제·업로드·계정 변경은 실행하지 않는다. `dds:action` 이벤트 또는 `onAction`에서 기존 서비스의 처리 함수를 연결하고 실제 결과에 따라 상태를 갱신한다. 기본 예제의 성공 문구를 처리 결과로 사용하지 않는다.

320px·390px·PC, 라이트·다크, 긴 문구·빈 값·오류·대기, Tab·방향키·Escape, 폼 reset과 실제 제출 값을 확인한다. 부모 폭 240·320·510·800px와 Grid/Flex 안에서도 배치해 입력·목록·탭 본문이 가용 폭을 사용하는지 확인한다. 모달의 전체 폭 필드, 2열의 각 필드와 실제 이미지·영상 슬롯도 확인한다.

계산된 폰트·색·경계·내부 패딩·컨트롤 높이는 원본과 대조한다. 외부 폭·여백·영역 높이는 서비스 부모를 기준으로 판단한다. 기존 선택자나 `!important`가 내부 규격을 덮으면 연결과 우선순위를 해결한다.

컴포넌트 디자인을 바꾸는 DDS 유지보수는 `ui:build`로 원본·CSS·registry·HTML을 갱신한 뒤 새 버전을 발행한다. 기존 고정 버전은 덮어쓰지 않는다. 앱에 이미 등록된 버전을 자동으로 바꾸지 않는다.
