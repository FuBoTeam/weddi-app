/* eslint-env jest */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Landing } from './Landing';

describe('Landing', () => {
  const html = renderToStaticMarkup(<Landing />);

  it('has a single primary CTA pointing to the demo event dashboard', () => {
    expect(html.match(/class="landing__cta"/g)).toHaveLength(1);
    expect(html).toContain('href="/test/?v=dashboard"');
    expect(html).toContain('>See a demo</a>');
  });

  it('lists features without exposing route paths', () => {
    expect(html).toContain('>Features</h2>');
    expect(html).toContain('A live greeting wall');
    expect(html).toContain('Screen greetings before they go live');
    expect(html).toContain('approve them before they appear on the live wall');
    expect(html).toContain('only approved greetings enter');
    expect(html).toContain('An in-ceremony lottery game');
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
});
