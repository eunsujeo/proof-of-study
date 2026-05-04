export const blockchainStudy = {
  id: "blockchain",
  title: "블록체인",
  description: "분산 기록 시스템의 기본 구조와 이더리움 실행 환경을 공부합니다.",
  children: [
    {
      id: "ethereum",
      title: "이더리움",
      description: "Account 모델, EVM, Gas, Smart Contract를 중심으로 정리합니다.",
      posts: [
        {
          id: "why-blockchain",
          title: "블록체인이 해결하려는 문제",
          date: "2026-05-04",
          summary: "중앙 서버 없이도 여러 참여자가 같은 거래 기록을 신뢰할 수 있게 만드는 문제를 정리합니다."
        },
        {
          id: "hash",
          title: "해시",
          date: "준비 중",
          summary: "데이터 변조 감지, 블록 연결, 트랜잭션 식별에 쓰이는 해시의 역할을 공부합니다."
        },
        {
          id: "ethereum-account-model",
          title: "이더리움 Account 모델",
          date: "준비 중",
          summary: "EOA와 Contract Account의 차이, 상태 관리 방식을 정리합니다."
        }
      ]
    }
  ]
};
