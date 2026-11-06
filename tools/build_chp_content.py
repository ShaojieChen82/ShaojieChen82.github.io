"""Build the desktop CHP stories and shared mobile data from one content file."""
from pathlib import Path
import argparse
import html
import json
import re
from media_collage import collage_figure

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'assets/data/chp-projects.json').read_text())
E = html.escape


def figure(media, feature=False):
    if media['type'] == 'collage':
        return collage_figure(media, 'chp')
    caption = E(media['caption'])
    if media['type'] == 'video':
        stage = (f'<video controls muted playsinline preload="none" poster="{E(media["poster"])}" '
                 f'aria-label="{caption}"><source src="{E(media["src"])}" type="video/mp4"></video>')
        classes = 'chp-figure chp-video-figure'
    else:
        width = media.get('width', 1800)
        stage = (f'<img loading="lazy" decoding="async" src="{E(media["src"])}" '
                 f'srcset="{E(media["small"])} {media.get("smallWidth", 960)}w, {E(media["src"])} {width}w" '
                 f'sizes="(max-width: 1000px) 92vw, {"46vw" if feature else "24vw"}" alt="{caption}" />')
        stage = f'<a class="chp-image-link" href="{E(media["src"])}" target="_blank" rel="noopener" aria-label="Open full image: {caption}">{stage}</a>'
        classes = 'media-card chp-figure'
    return (f'<figure class="{classes}"><div class="chp-media-stage">{stage}</div>'
            f'<figcaption class="chp-caption">{caption}</figcaption></figure>')


def story_block(block):
    content = ('<ul>' + ''.join(f'<li>{E(item)}</li>' for item in block['items']) + '</ul>'
               if 'items' in block else f'<p>{E(block["text"])}</p>')
    result = ' chp-delivered' if block['label'] == 'What I delivered' else ''
    return f'<div class="chp-story-block{result}"><h3>{E(block["label"])}</h3>{content}</div>'


def case(project):
    flow = ''
    if project.get('flow'):
        flow = '<ol class="chp-control-flow" aria-label="E8kW supervisory-control path">' + ''.join(
            f'<li>{E(step)}</li>' for step in project['flow']) + '</ol>'
    support = project['support']
    support_html = ''
    if support:
        support_html = (f'<div class="chp-support-grid count-{len(support)}" '
                        f'aria-label="{E(project["shortTitle"])} supporting evidence">' +
                        ''.join(figure(item) for item in support) + '</div>')
    return f'''    <section class="section chp-study mode-section" data-mode-section="professional" id="{project['id']}" aria-labelledby="{project['id']}-title">
      <div class="chp-case-row">
        <div class="chp-story-copy">
          <p class="eyebrow">{E(project['eyebrow'])}</p>
          <h2 id="{project['id']}-title">{E(project['title'])}</h2>
          {''.join(story_block(block) for block in project['story'])}
        </div>
        <div class="chp-feature">{figure(project['feature'], True)}</div>
      </div>
      {flow}
      {support_html}
    </section>
'''


def overview():
    cards = []
    for project in DATA['projects']:
        media = project['feature']
        cards.append(f'''        <a class="project-card home-project-link visual-project-card" href="#{project['id']}">
          <div class="project-cover project-cover-contain"><img loading="lazy" src="{E(media['small'])}" alt="{E(media['caption'])}" /></div>
          <div class="project-card-copy"><div class="project-index">{E(project['eyebrow'])}</div><h3>{E(project['shortTitle'])}</h3><ul class="project-highlights">{''.join(f"<li>{E(item)}</li>" for item in project["highlights"])}</ul></div>
        </a>''')
    return '''    <section class="section home-showcase mode-section" data-mode-section="professional" id="professional-projects">
      <div class="section-heading split-heading"><div><p class="eyebrow">CHP / MicroGrid Engineering</p><h2>Professional Work</h2></div><a class="text-link" href="#e8kw">Explore selected case studies ↓</a></div>
      <div class="project-grid visual-project-grid professional-project-grid">
''' + '\n'.join(cards) + '''
      </div>
    </section>'''


def outputs():
    index = (ROOT / 'index.html').read_text()
    # First build replaces the legacy sections; subsequent builds replace the marked block.
    index = re.sub(r'[ \t]*<section class="section home-showcase mode-section" data-mode-section="professional" id="professional-projects">.*?</section>', overview(), index, count=1, flags=re.S)
    stories = '\n'.join(case(p) for p in DATA['projects'])
    stories = re.sub(r'(?m)^[ \t]+$', '', stories)
    stories += '''    <section class="chp-next-step mode-section" data-mode-section="professional" aria-label="Continue the conversation">
      <div><p class="eyebrow">Continue the conversation</p><h2>Connect this work to your engineering team.</h2></div>
      <div class="chp-next-actions"><a class="button primary" href="contact.html#resumes">View CHP / Microgrid resume</a><a class="button secondary" href="contact.html">Get in touch</a></div>
    </section>
'''
    block = '    <!-- CHP STORIES START: generated by tools/build_chp_content.py -->\n' + stories + '    <!-- CHP STORIES END -->\n'
    if '<!-- CHP STORIES START:' in index:
        index = re.sub(r'    <!-- CHP STORIES START:.*?    <!-- CHP STORIES END -->\n', block, index, count=1, flags=re.S)
    else:
        start = index.index('    <section class="section case-study mode-section" data-mode-section="professional" id="e8kw">')
        end = index.index('    <section class="section media-archive mode-section" data-mode-section="professional">', start)
        index = index[:start] + block + '\n' + index[end:]
    if 'assets/js/chp-content.js' not in index:
        index = index.replace('  <script defer src="assets/js/site.js', '  <link rel="stylesheet" href="assets/css/chp-stories.css?v=1" />\n  <script defer src="assets/js/chp-content.js?v=1"></script>\n  <script defer src="assets/js/site.js', 1)
    index = index.replace('assets/js/site.js?v=20', 'assets/js/site.js?v=21').replace('assets/js/portfolio-visual-v2.js?v=2', 'assets/js/portfolio-visual-v2.js?v=3').replace('assets/js/mobile-home-v1.js?v=4', 'assets/js/mobile-home-v1.js?v=5')
    index = index.replace('assets/js/portfolio-visual-v2.js?v=3', 'assets/js/portfolio-visual-v2.js?v=4').replace('assets/js/mobile-home-v1.js?v=5', 'assets/js/mobile-home-v1.js?v=6')
    shared = ('/* Generated from assets/data/chp-projects.json; edit the source and run tools/build_chp_content.py. */\n'
              'window.CHP_CONTENT = ' + json.dumps(DATA, ensure_ascii=False, indent=2) + ';\n'
              'window.CHP_MEDIA = Object.fromEntries([...window.CHP_CONTENT.projects.flatMap(p => [p.feature, ...p.support]), ...window.CHP_CONTENT.archiveExtra].flatMap(m => m.panels || [m]).flatMap(m => [[m.src, m], ...(m.small ? [[m.small, m]] : [])]));\n')
    return {'index.html': index, 'assets/js/chp-content.js': shared}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    for path, content in outputs().items():
        target = ROOT / path
        if args.check:
            if not target.exists() or target.read_text() != content:
                raise SystemExit(f'Generated content is stale: {path}')
        else:
            target.write_text(content)
    print('CHP desktop content and shared mobile data are current.' if args.check else 'Built CHP content.')
