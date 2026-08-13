import re
import glob

files = glob.glob('oferta-202*.source.html')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    def replacer(match):
        price_num = int(match.group(1))
        rest_of_price = match.group(2)
        
        new_total = price_num + 1
        
        new_price_str = f'<div class="price">{new_total} {rest_of_price} PLN</div>'
        new_zadatek_str = f'<div class="zadatek">( 1 000 PLN zadatku przy podpisaniu umowy + {price_num} {rest_of_price} PLN na weselu )</div>'
        
        return new_price_str + '\n                    ' + new_zadatek_str

    pattern = r'<div class="price">(\d+) (\d{3}) PLN</div>\s*<div class="zadatek">\+ 1 000 PLN \(ZADATEK\)</div>'
    
    new_content = re.sub(pattern, replacer, content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(new_content)
        
    print(f"Updated {f}")
