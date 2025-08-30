# 🚀 Aether Development Guide

## 📋 작업 진행 방법

### 1️⃣ **시작 전 준비**
1. `work-log.md` 파일 열기
2. 오늘 날짜와 목표 기록
3. Claude Code 준비

### 2️⃣ **Task 실행 프로세스**

#### Step 1: Task 시작
```markdown
1. task.md에서 현재 Task 확인
2. work-log.md에 시작 시간 기록
3. Task Status를 [🔄 In Progress]로 변경
```

#### Step 2: Claude Code 실행
```markdown
# Claude Code에 붙여넣을 프롬프트 예시:
Task 1.1: Initialize Aether project at /Users/robb/Workspace/Aether
- Create Next.js 14 with TypeScript
- Setup Turborepo
- Install required packages
[Task의 Description 내용 복사]
```

#### Step 3: 진행 상황 기록
```markdown
# work-log.md에 실시간 기록:
- [ ] **09:00** - Task 1.1: Project Initialization
  - Status: 🔄 진행 중
  - Issues: pnpm 설치 필요함
  - Time: 시작 09:00
```

#### Step 4: Task 완료
```markdown
# task.md 업데이트:
**Status**: [x] Completed ✅
**Actual Time**: 25min

# work-log.md 업데이트:
- [x] **09:00** - Task 1.1: Project Initialization
  - Status: ✅ 완료
  - Issues: 없음
  - Time: 25분 (예상: 30분)
```

### 3️⃣ **체크박스 사용법**

#### task.md 체크박스
```markdown
# 작업 전
**Status**: [ ] Not Started

# 진행 중
**Status**: [ ] 🔄 In Progress

# 완료
**Status**: [x] Completed ✅

# 블로킹
**Status**: [ ] ❌ Blocked

# 건너뜀
**Status**: [ ] ⏭️ Skipped
```

#### work-log.md 체크박스
```markdown
# 매 작업마다 체크
- [ ] Task 시작 전
- [x] Task 완료 후
```

### 4️⃣ **일일 마무리 루틴**

```bash
# 1. 진행 상황 요약
## work-log.md의 End of Day Summary 작성

# 2. task.md Progress Tracker 업데이트
| Day | Date | Planned Tasks | Completed | Status | Notes |
| 1 | 2024-01-20 | 6 tasks | 5/6 | 🟡 | Task 1.6 내일 완료 |

# 3. Git 커밋
git add .
git commit -m "Day 1: Completed 5/6 tasks - Project setup"
git push

# 4. 내일 준비
## work-log.md에 Day 2 템플릿 준비
```

### 5️⃣ **Claude Code 활용 팁**

#### 🎯 효율적인 프롬프트 구조
```markdown
[Context]
Current project: /Users/robb/Workspace/Aether
Previous work: Day 1 completed, project initialized

[Task]
Task 2.1: Setup OpenAI Client
- Configure GPT-4-turbo
- Add retry logic
- Implement error handling

[Requirements]
- Use packages/ai-engine/lib/openai.ts path
- Include streaming support
- Add cost tracking

[Validation]
Run tests to verify the client works
```

#### 🔄 연속 작업 처리
```markdown
# 여러 Task를 한 번에 요청
Complete Tasks 2.1, 2.2, and 2.3:
1. Setup OpenAI client
2. Implement prompt engine
3. Create response parser

Execute sequentially and test each step.
```

### 6️⃣ **문제 해결 가이드**

#### 블로커 발생 시
1. `work-log.md`의 Blocker Log에 기록
2. 15분 룰: 15분 이상 막히면 다음 Task로
3. Claude에게 구체적인 에러와 함께 도움 요청

#### 시간 초과 시
1. 핵심 기능만 구현
2. "TODO" 주석 추가
3. work-log.md에 미완성 부분 기록

### 7️⃣ **진행 상황 대시보드**

```markdown
# 매일 업데이트할 대시보드 (task.md 상단)

## Today's Focus: Day 1
⏰ Started: 09:00
🎯 Goal: 6 tasks
✅ Completed: 0
🔄 In Progress: Task 1.1
❌ Blocked: None
📝 Notes: Setting up development environment

## Real-time Status
| Time | Task | Status |
|------|------|--------|
| 09:00 | 1.1 | 🔄 |
| 09:30 | 1.2 | ⏸️ |
| 10:15 | 1.3 | ⏸️ |
```

### 8️⃣ **일일 체크리스트 템플릿**

매일 아침 이 체크리스트로 시작:

```markdown
## Day [X] Preparation Checklist

### 시작 전
- [ ] work-log.md 열기
- [ ] 어제 작업 리뷰
- [ ] 오늘 목표 설정
- [ ] Claude Code 준비
- [ ] 필요한 계정/API 키 확인

### 작업 중
- [ ] 각 Task 시작 시 기록
- [ ] 문제 발생 시 즉시 기록
- [ ] 30분마다 진행 상황 체크
- [ ] 완료된 Task 체크

### 마무리
- [ ] 모든 변경사항 저장
- [ ] work-log.md 정리
- [ ] Git 커밋 & 푸시
- [ ] 내일 준비
```

---

## 🎬 Quick Start

**지금 당장 시작하기:**

1. **work-log.md 열기**
   ```bash
   code /Users/robb/Workspace/Aether/work-log.md
   ```

2. **첫 Task 시작**
   ```markdown
   # work-log.md에 기록
   Day 1 - [오늘 날짜]
   09:00 - Task 1.1 시작
   ```

3. **Claude Code에 프롬프트**
   ```markdown
   Initialize Aether project at /Users/robb/Workspace/Aether
   Task 1.1: Create Next.js 14 with TypeScript and Turborepo
   ```

4. **완료 후 체크**
   ```markdown
   # task.md
   **Status**: [x] Completed ✅
   
   # work-log.md
   - [x] Task 1.1 완료 (25분)
   ```

---

## 📊 성과 측정

### 일일 성과
- 목표: 하루 4-6개 Task 완료
- MVP: Day 7까지 핵심 기능 완성
- 측정: work-log.md의 완료율

### 주간 마일스톤
- Week 1: MVP 완성 (30초 AI 생성)
- Week 2: Production Ready

---

## 💬 도움말

문제 발생 시:
1. work-log.md에 상세 기록
2. 구체적인 에러 메시지 포함
3. Claude에게 컨텍스트와 함께 질문

**Happy Coding! 🚀**
