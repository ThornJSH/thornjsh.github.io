@echo off
setlocal
chcp 65001 > nul

:: 1. 현재 폴더 위치 고정
cd /d "%~dp0"

echo [깃허브 최신 버전 업데이트 시작]
echo.

:: 2. 깃허브로부터 최신 코드 가져오기
echo 1. 원격 저장소(GitHub)에서 최신 데이터를 불러오는 중...

:: 현재 병합 중인지 확인
if exist ".git\MERGE_HEAD" (
    echo [경고] 현재 병합(Merge)이 중단된 상태입니다.
    echo 이전 변경 사항을 먼저 커밋하거나 해결해야 합니다.
    git commit -m "Merge branch 'main' (Auto fixed by update.bat)" 2>nul
)

git pull origin main
if %errorlevel% neq 0 (
    echo.
    echo [오류] 동기화 중 문제가 발생했습니다. (충돌 등)
    echo 강제 동기화를 시도하려면 'git reset --hard origin/main'을 고려하세요.
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [오류] 업데이트 중 문제가 발생했습니다. (네트워크 연결 혹은 충돌 확인)
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [업데이트 완료!]
echo.
pause
