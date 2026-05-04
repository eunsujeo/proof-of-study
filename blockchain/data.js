export const blockchainStudy = {
  id: "blockchain",
  title: "Blockchain & Ethereum",
  description: "블록체인과 이더리움을 단계적으로 공부하고 정리하는 학습 노트입니다.",
  modules: [
    {
      id: "blockchain-basics",
      title: "블록체인 기초",
      status: "진행 예정",
      summary: "해시, 전자서명, 블록, 트랜잭션, 분산 네트워크의 기본 구조를 정리합니다.",
      topics: ["Hash", "Public Key", "Digital Signature", "Block", "Transaction"],
      notes: [
        {
          title: "블록체인이 해결하려는 문제",
          body: "중앙 서버 없이도 여러 참여자가 같은 거래 기록을 신뢰할 수 있게 만드는 것이 핵심입니다."
        },
        {
          title: "해시의 역할",
          body: "데이터를 고정 길이 지문으로 바꾸고, 작은 변경도 완전히 다른 결과를 만들게 해서 변조 감지를 돕습니다."
        }
      ]
    },
    {
      id: "ethereum-core",
      title: "이더리움 핵심",
      status: "진행 예정",
      summary: "Account 모델, EVM, Gas, Smart Contract의 실행 방식을 공부합니다.",
      topics: ["EOA", "Contract Account", "EVM", "Gas", "Smart Contract"],
      notes: [
        {
          title: "Account 모델",
          body: "이더리움은 잔액과 상태를 계정 단위로 관리합니다. EOA는 개인키로 제어되고, Contract Account는 코드로 제어됩니다."
        },
        {
          title: "Gas",
          body: "트랜잭션 실행에 필요한 연산 비용입니다. 네트워크 자원을 무한히 쓰지 못하도록 제한하는 장치입니다."
        }
      ]
    },
    {
      id: "solidity",
      title: "Solidity",
      status: "진행 예정",
      summary: "스마트 컨트랙트 문법과 테스트 가능한 작은 예제를 쌓습니다.",
      topics: ["State", "Function", "Modifier", "Event", "Mapping"],
      notes: [
        {
          title: "첫 컨트랙트",
          body: "SimpleStorage처럼 값을 저장하고 읽는 컨트랙트부터 시작하면 배포, 호출, 상태 변경 흐름을 빠르게 볼 수 있습니다."
        }
      ]
    },
    {
      id: "security",
      title: "보안",
      status: "진행 예정",
      summary: "Reentrancy, Access Control, Front-running 등 자주 발생하는 취약점을 정리합니다.",
      topics: ["Reentrancy", "Access Control", "Front-running", "Oracle Risk"],
      notes: [
        {
          title: "보안 학습 방향",
          body: "취약점 이름만 외우기보다 공격 조건, 실패한 코드, 수정 코드, 테스트 케이스를 함께 정리합니다."
        }
      ]
    }
  ],
  resources: [
    {
      title: "Ethereum Developer Docs",
      url: "https://ethereum.org/developers/"
    },
    {
      title: "Solidity Documentation",
      url: "https://docs.soliditylang.org/"
    },
    {
      title: "Cloudflare Pages Docs",
      url: "https://developers.cloudflare.com/pages/"
    }
  ]
};
