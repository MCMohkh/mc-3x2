# MC — Talent Profile Templates
## Artist → Template Mapping Guide

---

### 5 Templates Available

| File | Primary Category | Use For |
|------|-----------------|---------|
| `template-writer-director.html` | Writer / Director / Creator | Filmmakers, screenwriters, content creators |
| `template-music-composer.html` | Music Composer | Composers, music producers, film score artists |
| `template-lyricist.html` | Lyricist / Song Writer | Song writers, lyricists, poets-turned-collaborators |
| `template-actor.html` | Actor / Actress | Film, OTT, theatre, short film performers |
| `template-singer-rapper.html` | Singer / Rapper | Independent singers, rappers, hip-hop artists |

---

### Artist Roster — Template Assignment

| Artist | Template to Use | Role Tags to Show |
|--------|----------------|-------------------|
| **Ajith Mohan** | `template-actor.html` | Actor · Director |
| **Camp Sasi** | `template-actor.html` | Writer · Director · Actor · Lyricist |
| **Faraz OG** | `template-singer-rapper.html` | Rapper · Lyricist |
| **INK Toxic** (Amit Bhadade) | `template-singer-rapper.html` | Rapper · Lyricist |
| **Kiyaan** (Armaan Mech) | `template-singer-rapper.html` | Rapper · Lyricist |
| **Jagadeesh Prathap Bandari** | `template-actor.html` | Actor · Singer |
| **Manoj Juloori** | `template-lyricist.html` | Song Writer |
| **Niklesh Sunkoji** | `template-lyricist.html` | Song Writer |
| **Nalgonda Gaddar Narsanna** | `template-singer-rapper.html` | Folk Singer |
| **Pawon Ramesh** | `template-actor.html` | Actor · Theatre Performer |
| **Prashanth Podagatlapalli** | `template-writer-director.html` | Director |
| **Raj Tirandasu** | `template-actor.html` | Actor |
| **Raju Shivaratri** | `template-actor.html` | Actor |
| **Ravi Nidamarthy** | `template-music-composer.html` | Music Composer |
| **Rohit Penumatsa** | `template-writer-director.html` | Writer · Director · Film Editor |
| **Sai Prasanna K** | `template-actor.html` | Actress |
| **Monica Busan** | `template-actor.html` | Actress |
| **Sai Yogi G** | `template-actor.html` | Actor · Lyricist · Writer |
| **Smaran** | `template-music-composer.html` | Music Composer · Singer |
| **Thanmai Bolt** | `template-actor.html` | Actress · Singer |
| **Satya** | `template-writer-director.html`* | Fashion Designer |
| **Bindu J** | `template-writer-director.html`* | Fashion Designer |

> *Fashion designers don't fit neatly into the 5 categories.
> Use the Writer/Director/Creator template and adjust: change role tags to "Fashion Designer",
> replace Filmography with "Collections & Works", remove film-specific sidebar fields.

---

### Multi-Role Artists — Notes

**Camp Sasi** (Writer · Director · Actor · Lyricist) — Most complex multi-role talent.
Recommended: Use `template-actor.html` as base (acting is most bookable).
In the `talent-roles` div, show all 4 role tags.
Add sections for both Filmography AND Writing Credits.

**Ajith Mohan** (Actor · Director) — Use `template-actor.html`.
Add a small "Directed" subsection beneath Filmography.

**Jagadeesh Prathap Bandari** (Actor · Singer) — Use `template-actor.html`.
Add a "Music" subsection listing any singing credits alongside Filmography.

**Sai Yogi G** (Actor · Lyricist · Writer) — Use `template-actor.html`.
Add a Writing Credits subsection.

**Thanmai Bolt** (Actress · Singer) — Use `template-actor.html`.
Add a Discography subsection.

**Rohit Penumatsa** (Writer · Director · Film Editor) — Use `template-writer-director.html`.
Add "Editor" as a third role tag. In Filmography, use "Writer · Director · Editor" as role badges.

---

### Suggested File Naming Convention

`clients/talent/[firstname-lastname].html`

Examples:
- `clients/talent/ajith-mohan.html`
- `clients/talent/faraz-og.html`
- `clients/talent/ink-toxic.html`
- `clients/talent/jagadeesh-prathap-bandari.html`
- `clients/talent/nalgonda-gaddar-narsanna.html`

---

### What Each Template Standardises

**All templates share:**
- Hero layout (dark background, 2-col on desktop, photo right panel)
- Multi-role tag system (`talent-role-tag` badges)
- Keyword cloud (craft/genre descriptors)
- Artist initials fallback when photo is missing
- Bio structure (4 paragraphs: origin → craft → credits → MC context)
- Quick Info sidebar card
- "Our Association" block (black, left red border)
- CTA buttons (Enquire + View All Talent)
- Header, footer, mobile menu — identical across all

**Per-category differentiation:**

| Template | Primary Content Block | Badge Label | Sidebar Unique Field |
|----------|----------------------|-------------|---------------------|
| Writer/Director | Filmography & Projects | Role per project (Writer / Director / Creator) | Medium, Genre Focus |
| Music Composer | Discography & Projects | Release status (Distributed / Released / Upcoming) | Label/Studio, Genre |
| Lyricist | Songs & Writing Credits | Genre per song (Romantic / Folk / Hip-Hop) | Language(s), Song Count, Collaborated With |
| Actor | Filmography | Medium (Film / Web Series / Theatre) + Role (Lead / Supporting) | Medium, Genre, Training (optional) |
| Singer/Rapper | Releases & Projects | Type (EP / Single / Collab / Freestyle) | Crew/Collective (optional), Real Name (optional) |
