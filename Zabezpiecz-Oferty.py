import os
import re
import base64
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import pad
from Crypto.Hash import SHA256

# Słownik plików i ich haseł
PASSWORDS = {
    'oferta-2026.source.html': 'essa2026',
    'oferta-2027.source.html': 'szpont2027',
    'oferta-2028.source.html': 'smash2028'
}

JS_TEMPLATE = """
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    <script>
        const encryptedData = {
            salt: "{salt}",
            iv: "{iv}",
            ciphertext: "{ciphertext}"
        };
        
        function checkPassword() {
            var pwd = document.getElementById("password-input").value;
            try {
                var salt = CryptoJS.enc.Base64.parse(encryptedData.salt);
                var iv = CryptoJS.enc.Base64.parse(encryptedData.iv);
                var key = CryptoJS.PBKDF2(pwd, salt, { keySize: 256/32, iterations: 10000, hasher: CryptoJS.algo.SHA256 });
                
                var cipherParams = CryptoJS.lib.CipherParams.create({
                    ciphertext: CryptoJS.enc.Base64.parse(encryptedData.ciphertext)
                });
                var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv: iv });
                var html = decrypted.toString(CryptoJS.enc.Utf8);
                
                if (html.includes('id="main-content"')) {
                    document.getElementById("main-content-wrapper").innerHTML = html;
                    document.getElementById("main-content").style.display = "block";
                    sessionStorage.setItem("oferta_unlocked_{year}", "true");
                    sessionStorage.setItem("oferta_pwd_{year}", pwd);
                    unlockContent();
                } else {
                    showError();
                }
            } catch(e) {
                showError();
            }
        }
        
        function showError() {
            document.getElementById("error-msg").style.display = "block";
            setTimeout(() => document.getElementById("error-msg").style.display = "none", 3000);
        }
        
        function unlockContent() {
            document.getElementById("password-screen").style.display = "none";
            
            if (typeof initGlobalAnimations === 'function') {
                setTimeout(initGlobalAnimations, 100);
            } else {
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
        }

        window.addEventListener("DOMContentLoaded", function() {
            var savedPwd = sessionStorage.getItem("oferta_pwd_{year}");
            if (sessionStorage.getItem("oferta_unlocked_{year}") === "true" && savedPwd) {
                document.getElementById("password-input").value = savedPwd;
                checkPassword(); // auto unlock
            }
        });

        document.getElementById("password-input").addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                checkPassword();
            }
        });
    </script>
    <div id="main-content-wrapper"></div>
"""

def encrypt_html(html_str, password):
    salt = os.urandom(16)
    iv = os.urandom(16)
    key = PBKDF2(password, salt, 32, count=10000, hmac_hash_module=SHA256)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    ciphertext = cipher.encrypt(pad(html_str.encode('utf-8'), AES.block_size))
    
    return {
        'salt': base64.b64encode(salt).decode('utf-8'),
        'iv': base64.b64encode(iv).decode('utf-8'),
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8')
    }

def process_file(source_file):
    if not os.path.exists(source_file):
        print(f"Brak pliku {source_file}, pomijam.")
        return
        
    password = PASSWORDS.get(source_file)
    year = re.search(r'202\d', source_file).group()
    
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Znajdź główną treść <div id="main-content">
    start_idx = content.find('<div id="main-content">')
    if start_idx == -1:
        print(f"Błąd: Nie znaleziono <div id=\"main-content\"> w {source_file}")
        return
        
    # Szukamy końca (ostatni </div> przed </body>)
    end_idx = content.rfind('</body>')
    if end_idx == -1:
        print(f"Błąd: Nie znaleziono </body> w {source_file}")
        return
        
    main_content = content[start_idx:end_idx]
    
    print(f"Szyfruje {source_file} hasłem...")
    enc_data = encrypt_html(main_content, password)
    
    # Usuwamy stare skrypty weryfikacji i generujemy nową strukturę HTML
    # Pamiętaj, że skrypt zaczynał się gdzieś w okolicach <script> pod "password-container"
    
    top_html = content[:start_idx]
    # Usuń ze starego top_html wystąpienia starego "function checkPassword()" czyli usuń stary skrypt
    # Najprościej: znajdź <script> function checkPassword() i wytnij do </script>
    script_start = top_html.find('<script>\n        function checkPassword()')
    if script_start == -1:
        script_start = top_html.find('<script>\n        function checkPassword')
    if script_start == -1:
        # Fallback na regex
        match = re.search(r'<script>[^<]*function checkPassword[^<]*</script>', top_html, flags=re.DOTALL)
        if match:
            script_start = match.start()
            script_end = match.end()
            top_html = top_html[:script_start] + top_html[script_end:]
        else:
            # Maybe there are multiple script tags, let's just strip the one defining checkPassword
            pass
            
    # Clean up anyway using regex to be perfectly sure we remove the old plaintext password script
    top_html = re.sub(r'<script>[\s\S]*?function checkPassword[\s\S]*?</script>', '', top_html)
            
    new_js = JS_TEMPLATE.replace("{salt}", enc_data['salt']).replace("{iv}", enc_data['iv']).replace("{ciphertext}", enc_data['ciphertext']).replace("{year}", year)
    
    final_content = top_html + new_js + "\n</body>\n</html>"
    
    output_meta = source_file.replace('.source.html', '.html')
    with open(output_meta, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    print(f"Gotowe! Wygenerowano {output_meta}")

if __name__ == "__main__":
    for f in PASSWORDS.keys():
        process_file(f)
