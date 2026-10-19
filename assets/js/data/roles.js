window.PORTFOLIO_ROLE_PAGES = {
  pm: {
    label: 'PRODUCT / PM', title: '문제를 정의하고,\n다음 결정을 설계합니다.',
    intro: '운영 현장에서 만난 문제를 제품 가설로 바꾸고, 사용자 반응에 따라 방향을 수정해 왔습니다. 팀 프로젝트에서는 역할과 일정, 의사결정의 흐름을 정리했습니다.',
    thesis: 'PM 지원 관점: 문제 정의 · 초기 검증 · 팀 조율',
    focus: [
      ['문제 정의', 'PORTMIS 야간 장애 경험을 Sentinel의 인시던트 대응 가설로 연결했습니다.'],
      ['검증과 전환', 'Hypora와 Persoracle에서 얻은 제한된 피드백을 Vencubator의 진입 흐름 설계에 반영했습니다.'],
      ['실행 조율', 'PactFive의 5인 팀장으로 AGENTS.md·Workflow·ADR 설계와 일정 조율을 맡았습니다.']
    ],
    cases: [
      {name:'Vencubator', label:'CURRENT EXPERIMENT', question:'복잡한 창업 학습의 첫 진입을 어떻게 낮출까?', action:'Hypora의 구조화와 Persoracle의 검증 흐름을 합쳐 게임화된 체험판을 배포하고 여러 채널에 알렸습니다.', signal:'배포 3일 누적 접속 56명. 지속 사용과 수요는 아직 검증되지 않았습니다.', boundary:'접속 수를 활성 사용자나 전환 성과로 해석하지 않습니다.', link:'https://vencubator.vercel.app/', linkLabel:'프로토타입 보기'},
      {name:'PactFive', label:'TEAM OPERATIONS', question:'5명이 22영업일 동안 제품을 만들 때 무엇을 먼저 정할까?', action:'PRD·ERD를 기준으로 작업 범위와 문서 흐름을 정하고, AGENTS.md·Workflow 작성, ADR 설계, 일정 관리·조율을 맡았습니다. 코드는 직접 수정하지 않았습니다.', signal:'코드·파일 충돌 0건. 기능 간 결정 공유가 부족해 통합은 어려웠습니다.', boundary:'제 기여는 작업 규칙·의사결정·일정의 운영 구조이며, 서비스 기능은 팀 전체의 구현입니다.', link:'https://pact-five-seven.vercel.app/', linkLabel:'서비스 보기'},
      {name:'Sentinel → Hypora', label:'HYPOTHESIS LEARNING', question:'내 문제의식이 타인에게도 중요한 문제인가?', action:'Sentinel 데모를 전문가에게 보여주고 MVP까지 만들었으나 시장 반응을 확인하지 못했습니다. 이후 Hypora에서도 용어와 사용법의 진입 장벽을 발견했습니다.', signal:'두 실험에서 제품의 설명 방식과 대상 고객을 다시 정해야 한다는 과제를 확인했습니다.', boundary:'전문가 인터뷰와 초기 피드백을 제품 방향을 조정하는 정성 신호로 사용했습니다.', link:'https://sentinel-demo-c12b7.web.app/', linkLabel:'Sentinel 데모'}
    ],
    note:'현장 문제에서 출발해 가설을 만들고, 초기 사용자 반응을 다음 제품 결정으로 연결했습니다. 팀 프로젝트에서는 실행 순서와 의사결정의 흐름을 정리했습니다.'
  },
  'ai-developer': {
    label: 'ENGINEERING / APPLIED AI', title: 'AI 기능을 제품 흐름에\n연결하고 재사용합니다.',
    intro: 'Flutter와 Firebase로 앱을 구현하고 Gemini API·TTS를 제품 기능에 연결했습니다. 반복 추론과 초기 데이터 읽기를 줄이는 구조를 설계했습니다.',
    thesis: 'AI 개발자 지원 관점: API 통합 · 데이터 흐름 · AI 협업 구조',
    focus: [
      ['AI 기능 통합', 'MaChat에서 Gemini API 기반 AI 채팅·영단어 추론과 TTS 기능을 구현했습니다.'],
      ['재사용 설계', '마스터 Voca에 단어 데이터를 선처리해 같은 단어의 반복 추론을 피하도록 구성했습니다.'],
      ['개발 흐름', 'PactFive에서 AI 활용 팀의 AGENTS.md·Workflow·ADR 문서와 일정·통합 흐름을 설계했습니다.']
    ],
    cases: [
      {name:'MaChat', label:'AI PRODUCT IMPLEMENTATION', question:'동일한 데이터와 추론을 매번 다시 요청해야 할까?', action:'Firestore Stream 채팅과 Gemini API 추론, 수퍼톤 TTS를 구현했습니다. 최근 30개 메시지를 먼저 로딩하고 마스터 Voca에 단어 결과를 재사용하도록 설계했습니다.', signal:'100명이 같은 단어를 한 번씩 요청한다는 가정에서 추론 100회 → 최초 1회, 단어당 호출 99% 감소하는 설계 모델입니다.', boundary:'이 비교는 동일 단어가 반복되는 시나리오입니다. 캐시 적중률과 새 단어 비율에 따라 실제 호출 수가 달라집니다.', link:'../index.html#case-machat', linkLabel:'구현과 가정 보기'},
      {name:'Daily School', label:'APPLICATION FOUNDATION', question:'여러 화면이 공유하는 인증·상태·통신 흐름을 어떻게 묶을까?', action:'8인 팀에서 Flutter 메뉴 6개 중 4개와 JWT 세션, Riverpod 상태관리, Dio 통신 전후 처리 구조를 담당했습니다.', signal:'담당 화면과 공통 앱 흐름을 연결해 2025년 초 서비스 릴리즈에 참여했습니다.', boundary:'프론트엔드의 화면·인증·상태·통신을 담당했고, 백엔드와 배포 자동화는 다른 팀원이 맡았습니다.', link:'https://devwww.dailyschool.co.kr/', linkLabel:'테스트 서버 보기'},
      {name:'PactFive', label:'AI-ASSISTED TEAM WORKFLOW', question:'AI를 사용하는 5인 팀의 작업 경계를 어떻게 정할까?', action:'AGENTS.md·Workflow 작성, ADR 설계, 일정 관리와 조율을 맡았습니다. 코드를 직접 수정하지 않았습니다.', signal:'22영업일 동안 코드·파일 충돌 0건. 기능 간 결정 공유는 개선 과제로 남았습니다.', boundary:'AI 활용 개발의 문서·협업 흐름을 설계한 경험이며, 서비스 코드는 팀원들이 구현했습니다.', link:'https://pact-five-seven.vercel.app/', linkLabel:'팀 서비스 보기'}
    ],
    note:'AI API를 앱의 사용자 흐름에 연결하고, 반복되는 추론 결과를 재사용하도록 설계했습니다. 팀에서는 AI 활용 개발의 문서와 협업 흐름을 정리했습니다.'
  },
  marketer: {
    label: 'MARKETING / GROWTH', title: '메시지를 내보내고,\n반응을 다음 실험으로 바꿉니다.',
    intro: '제품을 만든 뒤 Threads, LinkedIn, 오픈채팅방, SYDE, Disquiet 등에 직접 알렸습니다. 반응이 없거나 설명이 어려웠던 지점을 다음 제품의 포지셔닝과 진입 흐름에 반영했습니다.',
    thesis: '마케터 지원 관점: 메시지 · 채널 · 사용자 피드백',
    focus: [
      ['채널 실행', 'Vencubator 랜딩페이지와 프로토타입을 여러 커뮤니티·소셜 채널에 배포했습니다.'],
      ['메시지 점검', 'Hypora에서 용어와 사용법이 어렵다는 피드백을 받아 진입 장벽을 확인했습니다.'],
      ['대상 고객', 'Persoracle의 가까운 지인 검증에서 흥미와 필요의 차이를 확인했습니다.']
    ],
    cases: [
      {name:'Vencubator', label:'LAUNCH & DISTRIBUTION', question:'새 제품의 첫 체험을 누구에게 어떤 메시지로 알릴까?', action:'2026년 9월 말 랜딩페이지·프로토타입을 배포하고 Threads, LinkedIn, 오픈채팅방, SYDE, Disquiet에서 홍보했습니다.', signal:'배포 3일 기준 누적 접속 56명입니다.', boundary:'56명은 초기 접속 신호입니다. 이 수치만으로 전환이나 지속 사용을 설명하지 않습니다.', link:'https://vencubator.vercel.app/', linkLabel:'랜딩페이지 보기'},
      {name:'Hypora', label:'MESSAGE CLARITY', question:'아이디어 구조화의 가치를 처음 보는 사람이 이해할까?', action:'지인·카카오톡 오픈채팅방·네이버 블로그에 배포해 반응을 들었습니다.', signal:'용어와 사용법이 어렵다는 피드백을 받아 초기 진입 흐름을 다시 보게 됐습니다.', boundary:'이 경험은 메시지와 사용 흐름을 다듬는 정성 피드백으로 활용했습니다.', link:'https://hypora-2026.vercel.app/', linkLabel:'서비스 보기'},
      {name:'Persoracle', label:'AUDIENCE FIT', question:'재미있는 체험이 실제 필요로 이어질까?', action:'AI 페르소나 검증 서비스를 가까운 비개발자·비창업자 지인에게 보여주고 반응을 들었습니다.', signal:'“재미있지만 내게 필요하지 않다”, “무엇을 하는 서비스인지 모르겠다”는 반응이 있었습니다.', boundary:'검증 대상이 가까운 지인으로 제한돼 외부 시장의 반응으로 일반화할 수 없습니다.', link:'https://persoracle-mvp-v1.vercel.app/', linkLabel:'서비스 보기'}
    ],
    note:'직접 만든 제품을 여러 채널에 알리고, 초기 반응을 메시지와 대상 고객을 다시 생각하는 계기로 삼았습니다. 실행과 학습의 연결을 이 경로에 모았습니다.'
  }
};
