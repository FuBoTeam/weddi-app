/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react-dom/test-utils';
import { readFileSync } from 'fs';
import path from 'path';
import { Landing } from './Landing';

const readPublic = (file) => readFileSync(path.join(__dirname, '../../public', file), 'utf8');
const staticPage = document.createElement('html');
staticPage.innerHTML = readPublic('index.html');
const schema = JSON.parse(staticPage.querySelector('script[type="application/ld+json"]').textContent);
const normalize = (node) => node.textContent.replace(/\s+/g, ' ').trim();

describe('Landing', () => {
  const html = renderToStaticMarkup(<Landing />);
  const renderedPage = document.createElement('div');
  renderedPage.innerHTML = html;

  it('has a single primary CTA pointing to the demo event dashboard', () => {
    expect(html.match(/class="landing__cta"/g)).toHaveLength(1);
    expect(html).toContain('href="/test/?v=dashboard"');
    expect(html).toContain('>See a demo</a>');
  });

  it('lists features without exposing route paths', () => {
    expect(html).toContain('>Features</h2>');
    expect(html).toContain('A live greeting wall');
    expect(html).toContain('A wedding lottery drawn from the greetings');
    expect(html).not.toMatch(/&lt;event&gt;|\/greetings|\/lottery/);
  });

  it('renders lazy app screenshots with explicit dimensions', () => {
    const imgs = html.match(/<img [^>]*>/g);
    expect(imgs).toHaveLength(3);
    imgs.forEach((img) => {
      expect(img).toMatch(/ width="\d+"/);
      expect(img).toMatch(/ height="\d+"/);
      expect(img).toContain('loading="lazy"');
      expect(img).toMatch(/ alt="[^"]+"/);
    });
  });

  it('links to the contact channels', () => {
    expect(html).toContain('href="https://benliu.dev"');
    expect(html).toContain('href="mailto:contact@weddi.app"');
  });

  it('keeps the static H1, lead, steps, features, FAQ and demo note in sync', () => {
    ['h1', '.landing__lead', '.landing__steps h2, .landing__steps h3, .landing__steps p', '.landing__features h2, .landing__features h3, .landing__features p', '.landing__faq h2, .landing__faq h3, .landing__faq p', '.landing__note'].forEach((selector) => {
      expect(Array.from(staticPage.querySelectorAll(selector)).map(normalize))
        .toEqual(Array.from(renderedPage.querySelectorAll(selector)).map(normalize));
    });
    expect(renderedPage.querySelectorAll('h1')).toHaveLength(1);
    expect(renderedPage.querySelectorAll('.landing__step-list li')).toHaveLength(3);
    expect(renderedPage.querySelectorAll('.landing__card')).toHaveLength(6);
    expect(renderedPage.querySelector('h1').textContent.trim()).toBe('A live wedding greeting wall your guests post to from their phones');
  });

  it('renders eight visible FAQs identical to the structured answers', () => {
    const questions = schema['@graph'].find((entry) => entry['@type'] === 'FAQPage').mainEntity;
    const items = Array.from(renderedPage.querySelectorAll('.landing__faq-item'));
    expect(items).toHaveLength(8);
    expect(Array.from(staticPage.querySelectorAll('.landing__faq-item p')).map((item) => item.textContent))
      .toEqual(questions.map((item) => item.acceptedAnswer.text));
    expect(items.map((item) => ({
      question: item.querySelector('h3').textContent,
      answer: item.querySelector('p').textContent,
    }))).toEqual(questions.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text })));
    expect(items[7].textContent).toContain('Contact us first at contact@weddi.app; the price is not decided yet.');
  });

  it('replaces the static root and keeps the runtime title identical to the static title', () => {
    const container = document.createElement('div');
    container.innerHTML = staticPage.querySelector('#root').innerHTML;
    document.body.appendChild(container);
    const previousTitle = document.title;
    try {
      act(() => { ReactDOM.render(<Landing />, container); });
      expect(container.querySelector('.static-landing')).toBeNull();
      expect(document.title).toBe(staticPage.querySelector('title').textContent);
    } finally {
      ReactDOM.unmountComponentAtNode(container);
      container.remove();
      document.title = previousTitle;
    }
  });
});

describe('Static SEO assets', () => {
  it('provides one graph with factual organization, site, app and FAQ entities', () => {
    expect(staticPage.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1);
    expect(schema['@graph'].map((entry) => entry['@type'])).toEqual(['Organization', 'WebSite', 'WebApplication', 'FAQPage']);
    const app = schema['@graph'].find((entry) => entry['@type'] === 'WebApplication');
    expect(app.featureList).toEqual(Array.from(staticPage.querySelectorAll('.landing__card h3')).map(normalize));
    expect(app).not.toHaveProperty('offers');
    expect(app).not.toHaveProperty('aggregateRating');
    expect(staticPage.querySelector('link[rel="canonical"]').getAttribute('href')).toBe('https://weddi.app/');
    expect(staticPage.querySelector('link[hreflang]')).toBeNull();
  });

  it('keeps Twitter and Open Graph preview fields identical', () => {
    ['title', 'description', 'image', 'image:alt'].forEach((field) => {
      expect(staticPage.querySelector(`meta[name="twitter:${field}"]`).content)
        .toBe(staticPage.querySelector(`meta[property="og:${field}"]`).content);
    });
    expect(staticPage.querySelector('meta[name="twitter:card"]').content).toBe('summary_large_image');
  });

  it('lists only the home page in the sitemap and allows crawlers', () => {
    expect(readPublic('robots.txt')).toBe('User-agent: *\nAllow: /\nSitemap: https://weddi.app/sitemap.xml\n');
    const sitemap = new DOMParser().parseFromString(readPublic('sitemap.xml'), 'application/xml');
    expect(sitemap.querySelector('parsererror')).toBeNull();
    expect(Array.from(sitemap.querySelectorAll('loc')).map((node) => node.textContent)).toEqual(['https://weddi.app/']);
    expect(sitemap.querySelector('lastmod').textContent).toBe('2026-11-12');
  });

  it('uses Weddi branding and preserves the favicon in the manifest', () => {
    const manifest = JSON.parse(readPublic('manifest.json'));
    expect(manifest.short_name).toBe('Weddi');
    expect(manifest.name).toBe('Weddi – live wedding greeting wall');
    expect(manifest.start_url).toBe('/');
    expect(manifest.icons[0].src).toBe('favicon.ico');
  });
});
