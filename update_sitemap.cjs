const fs = require('fs');
const path = 'e:/github_page/sitemap.html';

let content = fs.readFileSync(path, 'utf8');

const target = '사회복지시설 공통업무 캘린더</a>\n                                </li>';
const replacement = '사회복지시설 공통업무 캘린더</a>\n                                </li>\n                                <li><a href="/ai-case-helper_v1.html" onclick="event.preventDefault(); window.loadContent(\'AI 사례관리 입력 도우미\');">AI 사례관리 입력 도우미</a></li>';

if (content.includes('사회복지시설 공통업무 캘린더')) {
    // Try to replace the exact block. Since line endings might be \r\n or \n, let's be flexible.
    content = content.replace(/사회복지시설\s+공통업무 캘린더<\/a>\s+<\/li>/, '사회복지시설\n                                                공통업무 캘린더</a>\n                                </li>\n                                <li><a href="/ai-case-helper_v1.html" onclick="event.preventDefault(); window.loadContent(\'AI 사례관리 입력 도우미\');">AI 사례관리 입력 도우미</a></li>');
    
    fs.writeFileSync(path, content, 'utf8');
    console.log('Updated sitemap.html');
} else {
    console.log('Target not found');
}
