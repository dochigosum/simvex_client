# Simvex API 연동 가이드

백엔드 API와 완전히 연동된 Simvex CAD 애플리케이션입니다.

## 개발 모드

### 두 가지 모드 지원

**1. 개발 모드 (기본)** - localStorage만 사용
- 백엔드 서버 없이 개발 가능
- 모든 데이터는 브라우저 localStorage에 저장
- `.env` 파일에서 설정: `VITE_USE_API=false`

**2. API 모드** - 백엔드 연동
- 백엔드 서버와 완전히 연동
- 자동 저장 타이머 활성화 (2분/15분)
- `.env` 파일에서 설정: `VITE_USE_API=true`

---

## 환경 설정

### 1. 환경변수 설정

`.env.example` 파일을 `.env`로 복사하고 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일:
```env
# 개발 모드 (기본) - localStorage만 사용
VITE_USE_API=false

# API 모드 - 백엔드 연동
# VITE_USE_API=true
# VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. 패키지 설치 및 실행

```bash
npm install
npm start
```

---

## 모드 전환 방법

### 개발 모드 → API 모드

1. `.env` 파일 수정:
```env
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

2. 서버 재시작:
```bash
# Ctrl+C로 종료 후
npm start
```

### API 모드 → 개발 모드

1. `.env` 파일 수정:
```env
VITE_USE_API=false
```

2. 서버 재시작:
```bash
# Ctrl+C로 종료 후
npm start
```

**주의:** 환경변수 변경 후 **반드시 서버를 재시작**해야 합니다!

---

## API 서비스 구조

```
src/services/
├── api.js              - API 호출 기본 헬퍼
├── authApi.js          - 인증 API
├── projectApi.js       - 프로젝트 API
├── drawingApi.js       - 조립도 API
└── assistanceApi.js    - AI 어시스턴트 API
```

---

## API 엔드포인트

### 인증 (/auth)

- `POST /auth/join` - 회원가입
- `POST /auth/join/verify` - 이메일 인증
- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃

### 프로젝트 (/project)

- `POST /project` - 프로젝트 생성
- `GET /project?user_id={id}` - 프로젝트 목록 조회
- `GET /project/{project_name}/detail` - 프로젝트 상세 조회
- `PATCH /project/{project_name}/rename` - 이름 변경
- `DELETE /project/{project_name}/delete` - 삭제
- `POST /project/{project_name}/part/{part_id}` - 부품 추가
- `PUT /project/{project_name}/store` - 프로젝트 저장

### 조립도 (/drawing_template)

- `GET /drawing_template` - 조립도 목록 조회
- `GET /drawing_template/{id}/part` - 부품 목록 조회

### AI 어시스턴트 (/assistance)

- `POST /assistance` - AI에게 질문
- `GET /assistance` - 대화 내역 조회

---

## 자동 저장 기능

API 모드에서만 작동:

- **2분마다**: Redis에 임시 저장 (이미지 없음)
- **15분마다**: MySQL에 저장 (스크린샷 포함)

개발 모드에서는 수동 저장만 가능 (localStorage)

---

## partInfo 데이터 구조

프로젝트 저장 시 전달되는 부품 정보:

```json
[
  {
    "id": 1,
    "x_coordinate": 100,
    "y_coordinate": 50,
    "z_coordinate": 0,
    "x_rotation": 0,
    "y_rotation": 90,
    "z_rotation": 0
  },
  {
    "id": 2,
    "x_coordinate": 150,
    "y_coordinate": 30,
    "z_coordinate": 10,
    "x_rotation": 45,
    "y_rotation": 0,
    "z_rotation": 180
  }
]
```

---

## 에러 처리

### 401 Unauthorized
- 토큰 만료 시 자동으로 로그인 페이지로 이동
- localStorage의 auth_token 제거

### API 호출 실패
- localStorage 폴백 사용
- 사용자에게 에러 메시지 표시
- "다시 시도" 버튼 제공

---

## 콘솔 로그

개발 중 확인할 수 있는 로그:

```
🔧 개발 모드: API 사용 / localStorage만 사용
📡 API: 프로젝트 목록 조회 시작...
✅ API: 프로젝트 목록 조회 성공
❌ API: 프로젝트 목록 조회 실패
⚠️ localStorage 폴백 사용
📂 localStorage에서 프로젝트 불러오기...
💾 저장 시작!
⏰ Redis 자동 저장 (2분)
⏰ MySQL 자동 저장 (15분)
```

---

## 백엔드 개발자를 위한 참고사항

### CORS 설정 필요

```javascript
// Spring Boot 예시
@CrossOrigin(origins = "http://localhost:5173")
```

### FormData 처리

`/project/{project_name}/store` 엔드포인트는 FormData 형식:

```
partInfo: JSON string
saveImage: File (PNG)
```

### 경로 파라미터 이슈

현재 API 명세에서는 `{project_name}`을 사용하지만, `{project_id}`를 사용하는 것을 권장합니다.

---

## 테스트 방법

### 개발 모드 테스트
1. `.env`에서 `VITE_USE_API=false` 확인
2. `npm start`
3. 프로젝트 생성 → localStorage에 저장됨
4. 새로고침 → 데이터 복원됨

### API 모드 테스트
1. 백엔드 서버 실행
2. `.env`에서 `VITE_USE_API=true` 설정
3. `npm start`
4. 프로젝트 생성 → API 호출 + localStorage
5. 자동 저장 확인 (콘솔 로그)

---

## 트러블슈팅

### 환경변수가 적용되지 않아요
→ 서버를 재시작하세요 (Ctrl+C → npm start)

### API 호출이 실패해요
→ 백엔드 서버가 실행 중인지 확인하세요
→ CORS 설정을 확인하세요

### localStorage에 데이터가 없어요
→ F12 → Application → Local Storage → localhost 확인
→ `simvex_projects` 키가 있는지 확인

---

## 문의

개발 중 문제가 발생하면:
1. 콘솔 로그 확인 (F12)
2. Network 탭에서 API 호출 확인
3. localStorage 데이터 확인
