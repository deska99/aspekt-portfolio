const fs = require('fs');

// Fix styles.css
let css = fs.readFileSync('styles.css', 'utf8');
css = css.replace(/\.review-card {\n    min-width: 60vw;\n    font-family: var(--f-serif);\n    font-size: 2.5rem;/g, '.review-card {\n    min-width: 60vw;\n    font-family: var(--f-serif);\n    font-size: 1.8rem;');
css = css.replace(/\/\* GLOBAL FOOTER \*\/[\s\S]*?z-index: 10;\n}/g, '/* GLOBAL FOOTER */\n.site-footer {\n    width: 100%;\n    background: transparent;\n    color: var(--accent);\n    text-align: center;\n    padding: 5vh 0;\n    font-family: var(--f-sans);\n    font-size: 0.65rem;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 2px;\n    line-height: 1.8;\n    position: relative;\n    z-index: 10;\n    clear: both;\n}');
fs.writeFileSync('styles.css', css);

// Fix HTML files
const files = ['index.html', 'about.html', 'portfolio.html', 'contact.html'];
const footerStr = '<footer class="site-footer">WEB CR8 KRZYSZTOF ILENDO &copy;<br>FOTOGRAF BIAŁYSTOK WARSZAWA</footer>\n</body>';
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    // Remove existing footers if any
    content = content.replace(/<footer class="site-footer">.*?<\/footer>/g, '');
    content = content.replace(/<div class="site-footer".*?>.*?<\/div>/g, '');
    
    // Add safely right before </body> to ensure it's at the very bottom
    content = content.replace(/<\/body>/g, footerStr);
    
    fs.writeFileSync(file, content);
});
console.log('Fixed styles and footer placements.');
