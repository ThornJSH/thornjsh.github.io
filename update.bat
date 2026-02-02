@echo off
setlocal
chcp 65001 > nul

echo [깃허브 최신 버전 동기화 시작]
echo.

:: 1. 현재 폴더 위치 확인
cd /d "%~dp0"

:: 2. 깃허브로부터 최신 코드 가져오기
echo 1. 원격 저장소(GitHub)에서 최신 데이터를 불러오는 중...
git pull origin main

echo.
echo [동기화 완료!]
echo.
pause
