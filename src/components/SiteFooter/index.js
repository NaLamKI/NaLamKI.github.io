import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

import './SiteFooter.css';

export default function SiteFooter() {
  const docsLink = useBaseUrl('/docs/welcome');
  const apiRefLink = useBaseUrl('/docs/api-reference/overview');
  const architectureLink = useBaseUrl('/docs/concepts/architecture-overview');
  const examplesLink = useBaseUrl('/docs/examples/overview');
  const logoWhiteSrc = useBaseUrl('/img/agrifooddata/wortmarke-subline-white.png');

  return (
    <footer className="sitefoot afd-sitefoot">
      <div className="inner">
        <div className="brand">
          <img src={logoWhiteSrc} alt="AgriFoodData" />
          <p>
            An open data infrastructure for digital agriculture. Operated by Fraunhofer HHI ·
            Bonn Systems, with GIZ as implementation partner in Telangana.
          </p>
        </div>
        <div>
          <h6>Documentation</h6>
          <ul>
            <li><Link to={docsLink}>Getting started</Link></li>
            <li><Link to={architectureLink}>Reference architecture</Link></li>
            <li><Link to={apiRefLink}>API reference</Link></li>
            <li><Link to={examplesLink}>Use cases</Link></li>
          </ul>
        </div>
        <div>
          <h6>Community</h6>
          <ul>
            <li><a href="https://github.com/NaLamKI">GitHub</a></li>
            <li><Link to={useBaseUrl('/docs/ecosystem/contribute')}>How to contribute</Link></li>
            <li><Link to={useBaseUrl('/docs/ecosystem/submit-service')}>Submit a service</Link></li>
          </ul>
        </div>
      </div>
      <div className="bottom">
        <span>© {new Date().getFullYear()} AgriFoodData · Open Interoperability Initiative</span>
        <div className="mid">
          <Link to={useBaseUrl('/imprint')}>Imprint</Link>
        </div>
        <span>Built with Docusaurus</span>
      </div>
    </footer>
  );
}
