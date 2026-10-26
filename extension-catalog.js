// DDS component definitions and searchable aliases.
const entries = [
['action-area','Action area','행동 영역','Actions','양식 하단의 주·보조 행동을 묶습니다.','Actions · Supporting text','Inline · Sticky · Disabled','긴 폼에서는 마지막 입력과 행동 사이에 여백을 두고 모바일 안전 영역을 확보합니다.'],
['text-button','Text button','텍스트 버튼','Actions','약한 강조의 보조 행동을 제공합니다.','Label · Optional icon','Default · Hover · Focus · Disabled','페이지 이동에는 링크, 상태 변경에는 버튼을 사용합니다.'],
['button-group','Button group','버튼 그룹','Actions','서로 연관된 행동을 나란히 묶습니다.','Group · Buttons · Separator','Default · Focus · Disabled','각 버튼의 이름을 유지하고 그룹의 목적을 설명합니다.'],
['toggle','Toggle','토글 버튼','Actions','한 기능의 켜짐을 버튼으로 표시합니다.','Button · Icon · Pressed state','Off · On · Disabled','aria-pressed로 상태를 전달하며 라벨의 의미를 바꾸지 않습니다.'],
['toggle-group','Toggle group','토글 그룹','Actions','여러 형식 옵션을 독립적으로 선택합니다.','Group · Toggle items','None · Multiple · Disabled','다중 선택과 단일 선택 그룹을 명확히 구분합니다.'],
['filter-button','Filter button','필터 버튼','Actions','필터 적용 여부와 조건을 보여 줍니다.','Label · Count · Reset','Default · Applied · Reset','조건을 바꿔도 검색어를 보존하고 초기화 동작을 제공합니다.'],
['calendar','Calendar','인라인 달력','Inputs','상시 노출되는 달력에서 날짜를 선택합니다.','Month controls · Weekdays · Days · Selection','Today · Selected · Adjacent month','키보드 방향키로 날짜를 탐색하고 선택값을 문자로도 표시합니다.'],
['field','Field / Form','폼 필드 그룹','Inputs','라벨·입력·도움말·오류를 하나의 규칙으로 연결합니다.','Legend · Label · Control · Hint · Error','Empty · Invalid · Valid · Submitted','aria-describedby로 설명과 오류를 연결하고 제출 오류에서는 첫 오류로 초점을 이동합니다.'],
['input-group','Input group','복합 입력','Inputs','접두사·아이콘·보조 행동을 하나의 입력 경계에 담습니다.','Leading slot · Input · Trailing action','Idle · Focus within · Invalid · Disabled','포커스는 1px Primary 바깥 테두리에만 적용합니다. 비밀번호 표시 전환은 현재 값을 보존합니다.'],
['input-otp','Input OTP','인증번호 입력','Inputs','붙여넣기와 모바일 자동완성이 가능한 인증번호 입력입니다.','Label · Single input · Digit spacing · Status','Empty · Partial · Complete · Invalid','하나의 실제 입력에 autocomplete=one-time-code를 사용합니다. 예제는 인증 서버와 연결되지 않습니다.'],
['label','Label','입력 라벨','Inputs','값을 입력한 뒤에도 남는 필드 이름입니다.','Text · Required marker · Optional hint','Required · Optional · Disabled','for/id를 연결하고 placeholder를 라벨 대신 사용하지 않습니다.'],
['slider','Slider','슬라이더','Inputs','범위 안의 연속적인 값을 선택합니다.','Label · Track · Thumb · Value','Min · Intermediate · Max · Disabled','직접 숫자 표현과 방향키 조작을 제공하며 핵심 정밀 입력을 슬라이더에만 맡기지 않습니다.'],
['segmented-control','Segmented control','분할 선택','Inputs','짧은 선택지 중 하나를 고릅니다.','Group label · Options · Selected surface','Selected · Focus · Disabled','값 선택에는 radio 의미를 사용합니다. 콘텐츠 패널 전환은 Tabs를 사용합니다.'],
['framed-style','Framed choice','프레임 선택','Inputs','설명을 포함한 항목 전체의 선택을 표현합니다.','Frame · Radio / Checkbox · Content','Default · Selected · Invalid · Disabled','프레임과 내부 컨트롤의 선택 상태를 항상 일치시킵니다.'],
['time-picker','Time picker','시간 선택','Inputs','상담 시작 시각을 시·분 단위로 선택합니다.','Hour · Minute · Timezone · Selected value','Empty · Selected · Disabled','브라우저 기본 시계 아이콘 대신 공통 Select를 사용하며 시간대를 표시합니다.'],
['questionnaire','Questionnaire','단계형 질문','Inputs','단일·복수 선택과 자유 입력 질문을 순서대로 진행합니다.','Progress · Question · Choices · Back / Next','Required · Answered · Skipped · Complete','이전 답을 유지하고 필수 질문과 선택 질문을 구분합니다. 실제 제출은 별도 서버 계약입니다.'],
['navigation-menu','Navigation menu','내비게이션 메뉴','Navigation','서비스의 주요 영역과 하위 링크를 탐색합니다.','Navigation · Trigger · Link group','Closed · Open · Current · Focus','페이지 이동 링크를 유지하고 Escape로 하위 메뉴를 닫습니다.'],
['top-navigation','Top navigation','상단 내비게이션','Navigation','로고·현재 영역·계정 행동을 배치합니다.','Brand · Links · Account action','Desktop · Mobile · Current','좁은 화면에서도 주요 행동을 잃지 않도록 줄바꿈 또는 메뉴 전환을 제공합니다.'],
['bottom-navigation','Bottom navigation','하단 내비게이션','Navigation','모바일의 핵심 목적지를 지속해서 제공합니다.','Icon · Label · Current destination','Default · Current · Focus','3–5개 주요 목적지만 두며 레이블을 함께 표시합니다.'],
['category','Category','카테고리','Navigation','주제별 콘텐츠를 나누어 탐색합니다.','Category list · Current · Result','All · Selected · Empty','선택된 카테고리와 결과 제목을 함께 변경합니다.'],
['page-counter','Page counter','페이지 카운터','Navigation','현재 위치와 전체 개수를 간단히 표시합니다.','Current · Total · Previous / Next','First · Middle · Last','숫자 표시만으로 이동 기능을 암시하지 않습니다.'],
['pagination-dots','Pagination dots','페이지 점 표시','Navigation','소수의 슬라이드 위치를 표시하고 이동합니다.','Dots · Current · Accessible labels','First · Middle · Last','각 점에 목적지 이름을 제공하고 현재 위치를 aria-current로 표시합니다.'],
['menubar','Menubar','메뉴 바','Navigation','편집 화면의 명령을 카테고리별로 정리합니다.','Bar · Menu triggers · Menu items','Closed · Open · Keyboard focus','방향키 이동과 Escape 복귀를 지원합니다. 전역 사이트 링크와 편집 명령을 구분합니다.'],
['command','Command','명령 검색','Navigation','명령을 검색하고 키보드로 실행합니다.','Search · Results · Empty result · Shortcut','Empty · Filtered · No result · Executed','검색어와 선택 결과를 구분하고 방향키·Enter·Escape를 지원합니다.'],
['context-menu','Context menu','컨텍스트 메뉴','Navigation','대상에 관한 보조 명령을 제공합니다.','Target · Trigger · Menu · Items','Closed · Open · Focus','우클릭 외에 보이는 메뉴 버튼과 Shift+F10 진입을 함께 제공합니다.'],
['alert-dialog','Alert dialog','확인 다이얼로그','Feedback','삭제 등 영향이 있는 행동을 실행하기 전에 확인합니다.','Scrim · Title · Description · Cancel · Confirm','Closed · Open · Confirmed · Cancelled','최초 초점은 취소에 두고 실제 대상과 결과를 명시합니다. 예제는 데이터 삭제를 수행하지 않습니다.'],
['sheet','Sheet','사이드 시트','Feedback','현재 맥락을 유지하며 옆에서 보조 작업을 엽니다.','Scrim · Title · Body · Close','Closed · Open · Focus trapped','모달 영역 안에 초점을 유지하고 닫으면 원래 트리거로 돌아갑니다.'],
['drawer','Drawer / Bottom sheet','하단 시트','Feedback','모바일에서 아래쪽에 선택·보조 행동을 엽니다.','Scrim · Heading · Content · Actions','Closed · Open · Confirmed','닫기 버튼을 제공하고 스와이프 동작에만 의존하지 않습니다. DDS 예제는 버튼으로 열고 닫습니다.'],
['popover','Popover','팝오버','Feedback','트리거 가까이에 짧은 설정이나 설명을 엽니다.','Trigger · Surface · Content · Close','Closed · Open · Focus','화면 가장자리에 맞춰 위치를 조정하고 Escape와 바깥 클릭으로 닫습니다.'],
['hover-card','Hover card','호버 카드','Feedback','프로필의 추가 정보를 주변 맥락에서 미리 봅니다.','Trigger · Preview surface · Metadata','Hidden · Hover · Focus · Click','클릭·키보드로도 열 수 있어야 하며 필수 정보는 상세 화면에서 제공합니다.'],
['snackbar','Snackbar','행동형 알림','Feedback','짧은 결과와 되돌리기 행동을 함께 제공합니다.','Message · Undo · Dismiss','Shown · Undone · Dismissed','행동이 있는 알림을 너무 빨리 자동으로 닫지 않습니다.'],
['spinner','Spinner / Loading','스피너','Feedback','완료율을 모르는 처리의 대기 상태를 표현합니다.','Indicator · Status text','Loading','무한 회전을 완료율로 해석하지 않도록 처리 내용을 함께 표시합니다.'],
['fallback-view','Fallback view','오류 대체 화면','Feedback','오류·연결 실패에서 복구 경로를 제공합니다.','Symbol · Reason · Retry · Alternative','Error · Retrying · Recovered','빈 상태와 실패를 구별합니다. 예제 재시도는 로컬 화면만 갱신합니다.'],
['push-badge','Push badge','알림 배지','Feedback','읽지 않은 알림의 개수를 표현합니다.','Anchor · Count / Dot · Accessible name','Zero · Count · Overflow','99+ 등 최대 표현과 실제 읽기 이름을 구분하고 알림 개수를 버튼 이름에도 포함합니다.'],
['aspect-ratio','Aspect ratio','고정 비율','Data display','미디어의 공간을 미리 확보해 화면 이동을 줄입니다.','Ratio box · Media · Fallback','16:9 · 4:3 · 1:1','콘텐츠의 의미에 맞춰 cover/contain을 선택합니다.'],
['thumbnail','Thumbnail','썸네일','Data display','콘텐츠 대표 이미지를 일정한 크기로 표시합니다.','Image · Ratio · Fallback · Overlay','Loaded · Missing · Rounded','원본 이미지가 없을 때 장식 그림을 실제 콘텐츠로 오인하게 만들지 않습니다.'],
['play-badge','Play badge','재생 표시','Data display','영상 콘텐츠의 재생 가능 여부와 길이를 표시합니다.','Play icon · Duration · Accessible name','Ready · Focus · Unavailable','실제 플레이어와 연결될 때만 재생 동작으로 제공합니다. DDS에서는 안내 예제입니다.'],
['avatar-group','Avatar group','아바타 그룹','Data display','참여자의 프로필을 겹쳐서 요약합니다.','Avatars · Overflow count · Group label','One · Multiple · Overflow','이름 전체에 접근할 수 있는 경로를 제공하며 겹침 때문에 이름이 가려지지 않게 합니다.'],
['list-card','List card','목록 카드','Data display','이미지·제목·메타데이터를 수평으로 묶습니다.','Thumbnail · Title · Metadata · Action','Default · Hover · Loading','제목 링크와 보조 행동을 중첩하지 않습니다.'],
['item','Item / List cell','목록 항목','Data display','반복 목록의 제목·설명·보조 행동을 정렬합니다.','Leading · Content · Trailing','Default · Selected · Disabled','표보다 단순한 정보를 목록 구조로 표현하며 반복 항목의 높이 규칙을 유지합니다.'],
['section-header','Section header','섹션 헤더','Data display','정보 묶음의 제목과 보조 행동을 정의합니다.','Heading · Count · Description · Action','Default · With action · With count','문서의 제목 계층을 따르며 제목 자체를 버튼으로 만들지 않습니다.'],
['attachment','Attachment','첨부파일 항목','Data display','파일명·형식·처리 상태와 제거 행동을 묶습니다.','Media · Filename · Metadata · Action','Selected · Processing · Done · Removed · Error','파일 선택과 업로드 완료를 구분하고 제거 버튼에 파일명을 포함합니다.'],
['carousel','Carousel','캐러셀','Data display','콘텐츠를 한 장씩 탐색합니다.','Viewport · Slide · Previous / Next · Counter','First · Middle · Last','자동 재생 없이 시작합니다. 탐색 후 새 슬라이드 제목과 위치를 전달합니다.'],
['collapsible','Collapsible','접기·펼치기','Data display','하나의 보조 정보 영역을 펼칩니다.','Trigger · Indicator · Content','Closed · Open · Focus','트리거 이름을 유지하며 펼침 상태를 전달합니다.'],
['separator','Separator / Divider','구분선','Data display','인접한 정보 그룹의 경계를 표현합니다.','Horizontal / Vertical rule','Horizontal · Vertical · Decorative','장식용 구분선에는 불필요한 읽기 순서를 추가하지 않습니다.'],
['kbd','Kbd','단축키 표시','Data display','사용 가능한 키보드 조합을 시각적으로 설명합니다.','Key label · Combination','Single · Combination','표시는 실제 구현된 단축키와 일치해야 합니다.'],
['scroll-area','Scroll area','스크롤 영역','Data display','긴 보조 목록을 지정한 영역 안에서 탐색합니다.','Viewport · Content · Scrollbar','Start · Scrolled · End','영역에 이름과 키보드 초점을 제공하고 스크롤 가능함을 숨기지 않습니다.'],
['resizable','Resizable','크기 조절 패널','Data display','원문과 피드백 영역의 비율을 조절합니다.','Panel · Separator handle · Panel','Default · Resized · Min / Max','드래그와 방향키를 함께 지원하고 모바일에서는 세로로 쌓습니다.'],
['direction','Direction','쓰기 방향','Data display','LTR·RTL에서 논리 방향을 유지합니다.','Direction root · Logical spacing · Content','LTR · RTL','좌우 고정값 대신 inline-start/end를 사용합니다. 한국어 제품의 기본 방향은 LTR입니다.'],
['bubble','Bubble','말풍선','Data display','짧은 발화의 표면과 정렬을 표현합니다.','Surface · Content · Alignment','Incoming · Outgoing · Long text','발화의 주체는 상위 Message에서 제공하고 사용자 입력은 HTML로 실행하지 않습니다.'],
['message','Message','메시지','Data display','발화자·시간·본문을 하나의 대화 항목으로 묶습니다.','Avatar · Author · Body · Time · Actions','Received · Sent · Pending · Failed','발화자와 상태를 명시합니다. 예제는 실제 채팅이나 AI 응답을 전송하지 않습니다.'],
['marker','Marker','대화 상태 구분','Data display','대화 중 날짜·진행·시스템 상태를 구분합니다.','Rule · Icon · Status label','Date · Processing · Complete','사용자 발화와 시스템 정보를 시각적·의미적으로 구분합니다.'],
['message-scroller','Message scroller','대화 스크롤','Data display','대화를 읽는 위치를 유지하며 새 메시지를 확인합니다.','Scroll viewport · Messages · Jump to latest','At bottom · Reading history · New message','이전 내용을 읽는 중에는 강제로 아래로 이동시키지 않습니다. 스트리밍·이력 페이지네이션은 서비스 통합 범위입니다.']
];
export const extensionComponents=entries.map(([id,name,ko,group,description,anatomy,states,rule])=>({id,name,ko,group,description,anatomy,states,rule,source:[],added:true}));

// One row per item in the reference catalogs; aliases are explicit rather than duplicate components.
export const componentAliases=[
  {
    "name": "Action area",
    "target": "action-area"
  },
  {
    "name": "Button",
    "target": "button"
  },
  {
    "name": "Chip",
    "target": "chip"
  },
  {
    "name": "Icon button",
    "target": "icon-button"
  },
  {
    "name": "Text button",
    "target": "text-button"
  },
  {
    "name": "Accordion",
    "target": "accordion"
  },
  {
    "name": "Avatar",
    "target": "avatar"
  },
  {
    "name": "Avatar group",
    "target": "avatar-group"
  },
  {
    "name": "Card",
    "target": "card"
  },
  {
    "name": "Content badge",
    "target": "badge"
  },
  {
    "name": "List card",
    "target": "list-card"
  },
  {
    "name": "List cell",
    "target": "item"
  },
  {
    "name": "Play badge",
    "target": "play-badge"
  },
  {
    "name": "Section header",
    "target": "section-header"
  },
  {
    "name": "Table",
    "target": "table"
  },
  {
    "name": "Thumbnail",
    "target": "thumbnail"
  },
  {
    "name": "Alert",
    "target": "alert-dialog"
  },
  {
    "name": "Fallback view",
    "target": "fallback-view"
  },
  {
    "name": "Push badge",
    "target": "push-badge"
  },
  {
    "name": "Section message",
    "target": "alert"
  },
  {
    "name": "Snackbar",
    "target": "snackbar"
  },
  {
    "name": "Toast",
    "target": "toast"
  },
  {
    "name": "Loading",
    "target": "spinner"
  },
  {
    "name": "Skeleton",
    "target": "skeleton"
  },
  {
    "name": "Bottom navigation",
    "target": "bottom-navigation"
  },
  {
    "name": "Category",
    "target": "category"
  },
  {
    "name": "Page counter",
    "target": "page-counter"
  },
  {
    "name": "Pagination",
    "target": "pagination"
  },
  {
    "name": "Pagination dots",
    "target": "pagination-dots"
  },
  {
    "name": "Progress indicator",
    "target": "progress"
  },
  {
    "name": "Progress tracker",
    "target": "stepper"
  },
  {
    "name": "Tab",
    "target": "tabs"
  },
  {
    "name": "Top navigation",
    "target": "top-navigation"
  },
  {
    "name": "Autocomplete",
    "target": "combobox"
  },
  {
    "name": "Bottom sheet",
    "target": "drawer"
  },
  {
    "name": "Menu",
    "target": "dropdown"
  },
  {
    "name": "Popover",
    "target": "popover"
  },
  {
    "name": "Popup",
    "target": "dialog"
  },
  {
    "name": "Tooltip",
    "target": "tooltip"
  },
  {
    "name": "Check mark",
    "target": "checkbox"
  },
  {
    "name": "Checkbox",
    "target": "checkbox"
  },
  {
    "name": "Date Picker",
    "target": "date-picker"
  },
  {
    "name": "Filter button",
    "target": "filter-button"
  },
  {
    "name": "Framed style",
    "target": "framed-style"
  },
  {
    "name": "Radio",
    "target": "radio"
  },
  {
    "name": "Search field",
    "target": "search"
  },
  {
    "name": "Segmented control",
    "target": "segmented-control"
  },
  {
    "name": "Select",
    "target": "select"
  },
  {
    "name": "Slider",
    "target": "slider"
  },
  {
    "name": "Switch",
    "target": "switch"
  },
  {
    "name": "Text area",
    "target": "textarea"
  },
  {
    "name": "Text field",
    "target": "input"
  },
  {
    "name": "Time picker",
    "target": "time-picker"
  },
  {
    "name": "Alert",
    "target": "alert"
  },
  {
    "name": "Alert Dialog",
    "target": "alert-dialog"
  },
  {
    "name": "Aspect Ratio",
    "target": "aspect-ratio"
  },
  {
    "name": "Attachment",
    "target": "attachment"
  },
  {
    "name": "Badge",
    "target": "badge"
  },
  {
    "name": "Breadcrumb",
    "target": "breadcrumb"
  },
  {
    "name": "Bubble",
    "target": "bubble"
  },
  {
    "name": "Button Group",
    "target": "button-group"
  },
  {
    "name": "Calendar",
    "target": "calendar"
  },
  {
    "name": "Carousel",
    "target": "carousel"
  },
  {
    "name": "Chart",
    "target": "chart"
  },
  {
    "name": "Collapsible",
    "target": "collapsible"
  },
  {
    "name": "Combobox",
    "target": "combobox"
  },
  {
    "name": "Command",
    "target": "command"
  },
  {
    "name": "Context Menu",
    "target": "context-menu"
  },
  {
    "name": "Data Table",
    "target": "table"
  },
  {
    "name": "Dialog",
    "target": "dialog"
  },
  {
    "name": "Direction",
    "target": "direction"
  },
  {
    "name": "Drawer",
    "target": "drawer"
  },
  {
    "name": "Dropdown Menu",
    "target": "dropdown"
  },
  {
    "name": "Empty",
    "target": "empty"
  },
  {
    "name": "Field",
    "target": "field"
  },
  {
    "name": "Hover Card",
    "target": "hover-card"
  },
  {
    "name": "Input",
    "target": "input"
  },
  {
    "name": "Input Group",
    "target": "input-group"
  },
  {
    "name": "Input OTP",
    "target": "input-otp"
  },
  {
    "name": "Item",
    "target": "item"
  },
  {
    "name": "Kbd",
    "target": "kbd"
  },
  {
    "name": "Label",
    "target": "label"
  },
  {
    "name": "Marker",
    "target": "marker"
  },
  {
    "name": "Menubar",
    "target": "menubar"
  },
  {
    "name": "Message",
    "target": "message"
  },
  {
    "name": "Message Scroller",
    "target": "message-scroller"
  },
  {
    "name": "Native Select",
    "target": "select"
  },
  {
    "name": "Navigation Menu",
    "target": "navigation-menu"
  },
  {
    "name": "Progress",
    "target": "progress"
  },
  {
    "name": "Questionnaire",
    "target": "questionnaire"
  },
  {
    "name": "Radio Group",
    "target": "radio"
  },
  {
    "name": "Resizable",
    "target": "resizable"
  },
  {
    "name": "Scroll Area",
    "target": "scroll-area"
  },
  {
    "name": "Separator",
    "target": "separator"
  },
  {
    "name": "Sheet",
    "target": "sheet"
  },
  {
    "name": "Sidebar",
    "target": "sidebar"
  },
  {
    "name": "Spinner",
    "target": "spinner"
  },
  {
    "name": "Tabs",
    "target": "tabs"
  },
  {
    "name": "Textarea",
    "target": "textarea"
  },
  {
    "name": "Toggle",
    "target": "toggle"
  },
  {
    "name": "Toggle Group",
    "target": "toggle-group"
  },
  {
    "name": "Typography",
    "target": "@typography"
  }
];
