"""Render a single evidence card containing independently viewable photographs."""
from html import escape as E

def collage_figure(m, prefix):
    panels = ''.join(f'<a class="collage-panel focus-{E(p.get("focus", ""))}" href="{E(p["src"])}" target="_blank" rel="noopener" aria-label="Open full image: {E(p["caption"])}"><img loading="lazy" decoding="async" src="{E(p.get("small",p["src"]))}" alt="{E(p["caption"])}" /></a>' for p in m['panels'])
    return f'<figure class="media-card {prefix}-figure collage-card"><div class="{prefix}-media-stage media-collage layout-{E(m.get("layout","pair"))}">{panels}</div><figcaption class="{prefix}-caption">{E(m["caption"])}</figcaption></figure>'
