@echo off
setlocal
chcp 65001 > nul

echo [깃허브 자동 배포 시작]
echo.

:: 1. 변경된 모든 파일 추가
echo 1. 변경 사항 스테이징 중...
git add .

:: 2. 현재 시간을 포함한 커밋 메시지 생성
set CURRENT_TIME=%date% %time%
echo 2. 커밋 생성 중 (메시지: Auto Update %CURRENT_TIME%)
git commit -m "Auto Update %CURRENT_TIME%"

:: 3. 깃허브로 푸시
echo 3. 서버로 전송 중 (Push)...
git push origin main

echo.
echo [배포 완료!]
echo.
pause
