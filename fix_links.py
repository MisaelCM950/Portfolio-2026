from pathlib import Path
import os, re

root = Path(r'c:\Users\misae\OneDrive\Documents\Portfolio')
pattern = re.compile(r'([A-Za-z-]+)=(["\'])(/[^"\']+)(\2)')

for p in root.rglob('*.html'):
    text = p.read_text(encoding='utf-8')
    changed = False

    def repl(m):
        nonlocal changed
        attr, quote, value, _ = m.groups()
        if not value.startswith('/'):
            return m.group(0)

        original = value
        path_part = value.split('?', 1)[0].split('#', 1)[0]
        target = root / path_part.lstrip('/')

        if path_part.endswith('/') or target.is_dir():
            if target.is_dir() and (target / 'index.html').exists():
                target = target / 'index.html'
        elif target.exists() and target.is_dir():
            target = target / 'index.html'

        if not target.exists() and not path_part.endswith('/'):
            return m.group(0)

        rel = os.path.relpath(target, start=p.parent).replace('\\', '/')
        suffix = ''
        if '?' in value:
            suffix += '?' + value.split('?', 1)[1]
        if '#' in value:
            if '?' in value:
                qpart = value.split('?', 1)[1]
                suffix = '?' + qpart.split('#', 1)[0] + '#' + qpart.split('#', 1)[1]
            else:
                suffix = '#' + value.split('#', 1)[1]
        if original.endswith('/') and not rel.endswith('/') and rel and rel != '.':
            rel += '/'
        if rel == '.':
            rel = ''
        new = rel if rel else ''
        if new == '':
            new = '.' if original == '/' else ''
        result = f'{attr}={quote}{new}{suffix}{quote}'
        if result != m.group(0):
            changed = True
        return result

    new_text = pattern.sub(repl, text)
    if changed:
        p.write_text(new_text, encoding='utf-8')
        print(f'Updated {p.relative_to(root)}')
