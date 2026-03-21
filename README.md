# CREMA Contents Generator

## 배포 순서 (처음 한 번만)

### 1. GitHub에 올리기

```bash
cd crema-generator
git init
git add .
git commit -m "init"
```

GitHub에서 새 repository 만들고:
```bash
git remote add origin https://github.com/본인아이디/crema-generator.git
git push -u origin main
```

### 2. Vercel 배포

1. https://vercel.com 접속 → GitHub 계정으로 로그인
2. **"New Project"** 클릭
3. 방금 만든 `crema-generator` repo 선택 → **Import**
4. Framework: **Next.js** (자동 감지됨)
5. **Environment Variables** 섹션에서:
   - Key: `ANTHROPIC_API_KEY`
   - Value: Anthropic API 키 입력
6. **Deploy** 클릭

2~3분 후 `https://crema-generator-xxx.vercel.app` 주소로 접속 가능.

### 3. 이후 수정사항 반영

```bash
git add .
git commit -m "수정 내용"
git push
```

push하면 Vercel이 자동으로 재배포해요.

## 로컬 실행 (개발용)

```bash
npm install
npm run dev
# http://localhost:3000
```
# rebuild
# fix
# fix3
