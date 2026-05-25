import React, {useState, useEffect} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useLocation} from '@docusaurus/router';

import './SiteNavbar.css';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.3 11.3 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

const HamburgerIcon = ({open}) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {open ? (
      <>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </>
    ) : (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </>
    )}
  </svg>
);

const NAV_LINKS = [
  {
    label: 'Documentation',
    to: '/docs/welcome',
    match: /^\/docs\/(welcome|why|quickstart|build|operate|faq)/,
  },
  {
    label: 'API Reference',
    to: '/docs/api-reference/overview',
    match: /^\/docs\/api-reference/,
  },
  {
    label: 'Architecture',
    to: '/docs/concepts/architecture-overview',
    match: /^\/docs\/concepts/,
  },
  {
    label: 'Use Cases',
    to: '/docs/examples/overview',
    match: /^\/docs\/examples/,
  },
  {
    label: 'Community',
    to: '/docs/ecosystem/overview',
    match: /^\/docs\/ecosystem/,
  },
];

function NavLink({item, mobile, onClick}) {
  const {pathname} = useLocation();
  const active = item.match.test(pathname);
  const cls = mobile
    ? `afd-navbar-mobile-link ${active ? 'afd-navbar-mobile-link--active' : ''}`
    : `afd-navbar-link ${active ? 'afd-navbar-link--active' : ''}`;
  return (
    <Link to={item.to} className={cls} onClick={onClick}>
      {item.label}
    </Link>
  );
}

export default function SiteNavbar() {
  const logoSrc = useBaseUrl('/img/agrifooddata/wortmarke-subline-black.png');
  const logoDarkSrc = useBaseUrl('/img/agrifooddata/wortmarke-subline-white.png');
  const homeHref = useBaseUrl('/');
  const {pathname} = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the user navigates.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* `navbar` is kept so Docusaurus' useTOCHighlight can find the element. */}
      <nav className="navbar afd-navbar">
        <div className="afd-navbar-inner">
          <Link to={homeHref} className="afd-navbar-brand" aria-label="AgriFoodData home" onClick={close}>
            <img src={logoSrc} alt="AgriFoodData" className="afd-navbar-logo afd-navbar-logo--light" />
            <img src={logoDarkSrc} alt="" className="afd-navbar-logo afd-navbar-logo--dark" />
            <span className="afd-navbar-brand-divider" aria-hidden="true" />
            <span className="afd-navbar-brand-tag">Ecosystem</span>
          </Link>

          <div className="afd-navbar-links">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} item={item} />
            ))}
          </div>

          <div className="afd-navbar-right">
            <a
              href="https://github.com/NaLamKI"
              className="afd-navbar-github"
              title="GitHub"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </a>

            <button
              type="button"
              className="afd-navbar-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="afd-navbar-mobile"
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — rendered as a sibling of <nav> so its position:fixed
          is viewport-relative (the nav's backdrop-filter would otherwise
          create a containing block and clip the drawer to the navbar's box). */}
      <div
        id="afd-navbar-mobile"
        className={`afd-navbar-mobile ${menuOpen ? 'afd-navbar-mobile--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="afd-navbar-mobile-links">
          {NAV_LINKS.map((item) => (
            <NavLink key={item.to} item={item} mobile onClick={close} />
          ))}
          <a
            href="https://github.com/NaLamKI"
            className="afd-navbar-mobile-link"
            onClick={close}
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
