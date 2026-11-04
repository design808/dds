/**
 * 커리어온의 공고 목록·검색·상세가 함께 사용하는 로컬 데이터.
 * 이 파일의 기업과 채용 공고는 모두 가상이다. 외부 채용 정보나 지원 API를 사용하지 않는다.
 * 날짜를 사용하는 화면과 검증은 DATA_AS_OF를 기준으로 한다.
 */
export const DATA_AS_OF = '2026-11-04';

export const filterOptions = Object.freeze({
  category: Object.freeze(['개발', '디자인', '기획·PM', '마케팅', '비즈니스', '운영']),
  location: Object.freeze(['서울', '경기', '부산', '원격']),
  experience: Object.freeze(['신입', '주니어', '시니어', '경력 무관']),
  workMode: Object.freeze(['사무실', '하이브리드', '원격']),
  employmentType: Object.freeze(['정규직', '계약직', '인턴']),
});
export const categories = filterOptions.category;
export const sortOptions = Object.freeze([
  Object.freeze({ value: 'latest', label: '최신 등록순' }),
  Object.freeze({ value: 'deadline', label: '마감 임박순' }),
  Object.freeze({ value: 'company', label: '기업명순' }),
]);

export const companies = [
  {
    id: 'moaroot', name: '모아루트', industry: '협업 소프트웨어', location: '서울', initial: '모',
    description: '모아루트는 흩어진 팀의 업무와 의사결정을 한곳에서 관리하는 협업 서비스를 만듭니다. 기록을 남기는 일부터 다음 업무를 정하는 과정까지 자연스럽게 연결하고자 합니다.',
    culture: ['제안의 배경과 결정 과정을 문서로 공유합니다.', '기획·디자인·개발이 작은 단위로 제품을 함께 검증합니다.'],
    benefits: ['주 2회 원격근무', '업무 관련 도서·교육 지원', '집중 업무 시간 운영'],
  },
  {
    id: 'flowbasket', name: '플로우바스켓', industry: '생활 커머스', location: '경기', initial: '플',
    description: '플로우바스켓은 매일 사용하는 생활용품을 비교하고 선택하는 커머스 서비스를 운영합니다. 상품을 찾는 과정과 구매 후 경험을 함께 개선합니다.',
    culture: ['문제의 크기보다 고객이 겪는 불편을 먼저 확인합니다.', '운영 현장의 관찰과 제품 데이터를 함께 살펴봅니다.'],
    benefits: ['유연 출근제', '업무 장비 지원', '팀별 학습 모임 지원'],
  },
  {
    id: 'harborpath', name: '하버패스', industry: '여행·로컬', location: '부산', initial: '하',
    description: '하버패스는 지역의 작은 공간과 여행자를 연결합니다. 숙소·체험 파트너가 자신의 공간을 소개하고 여행자가 일정을 계획할 수 있는 서비스를 만듭니다.',
    culture: ['지역 파트너의 일하는 방식을 직접 이해합니다.', '서비스 현장과 제품 팀이 정기적으로 의견을 나눕니다.'],
    benefits: ['유연 출근제', '지역 문화·체험 활동 지원', '업무 관련 교육 지원'],
  },
  {
    id: 'papermint', name: '페이퍼민트', industry: '교육·콘텐츠', location: '원격', initial: '페',
    description: '페이퍼민트는 배운 내용을 기록하고 복습하는 학습 도구를 만듭니다. 짧은 학습이 일상의 습관으로 이어지도록 콘텐츠와 제품 경험을 연결합니다.',
    culture: ['원격 환경에서도 업무의 맥락을 문서로 공유합니다.', '회의가 필요한 일과 비동기로 진행할 일을 구분합니다.'],
    benefits: ['국내 원격근무', '원격 업무 장비 지원', '학습 콘텐츠·도서 지원'],
  },
  {
    id: 'daygrain', name: '데이그레인', industry: '건강·라이프스타일', location: '서울', initial: '데',
    description: '데이그레인은 수면·활동·식사 기록을 바탕으로 자신의 생활 리듬을 돌아보는 서비스를 만듭니다. 부담 없는 기록과 이해하기 쉬운 정보에 집중합니다.',
    culture: ['정답을 단정하기보다 사용자의 서로 다른 생활을 이해합니다.', '실험의 결과와 배운 점을 팀 전체에 공유합니다.'],
    benefits: ['주 2회 원격근무', '건강 활동 지원', '업무 관련 세미나 지원'],
  },
  {
    id: 'roundfield', name: '라운드필드', industry: '공간·예약', location: '경기', initial: '라',
    description: '라운드필드는 회의실·스튜디오·작업 공간의 예약과 운영을 돕습니다. 이용자에게는 명확한 예약 경험을, 공간 운영자에게는 간단한 관리 도구를 제공합니다.',
    culture: ['운영자의 실제 업무를 관찰하고 개선점을 찾습니다.', '작은 개선도 적용 후의 변화를 함께 확인합니다.'],
    benefits: ['시차 출퇴근제', '업무 장비 지원', '공간 체험·리서치 지원'],
  },
  {
    id: 'slowwave', name: '슬로웨이브', industry: '로컬 콘텐츠', location: '부산', initial: '슬',
    description: '슬로웨이브는 도시의 사람·가게·문화를 소개하는 콘텐츠 서비스를 운영합니다. 지역의 이야기를 꾸준히 발견하고 읽기 좋은 형태로 전달합니다.',
    culture: ['기획부터 발행까지 편집 과정에 함께 참여합니다.', '출처와 표현을 확인하며 오래 읽을 수 있는 콘텐츠를 만듭니다.'],
    benefits: ['유연 출근제', '취재·문화 활동 지원', '도서·교육 지원'],
  },
  {
    id: 'threadnote', name: '스레드노트', industry: '업무 생산성', location: '원격', initial: '스',
    description: '스레드노트는 프로젝트 자료와 피드백을 연결하는 업무 도구를 만듭니다. 여러 도구에 흩어진 맥락을 팀이 쉽게 찾고 이어갈 수 있도록 돕습니다.',
    culture: ['목표와 작업 결과를 공개된 문서에 남깁니다.', '동료의 집중 시간을 존중하고 피드백 시간을 정합니다.'],
    benefits: ['국내 원격근무', '홈오피스 장비 지원', '정기 오프라인 팀 모임'],
  },
  {
    id: 'loopgarden', name: '루프가든', industry: '리테일 소프트웨어', location: '서울', initial: '루',
    description: '루프가든은 작은 매장의 상품·주문·고객 관리를 돕는 소프트웨어를 만듭니다. 매장 운영자가 반복 작업을 줄이고 고객을 만나는 일에 집중할 수 있도록 합니다.',
    culture: ['고객과 만난 기록을 제품 팀과 공유합니다.', '기능을 많이 만드는 것보다 자주 쓰는 업무를 편하게 만듭니다.'],
    benefits: ['주 2회 원격근무', '직무 교육 지원', '업무 장비 지원'],
  },
  {
    id: 'nextshelf', name: '넥스트셸프', industry: '물류·재고 관리', location: '경기', initial: '넥',
    description: '넥스트셸프는 소규모 브랜드가 재고와 출고 흐름을 확인할 수 있는 관리 도구를 만듭니다. 현장의 작업과 온라인 데이터를 같은 언어로 연결합니다.',
    culture: ['현장 담당자와 제품 담당자가 함께 문제를 정의합니다.', '변경 전후의 업무 흐름을 기록하고 검토합니다.'],
    benefits: ['유연 출근제', '물류 현장 리서치 지원', '도서·교육 지원'],
  },
  {
    id: 'bridgeday', name: '브리지데이', industry: '커리어·교육', location: '서울', initial: '브',
    description: '브리지데이는 직무를 배우는 사람과 현업의 경험을 연결하는 교육 프로그램을 운영합니다. 배운 내용을 실제 과제에 적용하고 피드백을 받는 경험을 설계합니다.',
    culture: ['참여자의 질문에서 다음 개선 과제를 찾습니다.', '운영과 콘텐츠 담당자가 프로그램을 함께 회고합니다.'],
    benefits: ['시차 출퇴근제', '사내 교육 프로그램 참여', '직무 도서 지원'],
  },
  {
    id: 'tintworks', name: '틴트웍스', industry: '디지털 제작 도구', location: '부산', initial: '틴',
    description: '틴트웍스는 소규모 창작팀을 위한 이미지·문서 제작 도구를 만듭니다. 익숙하지 않은 도구 앞에서도 원하는 결과를 쉽게 만들 수 있는 경험을 추구합니다.',
    culture: ['만든 것을 자주 보여주고 구체적으로 피드백합니다.', '사용자가 막히는 장면을 관찰하며 우선순위를 정합니다.'],
    benefits: ['주 2회 원격근무', '디자인·창작 도구 지원', '전시·교육 지원'],
  },
];

const companyById = new Map(companies.map(company => [company.id, company]));
const baseProcess = ['서류 검토', '직무 인터뷰', '팀 인터뷰', '최종 안내'];

function job(companyId, details) {
  const company = companyById.get(companyId);
  return {
    companyId,
    company: company.name,
    companyDescription: company.description,
    culture: [...company.culture],
    benefits: [...company.benefits],
    process: [...baseProcess],
    employmentType: '정규직',
    ...details,
  };
}

export const jobs = [
  job('moaroot', {
    id: 'moaroot-frontend', title: '프론트엔드 개발자 · 협업 서비스', category: '개발',
    location: '서울', experience: '주니어', workMode: '하이브리드',
    tags: ['React', 'TypeScript', '접근성', 'Frontend'], postedAt: '2026-11-04', deadline: '2026-11-30',
    summary: '팀의 문서와 업무가 자연스럽게 이어지는 웹 경험을 만듭니다.',
    responsibilities: ['React와 TypeScript로 업무·문서 화면을 개발합니다.', '디자이너와 공통 컴포넌트를 개선하고 접근성을 점검합니다.', '화면 성능과 사용 중 발생하는 오류를 분석하고 개선합니다.'],
    requirements: ['JavaScript와 브라우저의 기본 동작을 이해하는 분', 'API를 연결한 웹 화면을 만들고 운영한 경험이 있는 분', '작업의 의도와 변경 내용을 동료에게 설명할 수 있는 분'],
    preferred: ['키보드 접근성과 웹 표준을 고려한 경험', '컴포넌트 테스트나 성능 측정 경험'],
  }),
  job('flowbasket', {
    id: 'flowbasket-backend', title: '백엔드 개발자 · 주문과 결제', category: '개발',
    location: '경기', experience: '시니어', workMode: '사무실',
    tags: ['Kotlin', 'Spring', 'PostgreSQL', 'Backend'], postedAt: '2026-11-02', deadline: '2026-12-08',
    summary: '상품 주문부터 취소·환불까지 안정적으로 이어지는 거래 흐름을 설계합니다.',
    responsibilities: ['주문·결제 도메인의 API와 데이터 구조를 설계합니다.', '거래 상태의 정합성과 예외 처리 흐름을 개선합니다.', '배포·모니터링 체계를 팀과 함께 정비합니다.'],
    requirements: ['서버 애플리케이션의 설계와 운영 경험이 있는 분', '관계형 데이터베이스와 트랜잭션을 이해하는 분', '장애의 원인을 추적하고 재발 방지안을 정리할 수 있는 분'],
    preferred: ['커머스 주문·결제 시스템을 다룬 경험', 'Kotlin 또는 Java와 Spring을 사용한 경험'],
  }),
  job('papermint', {
    id: 'papermint-mobile', title: '모바일 앱 개발자 · 학습 기록', category: '개발',
    location: '원격', experience: '경력 무관', workMode: '원격',
    tags: ['Flutter', 'Dart', '모바일', '학습'], postedAt: '2026-10-29', deadline: null,
    summary: '짧은 기록과 복습이 매끄럽게 연결되는 모바일 앱을 만듭니다.',
    responsibilities: ['Flutter 기반 학습·복습 화면을 개발합니다.', '알림과 오프라인 기록의 동기화 경험을 개선합니다.', '기기별 사용성과 앱 안정성을 점검합니다.'],
    requirements: ['동작하는 모바일 앱을 만든 경험이 있는 분', '비동기 처리와 상태 관리의 기본 원리를 이해하는 분', '원격 환경에서 진행 상황과 질문을 문서로 공유할 수 있는 분'],
    preferred: ['앱 스토어 배포와 업데이트 경험', 'Flutter 또는 네이티브 앱 개발 경험'],
  }),
  job('harborpath', {
    id: 'harborpath-data-engineer', title: '주니어 데이터 엔지니어', category: '개발',
    location: '부산', experience: '신입', workMode: '하이브리드',
    tags: ['Python', 'SQL', '데이터 파이프라인', 'Data'], postedAt: '2026-10-26', deadline: '2026-12-04',
    summary: '지역 여행 서비스의 예약·탐색 데이터를 믿고 활용할 수 있는 기반을 만듭니다.',
    responsibilities: ['예약과 탐색 데이터를 수집·정리하는 파이프라인을 만듭니다.', '데이터 품질을 확인하고 누락·중복 문제를 점검합니다.', '분석 담당자와 지표 정의와 데이터 구조를 정리합니다.'],
    requirements: ['SQL로 데이터를 조회하고 가공할 수 있는 분', 'Python 등 한 가지 프로그래밍 언어로 문제를 해결한 경험이 있는 분', '데이터의 출처와 처리 과정을 꼼꼼하게 기록하는 분'],
    preferred: ['개인 프로젝트에서 데이터 수집·정제를 해본 경험', '배치 작업이나 워크플로 관리 도구에 대한 이해'],
  }),
  job('daygrain', {
    id: 'daygrain-product-designer', title: '프로덕트 디자이너 · 생활 기록', category: '디자인',
    location: '서울', experience: '주니어', workMode: '하이브리드',
    tags: ['Figma', 'UX', '사용자 리서치', 'Product Design'], postedAt: '2026-11-03', deadline: '2026-11-27',
    summary: '사용자가 자신의 생활 리듬을 쉽게 이해하는 기록·리포트 경험을 설계합니다.',
    responsibilities: ['기록과 리포트의 사용자 흐름 및 화면을 설계합니다.', '사용자 인터뷰와 사용성 검증에서 개선점을 찾습니다.', '개발자와 상태·반응형·접근성 기준을 구체화합니다.'],
    requirements: ['문제 정의부터 화면 설계까지의 과정을 설명할 수 있는 분', 'Figma로 화면과 인터랙션을 표현할 수 있는 분', '동료의 피드백을 검토하고 설계 근거를 나눌 수 있는 분'],
    preferred: ['데이터를 이해하기 쉬운 화면으로 표현한 경험', '모바일 서비스의 사용성 검증 경험'],
  }),
  job('tintworks', {
    id: 'tintworks-design-system', title: '디자인 시스템 디자이너', category: '디자인',
    location: '부산', experience: '시니어', workMode: '하이브리드',
    tags: ['디자인 시스템', 'Figma', '컴포넌트', 'Design System'], postedAt: '2026-11-01', deadline: null,
    summary: '제작 도구 전반에 일관되게 쓰이는 컴포넌트와 디자인 규칙을 정리합니다.',
    responsibilities: ['공통 컴포넌트와 토큰의 구조·상태·사용 원칙을 설계합니다.', '제품 팀과 실제 사용 사례를 검토하고 시스템을 개선합니다.', '개발 구현을 확인하고 문서와 변경 사항을 관리합니다.'],
    requirements: ['운영 중인 서비스에서 공통 UI를 체계화한 경험이 있는 분', '컴포넌트의 상태와 접근성을 구체적으로 정의할 수 있는 분', '디자인과 개발 사이의 차이를 조율할 수 있는 분'],
    preferred: ['디자인 토큰을 개발 환경과 연결한 경험', '복잡한 제작·편집 도구를 설계한 경험'],
  }),
  job('threadnote', {
    id: 'threadnote-ux-writer', title: 'UX 라이터 · 제품 언어', category: '디자인',
    location: '원격', experience: '경력 무관', workMode: '원격', employmentType: '계약직',
    tags: ['UX Writing', '콘텐츠 디자인', '문장', '사용자 경험'], postedAt: '2026-10-30', deadline: '2026-12-11',
    summary: '사용자가 다음 행동을 이해할 수 있도록 업무 도구의 언어를 다듬습니다.',
    responsibilities: ['온보딩·설정·오류 화면의 문구를 설계합니다.', '제품 용어와 문장 원칙을 정리하고 실제 화면에 적용합니다.', '사용자 질문과 사용성 검증을 바탕으로 문구를 개선합니다.'],
    requirements: ['독자의 상황에 맞춰 간결하고 명확하게 글을 쓰는 분', '문구를 화면의 흐름과 함께 검토할 수 있는 분', '수정 전후의 이유를 구체적으로 설명할 수 있는 분'],
    preferred: ['디지털 서비스의 문구를 작성한 경험', '콘텐츠 가이드나 용어집을 관리한 경험'],
  }),
  job('slowwave', {
    id: 'slowwave-brand-design', title: '브랜드 디자인 인턴', category: '디자인',
    location: '부산', experience: '신입', workMode: '사무실', employmentType: '인턴',
    tags: ['브랜드 디자인', '그래픽', 'Figma', '콘텐츠'], postedAt: '2026-10-27', deadline: '2026-11-30',
    summary: '지역의 이야기가 잘 전해지도록 콘텐츠와 브랜드의 시각 언어를 만듭니다.',
    responsibilities: ['에디토리얼 콘텐츠와 소셜 채널의 그래픽을 제작합니다.', '캠페인과 지역 프로젝트의 디자인 작업에 참여합니다.', '이미지·템플릿을 정리하고 제작 가이드를 보완합니다.'],
    requirements: ['타이포그래피와 레이아웃의 기본을 이해하는 분', '디자인 도구로 자신의 아이디어를 표현할 수 있는 분', '피드백을 반영해 작업을 발전시키는 과정을 즐기는 분'],
    preferred: ['편집 디자인 또는 콘텐츠 그래픽 작업 경험', '사진·일러스트레이션에 대한 관심'],
    process: ['서류·포트폴리오 검토', '직무 인터뷰', '최종 안내'],
  }),
  job('moaroot', {
    id: 'moaroot-product-manager', title: '프로덕트 매니저 · 팀 워크스페이스', category: '기획·PM',
    location: '서울', experience: '시니어', workMode: '하이브리드',
    tags: ['PM', 'B2B SaaS', '제품 전략', '협업'], postedAt: '2026-11-04', deadline: '2026-12-07',
    summary: '팀이 업무를 정리하고 실행하는 과정에서 중요한 문제를 찾아 해결합니다.',
    responsibilities: ['사용자 문제와 제품 목표를 연결해 우선순위를 정합니다.', '디자인·개발과 가설·범위·검증 기준을 구체화합니다.', '출시 이후 사용 흐름과 피드백을 검토해 다음 개선을 계획합니다.'],
    requirements: ['디지털 제품을 기획하고 출시·개선한 경험이 있는 분', '정성·정량 정보를 함께 해석해 판단할 수 있는 분', '관계자의 기대와 제약을 조율하고 결정 근거를 기록하는 분'],
    preferred: ['B2B 업무 도구를 기획한 경험', '협업 또는 문서 편집 제품에 대한 이해'],
  }),
  job('roundfield', {
    id: 'roundfield-service-planner', title: '서비스 기획자 · 공간 예약', category: '기획·PM',
    location: '경기', experience: '주니어', workMode: '사무실',
    tags: ['서비스 기획', '예약', '정책 설계', 'Figma'], postedAt: '2026-11-02', deadline: '2026-12-02',
    summary: '예약자와 공간 운영자가 같은 정보를 명확하게 확인하는 서비스를 기획합니다.',
    responsibilities: ['검색·예약·변경·취소 흐름과 서비스 정책을 정리합니다.', '운영 이슈에서 반복되는 문제를 찾아 개선 과제를 정의합니다.', '화면 명세와 예외 조건을 개발·디자인 팀과 검토합니다.'],
    requirements: ['사용자 흐름과 화면 명세를 구조적으로 표현할 수 있는 분', '서로 다른 입장의 요구사항을 정리할 수 있는 분', '정책과 화면의 예외 상황을 꼼꼼하게 확인하는 분'],
    preferred: ['예약·커머스 서비스 기획 경험', '서비스 운영 또는 고객 응대 경험'],
  }),
  job('papermint', {
    id: 'papermint-learning-planner', title: '학습 콘텐츠 서비스 기획자', category: '기획·PM',
    location: '원격', experience: '경력 무관', workMode: '원격',
    tags: ['교육', '콘텐츠 기획', '사용자 조사', '학습'], postedAt: '2026-10-28', deadline: null,
    summary: '사용자의 학습 목표와 일상에 맞는 콘텐츠·복습 경험을 기획합니다.',
    responsibilities: ['학습 과정과 콘텐츠 구조를 설계합니다.', '학습자 인터뷰와 이용 기록에서 개선점을 찾습니다.', '콘텐츠·디자인·개발 담당자와 기능의 범위를 정리합니다.'],
    requirements: ['정보를 이해하기 쉬운 순서와 구조로 정리하는 분', '대상 사용자의 질문을 듣고 문제를 정의할 수 있는 분', '기획 내용을 문서와 예시로 구체적으로 전달하는 분'],
    preferred: ['학습 프로그램 또는 콘텐츠 제작 경험', '교육 서비스의 이용 흐름을 분석한 경험'],
  }),
  job('nextshelf', {
    id: 'nextshelf-product-analyst', title: '프로덕트 분석 인턴', category: '기획·PM',
    location: '경기', experience: '신입', workMode: '하이브리드', employmentType: '인턴',
    tags: ['SQL', '제품 분석', '리서치', '데이터'], postedAt: '2026-10-25', deadline: '2026-11-26',
    summary: '재고·출고 도구의 이용 흐름을 살피고 제품 개선을 위한 근거를 정리합니다.',
    responsibilities: ['제품 지표와 사용자 행동 데이터를 정리합니다.', '사용성 조사와 운영 인터뷰의 기록을 분석합니다.', '가설을 확인하는 간단한 분석과 결과 공유를 지원합니다.'],
    requirements: ['스프레드시트 또는 SQL로 데이터를 다뤄본 분', '수치의 의미와 한계를 함께 설명할 수 있는 분', '관찰한 사실과 자신의 해석을 구분해 기록하는 분'],
    preferred: ['데이터 분석 과제나 개인 프로젝트 경험', 'B2B 서비스 또는 물류 업무에 대한 관심'],
    process: ['서류 검토', '직무 인터뷰', '최종 안내'],
  }),
  job('daygrain', {
    id: 'daygrain-growth-marketer', title: '그로스 마케터 · 습관 서비스', category: '마케팅',
    location: '서울', experience: '주니어', workMode: '하이브리드',
    tags: ['그로스', 'GA4', 'CRM', '실험'], postedAt: '2026-11-03', deadline: '2026-12-04',
    summary: '사용자가 서비스를 발견하고 기록을 이어갈 수 있는 접점을 설계합니다.',
    responsibilities: ['유입·가입·재방문 흐름에서 개선 기회를 찾습니다.', '메시지와 랜딩 페이지를 기획하고 실험 결과를 검토합니다.', '제품 팀과 고객 세그먼트 및 CRM 시나리오를 운영합니다.'],
    requirements: ['디지털 채널을 운영하고 결과를 분석한 경험이 있는 분', '가설과 확인할 지표를 정해 실험할 수 있는 분', '사용자에게 필요한 메시지를 상황에 맞게 작성하는 분'],
    preferred: ['GA4 또는 CRM 도구 사용 경험', '구독·생활 기록 서비스에 대한 이해'],
  }),
  job('slowwave', {
    id: 'slowwave-content-marketer', title: '콘텐츠 마케터 · 지역 이야기', category: '마케팅',
    location: '부산', experience: '경력 무관', workMode: '사무실',
    tags: ['콘텐츠 마케팅', '에디토리얼', 'SNS', '로컬'], postedAt: '2026-11-01', deadline: '2026-11-30',
    summary: '지역의 이야기를 발견하고 독자에게 닿는 콘텐츠와 캠페인을 만듭니다.',
    responsibilities: ['취재 소재와 독자 관심사를 바탕으로 콘텐츠를 기획합니다.', '뉴스레터와 소셜 채널의 발행 일정을 운영합니다.', '콘텐츠 반응을 살펴 다음 기획과 전달 방식을 개선합니다.'],
    requirements: ['대상 독자를 고려해 글과 콘텐츠를 구성할 수 있는 분', '일정을 관리하며 꾸준히 콘텐츠를 발행할 수 있는 분', '사실과 출처를 확인하는 과정을 중요하게 생각하는 분'],
    preferred: ['뉴스레터·브랜드 채널을 운영한 경험', '지역 문화·공간을 취재한 경험'],
  }),
  job('threadnote', {
    id: 'threadnote-product-marketer', title: '프로덕트 마케터 · 업무 도구', category: '마케팅',
    location: '원격', experience: '시니어', workMode: '원격',
    tags: ['Product Marketing', 'B2B', '포지셔닝', '콘텐츠'], postedAt: '2026-10-30', deadline: '2026-12-14',
    summary: '제품의 가치를 구체적인 업무 사례와 고객의 언어로 전달합니다.',
    responsibilities: ['대상 고객과 활용 사례를 분석해 제품 메시지를 정리합니다.', '기능 출시 캠페인과 제품 소개 콘텐츠를 기획합니다.', '제품·비즈니스 팀과 고객 피드백을 공유하고 제안을 개선합니다.'],
    requirements: ['제품이나 서비스의 메시지·캠페인을 기획한 경험이 있는 분', '고객 인터뷰를 통해 활용 맥락을 구체화할 수 있는 분', '여러 직군과 일정·메시지·자료를 조율할 수 있는 분'],
    preferred: ['B2B SaaS 제품 마케팅 경험', '사례집·웨비나·제품 안내 콘텐츠를 만든 경험'],
  }),
  job('flowbasket', {
    id: 'flowbasket-brand-marketing', title: '브랜드 마케팅 인턴', category: '마케팅',
    location: '경기', experience: '신입', workMode: '하이브리드', employmentType: '인턴',
    tags: ['브랜드', '캠페인', 'SNS', '커머스'], postedAt: '2026-10-23', deadline: '2026-11-27',
    summary: '생활 속 상품의 쓰임을 알리는 콘텐츠와 브랜드 캠페인에 참여합니다.',
    responsibilities: ['상품과 고객의 생활을 연결하는 콘텐츠 제작을 지원합니다.', '캠페인 일정과 채널별 게시물을 정리합니다.', '고객 반응과 참고 사례를 조사하고 팀에 공유합니다.'],
    requirements: ['사람들이 정보를 찾고 구매하는 과정에 관심이 있는 분', '문서·스프레드시트로 자료를 정리할 수 있는 분', '정해진 일정과 확인 사항을 꼼꼼하게 챙기는 분'],
    preferred: ['개인 채널 또는 소셜 콘텐츠 운영 경험', '간단한 이미지·영상 편집 경험'],
    process: ['서류 검토', '직무 인터뷰', '최종 안내'],
  }),
  job('loopgarden', {
    id: 'loopgarden-account-manager', title: '어카운트 매니저 · 리테일 솔루션', category: '비즈니스',
    location: '서울', experience: '주니어', workMode: '하이브리드',
    tags: ['B2B', '고객 관리', 'SaaS', '컨설팅'], postedAt: '2026-11-04', deadline: null,
    summary: '매장 운영자의 업무를 이해하고 필요한 도구와 활용 방법을 제안합니다.',
    responsibilities: ['신규 고객의 업무와 도입 목적을 파악합니다.', '제품 소개와 활용 제안을 진행하고 문의에 답합니다.', '도입 이후의 피드백을 정리해 제품·운영 팀과 공유합니다.'],
    requirements: ['상대의 상황을 듣고 제안을 구성할 수 있는 분', '고객과의 대화·약속·다음 업무를 꾸준히 기록하는 분', '제품의 기능을 실제 업무와 연결해 설명할 수 있는 분'],
    preferred: ['B2B 고객 응대 또는 영업 경험', '매장 운영 또는 리테일 소프트웨어에 대한 이해'],
  }),
  job('harborpath', {
    id: 'harborpath-partnership', title: '파트너십 매니저 · 지역 공간', category: '비즈니스',
    location: '부산', experience: '시니어', workMode: '사무실',
    tags: ['파트너십', '사업 개발', '여행', '로컬'], postedAt: '2026-11-02', deadline: '2026-12-09',
    summary: '지역 공간 파트너와 여행자 모두에게 도움이 되는 협업을 만듭니다.',
    responsibilities: ['지역 공간·체험 파트너를 발굴하고 협업을 제안합니다.', '파트너의 운영 조건을 이해하고 계약·등록 과정을 조율합니다.', '협업 결과와 파트너 피드백을 바탕으로 운영 방식을 개선합니다.'],
    requirements: ['외부 파트너와 협업 조건을 협의하고 실행한 경험이 있는 분', '여러 이해관계자의 요구를 정리하고 조율할 수 있는 분', '현장 방문과 문서 업무를 균형 있게 진행할 수 있는 분'],
    preferred: ['여행·공간·지역 기반 사업 경험', '제휴 프로그램을 기획하고 운영한 경험'],
  }),
  job('bridgeday', {
    id: 'bridgeday-business-associate', title: '교육 사업 개발 어시스턴트', category: '비즈니스',
    location: '서울', experience: '신입', workMode: '사무실',
    tags: ['사업 개발', '교육', '제안서', '시장 조사'], postedAt: '2026-10-28', deadline: '2026-12-01',
    summary: '기업과 학습자의 교육 과제를 조사하고 맞는 프로그램 제안을 함께 준비합니다.',
    responsibilities: ['직무 교육과 기업 학습 수요를 조사합니다.', '제안 자료와 프로그램 안내 문서를 정리합니다.', '미팅 기록과 후속 업무를 관리하고 파트너 소통을 지원합니다.'],
    requirements: ['자료를 조사하고 핵심을 문서로 정리할 수 있는 분', '상대방의 요청을 확인하고 정확하게 전달하는 분', '맡은 업무의 일정과 진행 상황을 공유하는 분'],
    preferred: ['교육 프로그램 참여·운영 경험', '제안서 또는 발표 자료를 작성한 경험'],
  }),
  job('nextshelf', {
    id: 'nextshelf-solutions-consultant', title: '솔루션 컨설턴트 · 재고 관리', category: '비즈니스',
    location: '경기', experience: '경력 무관', workMode: '하이브리드',
    tags: ['솔루션', '물류', 'B2B', '프로세스'], postedAt: '2026-10-24', deadline: '2026-11-30',
    summary: '브랜드의 재고·출고 업무를 살펴 알맞은 도입 계획을 제안합니다.',
    responsibilities: ['고객의 재고·출고 업무 흐름과 현재 도구를 파악합니다.', '도입 범위와 단계별 적용 계획을 정리합니다.', '운영·개발 팀과 초기 설정 및 사용 교육을 진행합니다.'],
    requirements: ['복잡한 업무를 단계와 조건으로 정리할 수 있는 분', '새로운 소프트웨어를 익혀 다른 사람에게 설명하는 분', '고객과 내부 팀 사이에서 정보를 정확하게 전달하는 분'],
    preferred: ['물류·커머스·ERP 관련 업무 경험', '고객 온보딩 또는 도입 프로젝트 경험'],
  }),
  job('loopgarden', {
    id: 'loopgarden-customer-success', title: '고객 성공 매니저', category: '운영',
    location: '서울', experience: '주니어', workMode: '하이브리드',
    tags: ['Customer Success', '온보딩', '헬프센터', '고객 경험'], postedAt: '2026-11-03', deadline: '2026-12-03',
    summary: '매장 운영자가 제품을 익히고 자신의 업무에 꾸준히 활용하도록 돕습니다.',
    responsibilities: ['신규 고객의 초기 설정과 사용 교육을 진행합니다.', '반복되는 질문을 정리해 도움말과 안내 자료를 개선합니다.', '고객의 사용 중단·불편 신호를 파악하고 해결 과정을 조율합니다.'],
    requirements: ['사용자의 질문을 듣고 문제를 구체화할 수 있는 분', '고객 안내 문서를 명확하게 작성할 수 있는 분', '여러 문의의 우선순위와 처리 상태를 관리하는 분'],
    preferred: ['소프트웨어 고객 지원 또는 온보딩 경험', '헬프센터·고객 관리 도구 운영 경험'],
  }),
  job('roundfield', {
    id: 'roundfield-service-operations', title: '서비스 운영 담당자 · 예약 지원', category: '운영',
    location: '경기', experience: '경력 무관', workMode: '사무실', employmentType: '계약직',
    tags: ['서비스 운영', '예약', '고객 지원', '정책'], postedAt: '2026-11-01', deadline: '2026-11-26',
    summary: '예약자와 공간 운영자의 문의를 해결하고 안정적인 예약 경험을 지원합니다.',
    responsibilities: ['예약·변경·취소 문의를 확인하고 처리합니다.', '공간 정보와 운영 일정의 정확성을 점검합니다.', '반복되는 이슈와 개선 제안을 제품 팀에 전달합니다.'],
    requirements: ['안내 기준을 이해하고 상황에 맞게 설명하는 분', '작은 정보의 차이를 놓치지 않고 확인하는 분', '처리 내용과 남은 업무를 동료에게 명확하게 전달하는 분'],
    preferred: ['예약·여행·공간 서비스 운영 경험', '고객 응대 기록이나 운영 매뉴얼 작성 경험'],
  }),
  job('bridgeday', {
    id: 'bridgeday-learning-operations', title: '교육 프로그램 운영 코디네이터', category: '운영',
    location: '서울', experience: '신입', workMode: '사무실',
    tags: ['교육 운영', '커뮤니티', '일정 관리', '콘텐츠'], postedAt: '2026-10-29', deadline: null,
    summary: '참여자와 강사가 수업에 집중할 수 있도록 프로그램의 준비와 진행을 맡습니다.',
    responsibilities: ['교육 일정·자료·참여자 안내를 준비합니다.', '수업 중 문의와 운영 사항을 확인하고 담당자와 조율합니다.', '설문과 운영 기록을 정리해 다음 프로그램을 개선합니다.'],
    requirements: ['여러 일정과 확인 사항을 정리해 관리할 수 있는 분', '상대방이 이해하기 쉬운 안내를 작성하는 분', '예상하지 못한 상황에서 필요한 도움을 요청하고 조율하는 분'],
    preferred: ['교육·행사·커뮤니티 운영 경험', '온라인 회의·설문·문서 도구 사용 경험'],
  }),
  job('tintworks', {
    id: 'tintworks-community-operations', title: '크리에이터 커뮤니티 운영 매니저', category: '운영',
    location: '원격', experience: '시니어', workMode: '원격',
    tags: ['커뮤니티', '크리에이터', '운영 정책', '콘텐츠'], postedAt: '2026-10-26', deadline: '2026-12-10',
    summary: '창작자가 질문하고 작업을 나누며 서로 배울 수 있는 커뮤니티를 운영합니다.',
    responsibilities: ['커뮤니티의 참여 흐름과 운영 정책을 설계합니다.', '질문·피드백·신고를 살피고 필요한 대응을 조율합니다.', '사용자 모임과 콘텐츠 프로그램을 기획하고 회고합니다.'],
    requirements: ['온라인 커뮤니티나 사용자 프로그램을 운영한 경험이 있는 분', '서로 다른 의견을 듣고 일관된 기준으로 대응할 수 있는 분', '운영 정책과 사례를 문서로 관리할 수 있는 분'],
    preferred: ['창작·디자인 도구 사용자에 대한 이해', '원격 커뮤니티 행사나 교육 프로그램 기획 경험'],
  }),
];

export const dataset = jobs;

/** NFKC는 전각 영문·숫자를 일반 영문·숫자와 같은 검색어로 처리한다. */
export function normalizeSearch(value = '') {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('ko-KR').replace(/\s+/gu, ' ').trim();
}

const searchableFields = ['title', 'company', 'category', 'location', 'experience', 'workMode',
  'employmentType', 'tags', 'companyDescription', 'summary', 'responsibilities', 'requirements',
  'preferred', 'culture', 'benefits'];
const filterFields = Object.keys(filterOptions);
const ignoredFilterValues = new Set(['', '전체', 'all']);
const searchIndex = new Map(jobs.map(item => [item, searchableText(item)]));

function searchableText(item) {
  return normalizeSearch(searchableFields.map(key => Array.isArray(item[key]) ? item[key].join(' ') : item[key] ?? '').join(' '));
}

function filterValues(value) {
  return (Array.isArray(value) ? value : [value]).map(normalizeSearch).filter(item => !ignoredFilterValues.has(item));
}

function dateValue(value, fallback = DATA_AS_OF) {
  const text = value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString().slice(0, 10) : String(value ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(text)) return fallback;
  const parsed = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === text ? text : fallback;
}

/** 마감일 당일까지 열려 있으며 null은 상시채용이다. */
export function isJobOpen(item, asOf = DATA_AS_OF) {
  return item.deadline == null || item.deadline >= dateValue(asOf);
}

/**
 * 검색어는 공백 단위 AND, 서로 다른 필터는 AND, 한 필터의 배열은 OR다.
 * '전체'/빈 값은 필터에서 제외한다. 입력 목록과 공고 객체는 변경하지 않는다.
 */
export function filterJobs(list = jobs, filters = {}) {
  const { query = '', asOf = DATA_AS_OF, includeClosed = false } = filters ?? {};
  const terms = normalizeSearch(query).split(' ').filter(Boolean);
  const selections = filterFields.map(field => [field, filterValues(filters?.[field])]);
  return (Array.isArray(list) ? list : []).filter(item => {
    if (!includeClosed && !isJobOpen(item, asOf)) return false;
    if (!selections.every(([field, values]) => !values.length || values.includes(normalizeSearch(item[field])))) return false;
    if (!terms.length) return true;
    const text = searchIndex.get(item) ?? searchableText(item);
    return terms.every(term => text.includes(term));
  });
}

function byId(first, second) {
  return String(first.id).localeCompare(String(second.id), 'ko-KR');
}

function latest(first, second) {
  return String(second.postedAt).localeCompare(String(first.postedAt)) || byId(first, second);
}

/** 상시채용은 마감 임박순의 마지막에 둔다. 알 수 없는 정렬값은 최신 등록순이다. */
export function sortJobs(list = jobs, value = 'latest') {
  const compare = value === 'deadline'
    ? (first, second) => String(first.deadline ?? '9999-12-31').localeCompare(String(second.deadline ?? '9999-12-31')) || latest(first, second)
    : value === 'company'
      ? (first, second) => String(first.company).localeCompare(String(second.company), 'ko-KR') || latest(first, second)
      : latest;
  return [...(Array.isArray(list) ? list : [])].sort(compare);
}

export function getJobById(id) {
  return jobs.find(item => item.id === String(id)) ?? null;
}

export function getCompanyById(id) {
  return companyById.get(String(id)) ?? null;
}
