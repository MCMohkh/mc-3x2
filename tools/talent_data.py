"""Extract the data for each talent press kit from the talent profile pages."""
import re,os,glob,html
from bs4 import BeautifulSoup
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def clean(t): return re.sub(r'\s+',' ',html.unescape(t or '')).strip()
def inline(el):
    for br in el.find_all('br'): br.replace_with(' ')
    t=clean(el.get_text(''))
    return re.sub(r'\s+([,.;:!?)’])',r'\1',t)
def extract(slug):
    path=os.path.join(ROOT,'clients','talent',slug+'.html')
    soup=BeautifulSoup(open(path,encoding='utf-8').read(),'lxml')
    info=soup.select_one('.talent-profile-info')
    name=clean(info.select_one('h1').get_text())
    role=clean(info.select_one('.talent-profile-role').get_text(' ')) if info.select_one('.talent-profile-role') else ''
    hero_p=[inline(p) for p in info.find_all('p') if clean(p.get_text())]
    photo=None
    img=soup.select_one('.talent-profile-img img')
    if img and img.get('src') and not img['src'].startswith('http'): photo=os.path.join(ROOT,img['src'].lstrip('/'))
    body=soup.select_one('.profile-body')
    main=body.find('div',recursive=False) if body else None
    about=[]
    if main:
        for el in main.children:
            if getattr(el,'name',None)=='p' and 'coming-soon-note' not in (el.get('class') or []):
                t=inline(el)
                if len(t)>40: about.append(t)
            if getattr(el,'name',None) in('h3','ul','div') and about and (el.name=='ul' or el.name=='h3'): break
    quick=[]
    side=body.select('.sidebar-card')[0] if body and body.select('.sidebar-card') else None
    if side:
        for row in side.select('.info-row'):
            kids=[clean(c.get_text(' ')) for c in row.find_all(['span','div'],recursive=False)]
            if len(kids)>=2: quick.append((kids[0].title() if kids[0].isupper() else kids[0],', '.join(kids[1:])))
    links=[];seen=set()
    for a in soup.select('.talent-profile-hero a[href^=http], .social-platform-links a[href^=http], .find-online-links a[href^=http], .sidebar-card a[href^=http]'):
        h=a['href']; t=clean(a.get_text(' '))
        if h in seen or 'mcjoint.in' in h: continue
        seen.add(h); links.append((t or h,h))
    films=[]
    for li in soup.select('.discography li'):
        title=inline(li.select_one('.disc-title') or li)
        typ=inline(li.select_one('.disc-type')) if li.select_one('.disc-type') else ''
        det=inline(li.select_one('.disc-role')) if li.select_one('.disc-role') else ''
        year=clean(li.select_one('.disc-year').get_text(' ')) if li.select_one('.disc-year') else ''
        films.append(dict(title=title,type=typ,year=year,detail=det))
    return dict(slug=slug,name=name,role=role,tagline=hero_p,photo=photo,about=about,quick=quick,links=links,films=films)
def all_slugs():
    return sorted(os.path.basename(f)[:-5] for f in glob.glob(os.path.join(ROOT,'clients','talent','*.html')) if 'template-' not in f)
if __name__=='__main__':
    import json,sys
    for s in sys.argv[1:] or all_slugs():
        d=extract(s); print(json.dumps(d,ensure_ascii=False,indent=1)[:1800]); print('...')
