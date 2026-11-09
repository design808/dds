# Deep Design System

DeepResume·DeepInterview의 디자인 규칙, 컴포넌트와 서비스 화면을 제공합니다.

## V2 브랜치 (2.0.0-alpha.1, Astryx 디자인 시안)

`v2` 브랜치는 DDS 0.6.2를 포크해 Meta Astryx의 neutral 테마 모양을 적용한 시안입니다. 화면 구조와 동작은 0.6.2와 같고 모양만 바뀝니다.

- 값의 출처: `@astryxdesign/core` 0.7.11, `@astryxdesign/theme-neutral` 0.7.11을 Chromium에서 렌더링해 측정
- 변경 파일: `tokens.css`, `ui/tokens-scoped.css`, `ui/dds.css` 끝의 "Astryx neutral skin" 블록, 문서 사이트용 `astryx-skin.css`, 디자인 설정 기본값(`design-preferences.js`, `direction-preview.js`, `ui/profile-palette.js`, `document-loading.js`, `index.html`), 헤더 버전 표시(`app.js`, `document-loading.js`)
- 주요 값: 무채색, 주요 버튼 `#1B1B1B`, 컨트롤 28/32/36px, 모서리 6/10/12px, 본문 14px, Figtree(한글은 Pretendard)
- 서비스 화면(`prototypes/`)은 토큰만 바뀌고 화면별 CSS는 그대로입니다.
- 설치 안내와 `releases/`는 0.6.2를 가리킵니다. V2용 릴리스 묶음은 원본 작업 폴더의 빌드 도구로 만들어야 합니다.
- 문서 본문의 수치 설명(버튼 높이, 브랜드 색 등)은 아직 0.6.2 기준입니다.
- Astryx는 MIT 라이선스입니다. 고지는 `THIRD_PARTY_NOTICES.md`, `ui/THIRD_PARTY_NOTICES.md`에 있습니다. Astryx 이름과 Meta 로고는 사용하지 않습니다.

사이트: https://design808.github.io/dds/

## 구성

- 디자인 원칙과 색상·타이포그래피·레이아웃·모션 등 기반 규칙
- 컴포넌트·서비스 패턴·개발 적용 안내
- 메인 2종, 자기소개서 지원정보·문항 작성, 마이페이지, 이력서 작성, 면접 준비·진행 화면
- Pretendard 웹폰트, Lucide 아이콘, 라이트·다크모드

이 저장소는 DDS의 정적 배포 파일만 포함합니다. 서비스 화면은 브라우저 안에서 동작하며, 운영 서비스의 로그인·AI 생성·번역·메일·저장·면접 API에는 연결하지 않습니다. 원본 DeepFront 서비스 코드는 포함하지 않습니다.

## 배포

GitHub Pages에서 `main` 브랜치의 루트 폴더를 게시합니다. `.nojekyll`을 유지합니다.

원본 DDS 작업 폴더에서 `npm run pages:build`를 실행하면 배포 파일이 생성됩니다. 생성된 `exports/DDS-github-pages/`의 내용물을 이 저장소에 반영하고 푸시하면 사이트가 갱신됩니다.

폰트와 아이콘의 라이선스는 `assets/fonts/pretendard/LICENSE`, `vendor/lucide/LICENSE`에 포함되어 있습니다.
