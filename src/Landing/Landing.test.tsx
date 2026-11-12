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

  it('links to the contact channels', () => {
    expect(html).toContain('href="https://benliu.dev"');
    expect(html).toContain('href="mailto:contact@weddi.app"');
  });
});
