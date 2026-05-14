$path = "e:\github_page\sitemap.html"
$content = Get-Content $path -Raw -Encoding UTF8

$oldText = '<li><a href="/사회복지시설 공통업무 캘린더"
                                                onclick="event.preventDefault(); window.loadContent(''사회복지시설 공통업무 캘린더'');">사회복지시설
                                                공통업무 캘린더</a>
                                </li>'

$newText = $oldText + '
                                <li><a href="/Care Insight"
                                                onclick="event.preventDefault(); window.loadContent(''Care Insight'');">Care Insight (사례관리)</a></li>'

if ($content.Contains("사회복지시설 공통업무 캘린더")) {
    # We need to be careful with exact whitespace. Let's try a regex replace if possible, 
    # but since I have the exact output from view_file, I'll try to build the string carefully.
    
    # Try a simpler replace if the above fails
    $content = $content -replace '사회복지시설\s+공통업무 캘린더</a>\s+</li>', "사회복지시설`n                                                공통업무 캘린더</a>`n                                </li>`n                                <li><a href=""/Care Insight"" onclick=""event.preventDefault(); window.loadContent('Care Insight');"">Care Insight (사례관리)</a></li>"
    
    Set-Content -Path $path -Value $content -Encoding UTF8
    Write-Host "Updated sitemap.html"
} else {
    Write-Host "Could not find the target text"
}
