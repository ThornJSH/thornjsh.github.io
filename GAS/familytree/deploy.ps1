$DeploymentId = "AKfycbxrOAEqouu3ZnK8vwodn2NxBLxSYiVUu5oEwRb4jpj_T610KlrEWz5CG6CMnvMh7He9"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " Google Apps Script 재배포 (기존 URL 유지)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n1. 코드 푸시 (clasp push)..." -ForegroundColor Yellow
clasp push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n2. 기존 웹앱 배포 업데이트 (clasp deploy)..." -ForegroundColor Yellow
    clasp deploy -i $DeploymentId -d "웹앱 업데이트"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n========================================================" -ForegroundColor Green
        Write-Host " 배포 완료! 웹앱 URL (고정):" -ForegroundColor Green
        Write-Host " https://script.google.com/macros/s/$DeploymentId/exec" -ForegroundColor Green
        Write-Host "========================================================" -ForegroundColor Green
    }
}
