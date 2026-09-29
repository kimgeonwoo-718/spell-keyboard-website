# Spell Keyboard 웹사이트

맞춤법 교정 Windows 프로그램 **Spell Keyboard**의 소개 및 다운로드 페이지입니다.
빌드 과정 없이 HTML/CSS/JS만으로 만들어져 있어 GitHub Pages에 바로 올릴 수 있습니다.

## 폴더 구조

```
index.html            페이지 본문 (문구 수정은 여기서)
assets/css/style.css  디자인 (색상은 맨 위 :root 변수에서 변경)
assets/js/config.js   다운로드 설정 — 새 버전 배포 시 여기만 수정
assets/js/main.js     다운로드 버튼 · 교정 데모 애니메이션
assets/img/favicon.svg 로고 / 파비콘
```

## 로컬에서 보기

```bash
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 열면 됩니다.

## 다운로드 파일 연결하기

`assets/js/config.js`에서 둘 중 하나를 설정하세요.

1. **GitHub Releases (추천)** — 프로그램 저장소에서 Release를 만들고 설치 파일(`.exe` 또는 `.msi`)을 첨부한 뒤
   `githubRepo: "계정/저장소"`를 입력하면, 최신 릴리스의 파일·버전·용량·날짜가 자동으로 표시됩니다.
   새 버전을 낼 때 웹사이트는 수정할 필요가 없습니다.
2. **직접 링크** — `downloadUrl`에 설치 파일 주소를 넣고 `version`, `fileSize`, `releaseDate`도 함께 수정하세요.

아무것도 설정하지 않으면 다운로드 버튼을 눌렀을 때 "준비 중" 안내가 뜹니다.

## GitHub Pages로 배포하기

1. 이 저장소의 **Settings → Pages**로 이동
2. **Source**를 `Deploy from a branch`로, 브랜치를 `main` / `/ (root)`로 선택 후 저장
3. 잠시 후 `https://<계정>.github.io/spell-keyboard-website/` 에서 확인할 수 있습니다

## 수정이 필요한 부분 (TODO)

- [ ] 기능 소개 문구를 실제 프로그램 기능에 맞게 수정 (`index.html`의 기능 섹션)
- [ ] 단축키 `Ctrl + Shift + K`를 실제 단축키로 변경
- [ ] 시스템 요구사항(디스크 공간, 인터넷 필요 여부) 확인
- [ ] 실제 프로그램 스크린샷 추가
- [ ] 개인정보처리방침 페이지 (입력한 글을 외부 서버로 보낸다면 필수)
