# Deep Design System

DeepResume·DeepInterview의 디자인 규칙, 컴포넌트와 서비스 화면을 제공합니다.

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
