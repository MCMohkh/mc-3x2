#!/usr/bin/env python3
"""Build a short press-kit PDF for every talent profile -> press-kits/<slug>-press-kit.pdf

Run from the repo root after editing any talent profile:
    pip install reportlab fonttools brotli pillow beautifulsoup4 lxml
    python3 tools/build_press_kits.py            # all talent
    python3 tools/build_press_kits.py smaran     # one talent
Content comes from clients/talent/<slug>.html (name, role, quick info, about, filmography, links).
"""
import os,re,sys,tempfile,datetime
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import talent_data as T
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from reportlab.platypus import BaseDocTemplate,PageTemplate,Frame,Paragraph,Spacer,Table,TableStyle,Image as RLImage,KeepTogether,HRFlowable

ROOT=T.ROOT
OUT=os.path.join(ROOT,'press-kits')
RED=colors.HexColor('#E10600'); BLACK=colors.HexColor('#0A0A0A'); GREY=colors.HexColor('#666666'); LIGHT=colors.HexColor('#F4F4F4'); LINE=colors.HexColor('#DDDDDD')
# ---- MC Joint's own contact details (as shown on mcjoint.in/contact.html) ----
CONTACT=dict(brand='MC Joint — Masters of Ceremonies',founder='Sonu Mohkh, Founder',email='info@mcjoint.in',phone='+91 90144 14114',
             whatsapp='https://wa.me/919014414114',location='Hyderabad, Telangana, India',site='mcjoint.in')
SHOW_FOUNDER=True
MAX_FILMS=30

# ---- fonts: static instances cut from the site's own variable fonts ----
FD=tempfile.mkdtemp(prefix='mcfonts')
def make_font(woff2,wght,name):
    f=TTFont(os.path.join(ROOT,'fonts',woff2)); f.flavor=None
    inst=instancer.instantiateVariableFont(f,{'wght':wght}); p=os.path.join(FD,name+'.ttf'); inst.save(p)
    pdfmetrics.registerFont(RLFont(name,p)); return set(TTFont(p).getBestCmap().keys())
CM=make_font('montserrat-var.woff2',700,'Mont-B'); make_font('montserrat-var.woff2',800,'Mont-XB')
CI=make_font('inter-var.woff2',400,'Inter'); make_font('inter-var.woff2',600,'Inter-SB')
pdfmetrics.registerFontFamily('Inter',normal='Inter',bold='Inter-SB',italic='Inter',boldItalic='Inter-SB')
def safe(t):
    t=(t or '').replace('\u200b','')
    return ''.join(c for c in t if ord(c) in CI or c in '\n ')
def esc(t): return safe(t).replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def trim(t,n):
    if len(t)<=n: return t
    cut=t[:n]; k=max(cut.rfind('. '),cut.rfind('! '),cut.rfind('? '))
    return (cut[:k+1] if k>n*0.5 else cut.rsplit(' ',1)[0]+'…')

S=dict(
 role=ParagraphStyle('role',fontName='Inter-SB',fontSize=8.5,leading=11,textColor=RED,spaceAfter=3),
 name=ParagraphStyle('name',fontName='Mont-XB',fontSize=27,leading=30,textColor=BLACK,spaceAfter=7),
 tag=ParagraphStyle('tag',fontName='Inter',fontSize=10,leading=14.5,textColor=GREY),
 h=ParagraphStyle('h',fontName='Mont-B',fontSize=8.5,leading=11,textColor=RED,spaceBefore=9,spaceAfter=4),
 body=ParagraphStyle('body',fontName='Inter',fontSize=9.4,leading=14,textColor=colors.HexColor('#222222'),spaceAfter=5),
 ql=ParagraphStyle('ql',fontName='Inter-SB',fontSize=7.5,leading=10,textColor=GREY),
 qv=ParagraphStyle('qv',fontName='Inter-SB',fontSize=9.2,leading=12,textColor=BLACK),
 ft=ParagraphStyle('ft',fontName='Inter-SB',fontSize=9.2,leading=12,textColor=BLACK),
 fm=ParagraphStyle('fm',fontName='Inter',fontSize=8.2,leading=11,textColor=GREY),
 link=ParagraphStyle('link',fontName='Inter',fontSize=9,leading=13,textColor=colors.HexColor('#222222')),
 cw=ParagraphStyle('cw',fontName='Inter',fontSize=9,leading=13.5,textColor=colors.white),
 ch=ParagraphStyle('ch',fontName='Mont-B',fontSize=10.5,leading=14,textColor=colors.white,spaceAfter=4),
)
def label_for(text,url):
    u=url.lower()
    for k,v in (('instagram.com','Instagram'),('imdb.com','IMDb'),('youtube.com','YouTube'),('youtu.be','YouTube'),('spotify.com','Spotify'),('music.apple.com','Apple Music'),('facebook.com','Facebook'),('x.com','X'),('twitter.com','X'),('linkedin.com','LinkedIn')):
        if k in u:
            t=re.sub(r'\b(IMDb|Instagram|YouTube|Spotify|Apple Music)\b','',text or '').strip(' ·-—')
            return v+(f' ({t})' if t and len(t)<40 and t.lower()!=v.lower() else '')
    return (text or url)[:40]
def photo_file(d):
    p=d['photo']
    if not p or not os.path.exists(p) or '/images/mc/' in p: return None
    im=Image.open(p).convert('RGB'); w,h=im.size; tw,th=3,4
    if w/h>tw/th: nw=int(h*tw/th); x=(w-nw)//2; im=im.crop((x,0,x+nw,h))
    else: nh=int(w*th/tw); y=int((h-nh)*0.15); im=im.crop((0,y,w,y+nh))
    im.thumbnail((600,800)); out=os.path.join(FD,d['slug']+'.jpg'); im.save(out,quality=82); return out
def initials(name): return ''.join(w[0] for w in name.split()[:2]).upper()

LEVELS=[dict(about=560,paras=2,hb=9,fs=9.4,pw=39,ph=52),dict(about=470,paras=2,hb=7,fs=9.1,pw=37,ph=49),dict(about=390,paras=2,hb=6,fs=8.8,pw=35,ph=46.7),dict(about=420,paras=1,hb=5,fs=8.8,pw=35,ph=46.7),dict(about=360,paras=1,hb=4,fs=8.6,pw=32,ph=42.7,ff=0.92),dict(about=330,paras=1,hb=4,fs=8.4,pw=30,ph=40,ff=0.88,mf=16)]

def build(slug,lvl=0):
    LV=LEVELS[lvl]; S['h'].spaceBefore=LV['hb']; S['body'].fontSize=LV['fs']; S['body'].leading=LV['fs']*1.48
    ff=LV.get('ff',1.0); S['ft'].fontSize=9.2*ff; S['ft'].leading=12*ff; S['fm'].fontSize=8.2*ff; S['fm'].leading=11*ff
    d=T.extract(slug); os.makedirs(OUT,exist_ok=True)
    path=os.path.join(OUT,f'{slug}-press-kit.pdf'); W,H=A4; M=17*mm; BAND=18*mm
    def page(c,doc):
        c.saveState(); c.setFillColor(BLACK); c.rect(0,H-BAND,W,BAND,stroke=0,fill=1)
        logo=os.path.join(ROOT,'images','mc','mc-joint-logo-5-mc-joint-block-logo.png')
        if os.path.exists(logo): c.drawImage(logo,M,H-BAND+3*mm,width=32*mm,height=12*mm,preserveAspectRatio=True,mask='auto')
        c.setFillColor(colors.white); c.setFont('Mont-B',8.5); c.drawRightString(W-M,H-BAND/2-1.5*mm,'TALENT PROFILE · PRESS KIT')
        c.setStrokeColor(LINE); c.line(M,12*mm,W-M,12*mm); c.setFillColor(GREY); c.setFont('Inter',7.5)
        c.drawString(M,8*mm,f"{CONTACT['site']}/clients/talent/{slug}  ·  Updated {datetime.date.today().strftime('%B %Y')}")
        c.drawRightString(W-M,8*mm,f'Page {doc.page}'); c.restoreState()
    doc=BaseDocTemplate(path,pagesize=A4,leftMargin=M,rightMargin=M,topMargin=BAND+6*mm,bottomMargin=17*mm,title=f"{d['name']} — Press Kit — MC Joint",author='MC Joint',subject='Talent profile')
    doc.addPageTemplates([PageTemplate(id='p',frames=[Frame(M,17*mm,W-2*M,H-BAND-6*mm-17*mm,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=page)])
    el=[]; cw=W-2*M
    # hero
    txt=[Paragraph(esc(d['role']).upper(),S['role']),Paragraph(esc(d['name']),S['name'])]
    if d['tagline']: txt.append(Paragraph(esc(trim(d['tagline'][0],300)),S['tag']))
    pf=photo_file(d)
    if pf:
        img=RLImage(pf,width=LV['pw']*mm,height=LV['ph']*mm); t=Table([[img,txt]],colWidths=[(LV['pw']+5)*mm,cw-(LV['pw']+5)*mm])
    else:
        box=Table([[Paragraph(f'<font name="Mont-XB" size="30" color="white">{esc(initials(d["name"]))}</font>',ParagraphStyle('i',alignment=1,leading=34))]],colWidths=[LV['pw']*mm],rowHeights=[LV['ph']*mm]); box.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),BLACK),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
        t=Table([[box,txt]],colWidths=[(LV['pw']+5)*mm,cw-(LV['pw']+5)*mm])
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
    el+= [t,Spacer(1,3*mm)]
    # quick info
    if d['quick']:
        rows=[[Paragraph(esc(k).upper(),S['ql']),Paragraph(esc(v),S['qv'])] for k,v in d['quick'] if v]
        half=(len(rows)+1)//2; L=rows[:half]; R=rows[half:]
        data=[[L[i][0],L[i][1],(R[i][0] if i<len(R) else ''),(R[i][1] if i<len(R) else '')] for i in range(half)]
        q=Table(data,colWidths=[26*mm,cw/2-26*mm,26*mm,cw/2-26*mm]); q.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),LIGHT),('VALIGN',(0,0),(-1,-1),'TOP'),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),6)]))
        el+=[Paragraph('QUICK INFO',S['h']),q]
    # about (one or two paragraphs)
    paras=[p for p in d['about'] if 'info@mcjoint.in' not in p and 'reach out to us' not in p.lower()][:LV['paras']]
    if paras:
        el.append(Paragraph('ABOUT',S['h'])); el+= [Paragraph(esc(trim(p,LV['about'])),S['body']) for p in paras]
    # filmography
    films=d['films'][:LV.get('mf',MAX_FILMS)]
    if films:
        cells=[]
        for f in films:
            meta=' · '.join(x for x in (f['type'],f['year'],f['detail']) if x)
            cells.append([Paragraph(esc(f['title']),S['ft'])]+([Paragraph(esc(meta),S['fm'])] if meta else []))
        rows=[]; half=(len(cells)+1)//2
        for i in range(half):
            a=cells[i]; b=cells[i+half] if i+half<len(cells) else [Spacer(1,1)]
            rows.append([a,b])
        ft=Table(rows,colWidths=[cw/2,cw/2]); ft.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,-2),0.3,LINE)]))
        el+=[Paragraph('FILMOGRAPHY &amp; WORK',S['h']),ft]
    # links
    links=[(label_for(t,u),u) for t,u in d['links']]
    if links:
        el.append(Paragraph('FIND ONLINE',S['h']))
        for lab,u in links: el.append(Paragraph(f'<b>{esc(lab)}</b> &nbsp; <a href="{u}" color="#E10600">{esc(u)}</a>',S['link']))
    # contact (MC Joint's own details)
    C=CONTACT
    lines=[Paragraph(f'REPRESENTED BY {esc(C["brand"]).upper()}',S['ch'])]
    if SHOW_FOUNDER: lines.append(Paragraph(esc(C['founder']),S['cw']))
    lines+= [Paragraph(f'Email: <a href="mailto:{C["email"]}" color="white">{C["email"]}</a> &nbsp;·&nbsp; Phone: <a href="tel:{C["phone"].replace(" ","")}" color="white">{C["phone"]}</a> &nbsp;·&nbsp; <a href="{C["whatsapp"]}" color="white">WhatsApp</a>',S['cw']),
             Paragraph(f'{esc(C["location"])} &nbsp;·&nbsp; <a href="https://{C["site"]}" color="white">{C["site"]}</a>',S['cw']),
             Paragraph(f'Bookings, casting, collaborations and media: quote “{esc(d["name"])}” when you get in touch.',ParagraphStyle('cw2',parent=S['cw'],textColor=colors.HexColor('#BBBBBB'),fontSize=8.2))]
    cb=Table([[lines]],colWidths=[cw]); cb.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),BLACK),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBEFORE',(0,0),(0,-1),3,RED)]))
    el+= [Spacer(1,4*mm),KeepTogether([cb])]
    doc.build(el); return path,doc.page
if __name__=='__main__':
    slugs=sys.argv[1:] or T.all_slugs()
    import pymupdf
    def orphan(path):
        d=pymupdf.open(path); return len(d)>1 and len(d[-1].get_text().split())<60
    for s in slugs:
        for lvl in range(len(LEVELS)):
            p,_=build(s,lvl)
            if not orphan(p): break
        n=len(pymupdf.open(p)); print(f'{s:26} {os.path.getsize(p)//1024:4} KB  {n} page(s)  layout level {lvl}')
