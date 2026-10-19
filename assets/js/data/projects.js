window.PORTFOLIO_V2 = {
  projects: [
    {
      id: 'pactfive', number: '01', category: 'TEAM ENGINEERING', title: 'PactFive',
      subtitle: '5명이 동시에 만드는 제품에서 충돌을 줄이는 구조를 설계하다',
      period: '2026.08 — 09', role: '5인 팀장 · 개발 협업 운영',
      stack: ['Monorepo', 'PRD / ERD', 'AGENTS.md', 'AI 협업'],
      image: 'screenshots/pactfive/1.png', imageAlt: 'PactFive 서비스 화면',
      problem: 'AI를 활용해 여러 명이 동시에 개발하는 22영업일 프로젝트에서 작업 충돌과 통합 비용을 관리해야 했습니다.',
      approach: 'ERD와 PRD를 기준으로 담당자별 작업 범위와 통합 흐름을 정했습니다. AGENTS.md·Workflow 문서를 작성하고 ADR 설계, 일정 관리와 조율을 맡았습니다.',
      contribution: '코드를 직접 수정하지 않았습니다. 팀장으로 작업 문서, 의사결정 기록 구조, 일정과 통합 과정을 설계·운영했습니다. 로그인·세션·프로젝트 CRUD·샌드박스 결제·OAuth·에스크로는 팀 전체 구현 범위입니다.',
      result: '22영업일 동안 코드·파일 충돌 0건. 다만 기능 사이의 결정이 충분히 공유되지 않아 통합 과정은 어려웠습니다.',
      learning: '파일 경계를 나누는 것과 인터페이스 변경을 공유하는 것은 별개의 과제였습니다. 다음 팀 작업에서는 변경 결정과 연결 지점을 함께 기록하려 합니다.',
      evidence: 'PactFive 서비스에서 팀이 완성한 의뢰·매칭 흐름을 볼 수 있습니다. 제 기여는 작업 규칙과 의사결정·일정의 운영 구조입니다.',
      link: 'https://pact-five-seven.vercel.app/', linkLabel: '서비스 보기',
      type: 'team'
    },
    {
      id: 'machat', number: '02', category: 'APP ARCHITECTURE', title: 'MaChat',
      subtitle: '읽기량과 반복 추론을 고려해 채팅 경험을 설계하다',
      period: '2024 하반기 — 2025 하반기', role: '개인 · 기획/설계/구현',
      stack: ['Flutter', 'Firestore', 'Stream', 'Gemini API', 'TTS'],
      image: 'screenshots/ma_chat/1.png', imageAlt: 'MaChat 앱 화면',
      problem: '채팅방에 들어갈 때 모든 메시지를 읽으면 초기 읽기량이 커지고, 같은 영단어를 매번 AI로 추론하면 호출이 반복됩니다.',
      approach: 'Firestore Stream으로 실시간 채팅을 구현하고 방마다 최근 30개 메시지를 먼저 불러왔습니다. 이전 기록은 지연 로딩하고, 영단어 데이터는 마스터 Voca에 선처리해 재사용하도록 설계했습니다.',
      contribution: '실시간 채팅, AI 채팅, 영단어 추론, TTS 기능의 기획부터 구현까지 단독으로 진행했습니다.',
      result: '최근 메시지를 먼저 보여주고 이전 기록을 지연 로딩하는 흐름, 영단어 결과를 재사용하는 구조를 구현했습니다.',
      learning: '초기 화면에 필요한 데이터와 나중에 탐색할 데이터를 나누고, 반복 추론 결과를 저장해 재사용하도록 설계했습니다.',
      evidence: 'MaChat 서비스에서 실시간 채팅·AI 대화·영단어 학습·음성 읽기 흐름을 살펴볼 수 있습니다.',
      link: 'https://machat-f1450.web.app/', linkLabel: '서비스 보기',
      scenario: [
        '가정: 3개 채팅방 × 방당 500개 메시지. 전부 읽는다면 1,500건, 첫 진입에서 최근 30개씩 읽는다면 90건으로 초기 읽기량이 94% 적습니다. 이후 기록 탐색과 재연결에 따른 읽기는 제외합니다.',
        '같은 데이터로 다시 방문할 때 캐시가 유효하고 새 메시지가 없다면 클라이언트의 추가 읽기는 0건일 수 있습니다. Firestore 재연결·동기화·과금 읽기량이 항상 0이라는 뜻은 아닙니다.',
        '100명이 같은 단어를 한 번씩 생성한다는 가정에서는 개별 추론 100회 → 마스터 Voca 재사용 시 최초 1회로, 단어당 AI 호출 99% 감소하는 모델입니다.'
      ],
      type: 'solo'
    },
    {
      id: 'daily', number: '03', category: 'PRODUCT DELIVERY', title: 'Daily School',
      subtitle: '여러 화면에 걸친 인증·상태·통신 흐름을 구현하다',
      period: '2024 초 — 2025 초', role: '8인 팀 · Flutter 프론트엔드',
      stack: ['Flutter', 'Riverpod', 'Dio', 'JWT'],
      image: 'screenshots/daily_school/ds_1.png', imageAlt: 'Daily School 서비스 화면',
      problem: '여러 메뉴가 인증과 API 통신을 공유하는 첫 Flutter 팀 프로젝트에서 일관된 앱 흐름이 필요했습니다.',
      approach: '홈·수업·생활·통계 4개 메뉴를 구현하고 회원가입·로그인 상태, JWT 세션, Riverpod 상태관리, Dio 요청 전후 처리 구조를 담당했습니다.',
      contribution: '6개 메뉴 중 4개와 프론트엔드 공통 흐름을 맡았습니다. Java(Spring) 백엔드와 Jenkins 배포는 다른 팀원이 담당했습니다.',
      result: '8인 팀에서 서비스를 2025년 초 릴리즈했고, 담당한 4개 메뉴와 공통 인증·상태·통신 흐름을 서비스에 연결했습니다.',
      learning: '공통 상태·통신 구조는 화면마다 같은 규칙으로 동작하게 하고 팀이 변경을 이해하는 기준이 됩니다.',
      evidence: '테스트 서버에서 학급 운영 화면과 담당한 메뉴의 사용자 흐름을 살펴볼 수 있습니다.',
      link: 'https://devwww.dailyschool.co.kr/', linkLabel: '테스트 서버 보기',
      type: 'team'
    },
    {
      id: 'winforms', number: '04', category: 'PRODUCTION PROBLEM SOLVING', title: '업무 프로그램 개선',
      subtitle: '운영 현장의 오류를 요구사항 분석에서 코드 수정까지 연결하다',
      period: '2024 말경 — 2025.09', role: '엘에프아이티 · C# WinForms/SQL',
      stack: ['C#', 'WinForms', 'SQL', '현업 요구 분석'],
      image: '', imageAlt: '',
      problem: '정렬 오류, 쿼리 결과 불일치, 넓은 조회 범위로 인한 타임아웃, 버튼 클릭 시 종료되는 오류가 있었습니다.',
      approach: '현업 요구를 분석한 뒤 쿼리와 프로그램 동작을 확인하고 C# WinForms 코드를 직접 수정했습니다.',
      contribution: '기존의 요구사항 전달 역할에서 직접 분석·수정까지 범위를 넓혔습니다.',
      result: 'SQL 관련 문제 약 3건과 프로그램 종료 오류 5건 이상을 수정했습니다. 수치는 기존 이력 자료에 따른 값입니다.',
      learning: '운영 상황을 아는 사람이 재현 조건과 사용 맥락을 함께 설명할 때 수정 방향이 선명해졌습니다.',
      evidence: '정렬·조회 결과·타임아웃·버튼 종료 오류를 유형별로 다루며 현업 요구 분석에서 코드 수정까지 맡은 실무 경험입니다.',
      link: '', linkLabel: '',
      type: 'work'
    }
  ]
};
