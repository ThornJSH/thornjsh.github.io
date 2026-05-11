@echo off
setlocal
chcp 65001 > nul

:: 1. 현재 폴더 위치 고정 (어디서 실행해도 저장소 루트를 기준으로 작동하도록)
cd /d "%~dp0"

echo [깃허브 자동 배포 시작]
echo.

:: 2. 변경된 모든 파일 추가
echo 1. 변경 사항 스테이징 중...
git add .

:: 3. 현재 시간을 포함한 커밋 메시지 생성
set CURRENT_TIME=%date% %time%
echo 2. 커밋 생성 중 (메시지: Auto Update %CURRENT_TIME%)
git commit -m "Auto Update %CURRENT_TIME%"

:: 4. 깃허브로 푸시
echo 3. 서버(GitHub)로 전송 중 (Push)...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [오류] 배포 중 문제가 발생했습니다. (네트워크 연결 혹은 권한 확인)
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [배포 완료!]
echo.
pause
