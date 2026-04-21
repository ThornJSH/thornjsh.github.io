@echo off
setlocal
chcp 65001 > nul

echo [깃허브 동기화 시작]
echo.

:: 1. 원격 저장소에서 최신 내용 가져오기
echo 1. 서버에서 최신 정보 가져오는 중...
git fetch origin main

:: 2. 로컬 브랜치에 반영 (Pull)
echo 2. 로컬 파일 업데이트 중 (Pull)...

:: 현재 병합 중인지 확인
if exist ".git\MERGE_HEAD" (
    git commit -m "Merge branch 'main' (Auto fixed by sync.bat)" 2>nul
)

git pull origin main
if %errorlevel% neq 0 (
    echo [경고] Pull 실패. 충돌이 있는지 확인하세요.
)

echo.
echo [동기화 완료!]
echo.
pause
