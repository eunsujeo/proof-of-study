export const aiStudy = {
  id: "ai",
  title: "AI",
  description: "AI 모델, 개발 도구, 제품 구현 방식을 공부합니다.",
  children: [
    {
      id: "llm",
      title: "LLM",
      description: "언어 모델의 입력, 출력, 추론, 평가 방식을 정리합니다.",
      posts: [
        {
          id: "what-is-token",
          title: "토큰이란 무엇인가",
          date: "준비 중",
          summary: "텍스트가 모델 입력 단위로 나뉘는 방식을 정리합니다."
        },
        {
          id: "prompting-basics",
          title: "프롬프트 기초",
          date: "준비 중",
          summary: "모델에게 작업 목적과 제약을 전달하는 기본 구조를 정리합니다."
        }
      ]
    },
    {
      id: "agents",
      title: "Agents",
      description: "도구 사용, 계획, 실행 루프를 갖는 AI 시스템을 공부합니다.",
      posts: [
        {
          id: "agent-loop",
          title: "Agent loop",
          date: "준비 중",
          summary: "관찰, 판단, 실행, 검증이 반복되는 구조를 정리합니다."
        }
      ]
    }
  ]
};
