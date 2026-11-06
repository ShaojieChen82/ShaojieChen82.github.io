"""Render a single evidence card containing independently viewable photographs."""
from html import escape as E

def presentation_attributes(media):
    return ''.join(f' data-{key}="{E(media[key])}"' for key in ('rotate', 'fit') if media.get(key))

def collage_figure(m, prefix):
    if m.get('technical'):
        panels = ''.join(
            f'<a class="collage-panel" href="{E(p["src"])}" target="_blank" rel="noopener" data-technical-index="{i}" aria-label="Open full image: {E(p["caption"])}">'
            f'<img loading="lazy" decoding="async" src="{E(p.get("small", p["src"]))}" alt="{E(p["caption"])}"{presentation_attributes(p)} />'
            f'<span class="technical-panel-label">{E(p["label"])}</span></a>'
            for i, p in enumerate(m['panels']))
        return (f'<figure class="media-card {prefix}-figure collage-card technical-card" data-technical-group="{E(m["id"])}">'
                f'<div class="{prefix}-media-stage media-collage layout-{E(m["layout"])}">{panels}</div>'
                f'<figcaption class="{prefix}-caption technical-caption"><div><h4>{E(m["title"])}</h4><p>{E(m["caption"])}</p></div>'
                f'<button type="button" class="technical-view-group" data-technical-index="0" aria-label="View all images: {E(m["title"])}">{len(m["panels"])} views '
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg></button></figcaption></figure>')
    panels = ''.join(f'<a class="collage-panel focus-{E(p.get("focus", ""))}" href="{E(p["src"])}" target="_blank" rel="noopener" aria-label="Open full image: {E(p["caption"])}"><img loading="lazy" decoding="async" src="{E(p.get("small",p["src"]))}" alt="{E(p["caption"])}" /></a>' for p in m['panels'])
    return f'<figure class="media-card {prefix}-figure collage-card"><div class="{prefix}-media-stage media-collage layout-{E(m.get("layout","pair"))}">{panels}</div><figcaption class="{prefix}-caption">{E(m["caption"])}</figcaption></figure>'
