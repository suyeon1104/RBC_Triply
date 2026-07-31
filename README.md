# ✈️ Triply

> **여행 계획부터 경비 관리, 정산까지 한 번에!**
>
> Triply는 여행 일정 관리와 그룹별 경비 정산을 쉽고 편리하게 할 수 있는 여행 관리 플랫폼입니다.

---

# 📖 프로젝트 소개

Triply는 여행을 준비하고 함께 떠나는 과정에서 발생하는 일정 관리와 경비 정산의 불편함을 해결하기 위해 개발된 웹 서비스입니다.

사용자는 여행 그룹을 생성하거나 참여하여 여행 일정을 관리하고, 여행 중 발생한 결제 내역을 기록하며, 자동으로 계산된 정산 금액을 요청하거나 완료할 수 있습니다.

또한 여행 전자지갑과 환율 조회 기능을 제공하여 해외여행에서도 편리하게 사용할 수 있도록 설계하였습니다.

---

# 🎯 주요 기능

## 👤 회원

- 회원가입
- 로그인 / 로그아웃 (JWT 인증)
- 휴대폰 인증
- 프로필 수정
- 비밀번호 변경

---

## ✈️ 여행

- 여행 생성
- 여행 목록 조회
- 여행 참여
- 그룹 멤버 관리
- 여행 일정 생성 / 수정 / 삭제
- 여행 일정 조회

---

## 💳 결제

- 여행 경비 등록
- 결제 내역 조회
- 결제 상세 조회
- 여행별 결제 내역 관리

---

## 💰 정산

- 자동 정산 금액 계산
- 정산 요청
- 정산 완료 처리
- 받을 금액 / 보낼 금액 조회

---

## 👛 전자지갑

- 지갑 생성
- 잔액 조회
- 충전
- 거래 내역 조회

---

## 💱 환율

- 실시간 환율 조회
- 환율 계산

---

## 🔔 알림

- 그룹 초대 알림
- 정산 요청 알림

---

# 🛠 기술 스택

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS3

## Backend

- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- Hibernate
- Gradle

## Database

- PostgreSQL

## Tools

- Git
- GitHub
- Figma
- Notion

---

# 🏗 시스템 아키텍처

```text
                User
                  │
                  ▼
        React + TypeScript
                  │
         Axios (REST API)
                  │
                  ▼
        Spring Boot Backend
                  │
        Spring Security (JWT)
                  │
                  ▼
           Service Layer
                  │
                  ▼
        Spring Data JPA
                  │
                  ▼
            PostgreSQL
```

<img width="1024" height="615" alt="watermarked_img_4109574969944828594" src="https://github.com/user-attachments/assets/609e7caf-a1c8-4606-a5c8-9c1eb1039e18" />

---

# 📂 프로젝트 구조

## Frontend

```text
src
├── api
├── assets
├── components
├── contexts
├── hooks
├── layouts
├── pages
├── router
├── types
└── utils
```

## Backend

```text
src
└── main
    ├── java
    │   ├── controller
    │   ├── service
    │   ├── repository
    │   ├── entity
    │   ├── dto
    │   ├── config
    │   ├── security
    │   └── exception
    └── resources
```

---

# 🗄 ERD

프로젝트의 주요 엔티티는 다음과 같습니다.

- User
- Trip
- Group
- GroupMember
- Schedule
- Payment
- Settlement
- Wallet
- WalletHistory
- Notification

<img width="1536" height="1024" alt="ChatGPT Image 2026년 7월 30일 오전 10_28_04" src="https://github.com/user-attachments/assets/4e33bac6-c8c3-4ed9-9223-a3af81607027" />

---

# 📷 주요 화면

### 메인 화면

(스크린샷)

### 여행 생성

(스크린샷)

### 일정 관리

(스크린샷)

### 결제

(스크린샷)

### 정산

(스크린샷)

### 전자지갑

(스크린샷)

### 마이페이지

(스크린샷)

---

# 🔐 인증 방식

- JWT Access Token 기반 인증
- Spring Security 적용
- 인증이 필요한 API는 JWT 검증 후 접근 가능

---

# 🚀 실행 방법

## Frontend

```bash
git clone https://github.com/suyeon1104/RBC_Triply.git

cd triply_front

npm install

npm run dev
```

## Backend

```bash
git clone https://github.com/suyeon1104/RBC_Triply.git

cd backend

./gradlew bootRun
```

---

# 📅 개발 기간

2026.07.15 ~ 2026.07.31

---

# 👨‍👩‍👧‍👦 팀 구성

| 역할 | 담당 |
|------|------|
| Frontend | React + TypeScript |
| Backend | Spring Boot |
| Database | PostgreSQL |


---

# 🌱 향후 개선 사항

- OAuth 로그인
- 실시간 알림
- 지도 기반 일정 추천
- AI 여행 일정 추천

---

# 📄 라이선스

본 프로젝트는 학습 및 포트폴리오 목적으로 제작되었습니다.
