# Deep Design System

DeepResume·DeepInterview의 디자인 규칙, 컴포넌트와 서비스 화면을 제공합니다.

## V2 브랜치 (2.0.0-alpha.1, Astryx 디자인)

`v2` 브랜치는 DDS 0.6.2를 포크해 모양을 Meta Astryx(neutral)로 바꾼 버전입니다. 마크업, 동작, 색상 토큰은 DDS 그대로이고, 모양·크기·글자·간격·그림자·움직임은 Astryx를 따릅니다. 기본 색은 DDS 오렌지이며 디자인 설정 패널에서 바꿀 수 있습니다.

- 기준: `astryx-v2-spec.md` (Astryx 0.7.11 실측값과 DDS 색상 토큰 대응)
- 토큰: `tokens.css`, `ui/tokens-scoped.css` 끝의 Astryx design layer (색 정의 없음)
- 컴포넌트: `astryx-skin.css` (문서 사이트용), `ui/dds.css` 끝에 같은 규칙을 `.dds-ui` 범위로 추가
- 문서 사이트: `astryx-docs.css`, 서비스 화면: `prototypes/astryx-service.css`, 예제: `examples/astryx-examples.css`
- 원본 CSS는 수정하지 않고 위 파일들이 마지막에 덮어씁니다.
- 디자인 설정 저장 키는 V1과 분리했습니다 (`dds-v2-design-settings-v1`, `dds-v2-design-profile-v1`).
- 설치 안내와 `releases/`는 0.6.2를 가리킵니다. V2용 릴리스 묶음은 원본 작업 폴더의 빌드 도구로 만들어야 합니다.
- 문서 본문의 수치 설명(버튼 높이 등)은 아직 0.6.2 기준입니다.
- Astryx는 MIT 라이선스입니다. 고지는 `THIRD_PARTY_NOTICES.md`, `ui/THIRD_PARTY_NOTICES.md`에 있습니다. Astryx 이름과 Meta 로고는 사용하지 않습니다.

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
