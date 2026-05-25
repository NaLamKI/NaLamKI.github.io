import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

import './Home.css';

const ChevronRight = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function Home() {
  const docsLink = useBaseUrl('/docs/welcome');
  const architectureLink = useBaseUrl('/docs/concepts/architecture-overview');
  const examplesLink = useBaseUrl('/docs/examples/overview');

  return (
    <Layout
      title="AgriFoodData · Open Interoperability Initiative"
      description="An open data infrastructure for digital agriculture. Reference implementation of the ITU/FAO architecture."
    >
      <div className="afdHome">
        {/* ============ Hero ============ */}
        <section className="hero">
          <div className="hero-circles">
            <div className="c c1" />
            <div className="c c2" />
            <div className="c c3" />
          </div>
          <div className="hero-veil" />
          <div className="frame">
            <div>
              <div className="kicker">
                <span className="sep" />
                Open Interoperability Initiative
              </div>
              <h1>
                An open data infrastructure for <em>digital agriculture</em>.
              </h1>
              <p className="lead">
                Digital agriculture is not failing because of AI — it is failing because of data
                infrastructure. AgriFoodData is the reference implementation of the ITU/FAO
                architecture: an open, multi-party platform that lets farmers, services, machinery
                and administrations interoperate without displacing existing systems.
              </p>
              <div className="cta-row">
                <Link to={docsLink} className="btn primary">
                  Read the documentation
                  <ChevronRight />
                </Link>
                <Link to={architectureLink} className="btn ghost">
                  Explore the architecture
                  <ChevronRight />
                </Link>
              </div>
            </div>
            <div className="hero-meta">
              <div className="blk">
                <div className="lbl">Operated by</div>
                <strong>Fraunhofer HHI · Bonn Systems</strong>
              </div>
              <div className="blk">
                <div className="lbl">Implementation partner</div>
                <strong>GIZ — Telangana, India</strong>
                <br />
                ACRAT · funded by BMLEH
              </div>
              <div className="blk">
                <div className="lbl">Architecture authority</div>
                <strong>ITU Study Group 20</strong>
                <br />
                Adopted · July 2024
              </div>
            </div>
          </div>

          {/* Hero strip */}
          <div className="hero-strip">
            <div className="row">
              <div>
                <div className="num">6</div>
                <div className="lbl">Consented building blocks</div>
              </div>
              <div>
                <div className="num">4</div>
                <div className="lbl">OpenAPI interfaces</div>
              </div>
              <div>
                <div className="num">43,000</div>
                <div className="lbl">Soil samples · GeoAI corpus</div>
              </div>
              <div>
                <div className="num">2 → N</div>
                <div className="lbl">Productive deployments · scaling</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Why we built this ============ */}
        <section className="section">
          <div className="section-head">
            <div className="lhs">
              <div className="num">PART I</div>
              <div className="label">The vision</div>
            </div>
            <div className="rhs">
              <h2>
                Why the world needs an <em>open agricultural data infrastructure</em>.
              </h2>
              <p className="deck">
                Three structural problems keep digital agriculture from scaling. They are not
                problems of model quality or compute — they are problems of data infrastructure.
                The AgriFoodData platform answers all three at the same time.
              </p>
            </div>
          </div>

          <div className="threecol">
            <div className="col">
              <div className="ord">
                01 <small>Problem</small>
              </div>
              <h3>A fragmented system landscape</h3>
              <p>
                Farmers work with many vendors, devices and apps — which typically do not talk to
                each other. Data is captured redundantly, transferred manually, and kept in
                proprietary silos. The result is a landscape where no party sees the full picture.
              </p>
            </div>
            <div className="col">
              <div className="ord">
                02 <small>Problem</small>
              </div>
              <h3>Unresolved data sovereignty</h3>
              <p>
                Farmers fear losing control over operational data. Without technically enforceable,
                fine-grained access control, mistrust remains the principal adoption barrier —
                regardless of how compelling the proposed service is.
              </p>
            </div>
            <div className="col">
              <div className="ord">
                03 <small>Problem</small>
              </div>
              <h3>A chicken-and-egg dilemma</h3>
              <p>
                Value grows with available services — but vendors only invest once the user base is
                large enough. This network-effect hurdle prevents scaling in closed ecosystems and
                keeps digital agriculture permanently below critical mass.
              </p>
            </div>
          </div>
        </section>

        {/* ============ Pull quote ============ */}
        <section className="pullquote">
          <div className="inner">
            <div />
            <div>
              <blockquote>
                Digital agriculture is not failing because of AI — it is failing because of{' '}
                <em>data infrastructure</em>. For the first time there is a globally agreed
                reference architecture, from the ITU and the FAO.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ============ The architecture ============ */}
        <section className="full">
          <div className="section">
            <div className="section-head">
              <div className="lhs">
                <div className="num">PART II</div>
                <div className="label">The architecture</div>
              </div>
              <div className="rhs">
                <h2>
                  An <em>integration layer</em>, not a replacement.
                </h2>
                <p className="deck">
                  The architecture explicitly promotes interoperability without displacing existing
                  systems. It functions as an integration layer — which is the structural answer
                  to the chicken-and-egg dilemma every closed agricultural platform runs into.
                </p>
              </div>
            </div>

            <div className="archmap">
              <div className="copy">
                <h3>Six consented building blocks. Four OpenAPI interfaces. One canonical object.</h3>
                <p>
                  The ITU/FAO reference architecture specifies six conceptual blocks. Each block
                  can be implemented by different vendors as long as the contracts at the
                  integration boundaries are honoured. AgriFoodData provides a reference
                  implementation of all six.
                </p>
                <ul>
                  <li>
                    <Link to={useBaseUrl('/docs/ecosystem/the-ecosystem')}>
                      <span className="n">01 · ROLES</span>
                      <span>
                        <strong>Actor roles</strong> — farmers, services, sensors, machinery,
                        certification, developers.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={architectureLink}>
                      <span className="n">02 · SYSTEM</span>
                      <span>
                        <strong>Core components</strong> — digital farm twin, registry, IAM, app
                        store, dashboard.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={useBaseUrl('/docs/concepts/data-model')}>
                      <span className="n">03 · DATA</span>
                      <span>
                        <strong>Data models</strong> — JSON-LD and Web of Things vocabularies.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={useBaseUrl('/docs/concepts/apis/overview')}>
                      <span className="n">04 · API</span>
                      <span>
                        <strong>Interfaces</strong> — data, service, scheduling, clearing house
                        connectors.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={useBaseUrl('/docs/concepts/service-registry')}>
                      <span className="n">05 · SERVICES</span>
                      <span>
                        <strong>Service registry</strong> — REST API and SDK-based deployment.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={useBaseUrl('/docs/concepts/data-sovereignty')}>
                      <span className="n">06 · SPACES</span>
                      <span>
                        <strong>Data spaces</strong> — Gaia-X and IDSA — controlled exchange, no
                        islands.
                      </span>
                      <span className="arrow">→</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="archfig">
                <div className="cap">
                  <span>Figure 01 · Integration layer</span>
                  <span>v1.4 · ITU/FAO</span>
                </div>

                <div className="row three">
                  <div className="box">
                    <span className="lbl">Edge</span>Sensors &amp; IoT
                  </div>
                  <div className="box">
                    <span className="lbl">Machinery</span>FMIS &amp; tractors
                  </div>
                  <div className="box">
                    <span className="lbl">Services</span>GeoAI providers
                  </div>
                </div>
                <div className="conn">│  │  │</div>
                <div className="row three">
                  <div className="box mint">
                    <span className="lbl">API</span>Data connector
                  </div>
                  <div className="box mint">
                    <span className="lbl">API</span>Service connector
                  </div>
                  <div className="box mint">
                    <span className="lbl">API</span>Scheduling
                  </div>
                </div>
                <div className="conn">▼ ▼ ▼</div>
                <div className="row one">
                  <div className="box accent">
                    <span className="lbl">Canonical object</span>Digital farm twin · JSON-LD / WoT
                  </div>
                </div>
                <div className="conn">▲ ▲ ▲</div>
                <div className="row three">
                  <div className="box">
                    <span className="lbl">Identity</span>IAM &amp; consent
                  </div>
                  <div className="box">
                    <span className="lbl">Market</span>App / service store
                  </div>
                  <div className="box">
                    <span className="lbl">Sovereignty</span>Clearing house
                  </div>
                </div>
                <div className="conn">│</div>
                <div className="row one">
                  <div className="box">
                    <span className="lbl">Data spaces</span>Gaia-X · IDSA · external catalogues
                  </div>
                </div>

                <div className="footer-cap">
                  The blueprint <strong>does not replace</strong> existing FMIS, sensor stacks or
                  AI services — it gives them a common contract.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Building blocks (6) ============ */}
        <section className="section">
          <div className="section-head">
            <div className="lhs">
              <div className="num">PART III</div>
              <div className="label">The building blocks</div>
            </div>
            <div className="rhs">
              <h2>Six blocks. Implementable by anyone. Operated as one platform.</h2>
              <p className="deck">
                Each block is a clear contract. Vendors can implement any block independently — the
                only commitment is to the integration boundaries the reference architecture
                defines.
              </p>
            </div>
          </div>

          <div className="blocks">
            <Link to={useBaseUrl('/docs/ecosystem/the-ecosystem')} className="block">
              <div className="ord">
                01 · ROLES <span className="stage">CONSENTED</span>
              </div>
              <h4>Actor roles</h4>
              <p>
                Farmers, service providers, sensor and machinery vendors, certification bodies and
                developers — defined as platform-neutral roles.
              </p>
              <span className="read">Read reference →</span>
            </Link>
            <Link to={architectureLink} className="block">
              <div className="ord">
                02 · SYSTEM <span className="stage">CONSENTED</span>
              </div>
              <h4>Core components</h4>
              <p>
                Digital farm twin, farm registry, app and service store, IAM, dashboard and
                decision support.
              </p>
              <span className="read">Read reference →</span>
            </Link>
            <Link to={useBaseUrl('/docs/concepts/data-model')} className="block">
              <div className="ord">
                03 · DATA <span className="stage">CONSENTED</span>
              </div>
              <h4>Data models</h4>
              <p>
                Farm registry, fields, ROIs, agronomic information, operations and outcomes — on
                JSON-LD and Web of Things.
              </p>
              <span className="read">Read reference →</span>
            </Link>
            <Link to={useBaseUrl('/docs/concepts/apis/overview')} className="block">
              <div className="ord">
                04 · API <span className="stage">CONSENTED</span>
              </div>
              <h4>Interfaces</h4>
              <p>
                Data, service, scheduling and clearing-house connectors — for data apps and FMIS
                integration.
              </p>
              <span className="read">Read reference →</span>
            </Link>
            <Link to={useBaseUrl('/docs/concepts/service-registry')} className="block">
              <div className="ord">
                05 · SERVICES <span className="stage">CONSENTED</span>
              </div>
              <h4>Service registry</h4>
              <p>
                Standardised REST API and SDK-based deployment for AI services — integrate once,
                available platform-wide.
              </p>
              <span className="read">Read reference →</span>
            </Link>
            <Link to={useBaseUrl('/docs/concepts/data-sovereignty')} className="block">
              <div className="ord">
                06 · SPACES <span className="stage">DRAFT</span>
              </div>
              <h4>Gaia-X &amp; IDSA</h4>
              <p>
                Controlled data exchange via existing data-space standards and catalogues — no new
                island solutions.
              </p>
              <span className="read">Read reference →</span>
            </Link>
          </div>
        </section>

        {/* ============ Production showcase ============ */}
        <section className="showcase">
          <div className="wrap">
            <div className="head">
              <div className="lhs">
                <div className="num" style={{color: 'var(--afd-lime)'}}>
                  PART IV
                </div>
                <div className="label">In production</div>
              </div>
              <div>
                <h2>
                  From state to farm — <em>satellite-based soil monitoring</em> for all of
                  Telangana.
                </h2>
                <p className="deck">
                  A unified technical foundation for government, MAOs and individual farmers.
                  ITU/FAO-conformant open-source code, identical models, same data — three
                  audiences, one digital farm twin.
                </p>
              </div>
            </div>

            <Link to={useBaseUrl('/docs/examples/geoai-telangana')} className="figure">
              <div className="bar">
                <div className="dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="url">geoai.example.com/districts</span>
                <span className="pill">LIVE</span>
              </div>
              <img
                src={useBaseUrl('/img/agrifooddata/showcase-telangana.png')}
                alt="Soil-monitoring dashboard for Siddipet, Telangana — iron (Fe) layer over Sentinel-2 imagery"
              />
            </Link>

            <div className="legend">
              <div className="it">
                <div className="n">01 · STATE</div>
                <strong>District NDVI overview</strong>
                <p>
                  Aggregate vegetation index across districts. Used by the state government and
                  PJTSAU for programme oversight and policy targeting.
                </p>
              </div>
              <div className="it">
                <div className="n">02 · MANDAL</div>
                <strong>Parameter detail</strong>
                <p>
                  Ten soil and crop parameters per mandal. Used by Mandal Agricultural Officers
                  (MAOs) for advisory and intervention planning.
                </p>
              </div>
              <div className="it">
                <div className="n">03 · FIELD</div>
                <strong>Individual field detail</strong>
                <p>
                  Time-series at the field level. Used directly by farmers through their existing
                  FMIS or the platform's farmer-facing front-end.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Doc hub ============ */}
        <section className="section">
          <div className="section-head">
            <div className="lhs">
              <div className="num">PART V</div>
              <div className="label">Start reading</div>
            </div>
            <div className="rhs">
              <h2>Four pathways into the documentation.</h2>
              <p className="deck">
                The docs are organised by reader. Pick a pathway — each one is a curated, narrative
                route through the material rather than a flat index of pages.
              </p>
            </div>
          </div>

          <div className="dochub">
            <Link to={useBaseUrl('/docs/build/ai-services/overview')} className="card">
              <div className="ord">FOR · ENGINEERS</div>
              <h4>Build an integration</h4>
              <p>
                OpenAPI specs, the digital-farm-twin data model, the SDK, and a 20-minute
                quickstart.
              </p>
              <span className="arrow">Open the API reference →</span>
            </Link>
            <Link to={useBaseUrl('/docs/operate/overview')} className="card">
              <div className="ord">FOR · OPERATORS</div>
              <h4>Run the platform</h4>
              <p>
                Deployment, IAM, consent management, audit log, and operational runbooks for a
                regional instance.
              </p>
              <span className="arrow">Operator handbook →</span>
            </Link>
            <Link to={useBaseUrl('/docs/concepts/standards-interoperability')} className="card">
              <div className="ord">FOR · POLICY</div>
              <h4>Regulatory alignment</h4>
              <p>
                Coverage of EU Data Act, FaIR Data Act, GAIA-X, IDSA and the FAO digital
                agriculture programme.
              </p>
              <span className="arrow">Read the alignment matrix →</span>
            </Link>
            <Link to={examplesLink} className="card">
              <div className="ord">FOR · RESEARCH</div>
              <h4>Cases &amp; results</h4>
              <p>
                AgriFoodData reference workflows, the Telangana case, R² results from the GeoAI
                soil-monitoring service.
              </p>
              <span className="arrow">Open case studies →</span>
            </Link>
          </div>

        </section>

        {/* ============ CTA strip ============ */}
        <section className="cta">
          <div className="wrap">
            <div>
              <div className="label">Part VI · Get involved</div>
              <h2>
                The platform is in place. Now it is about <em>breadth</em>.
              </h2>
            </div>
            <div className="right">
              <p>
                We are looking for partners that help expand the ecosystem — additional use cases,
                projects, apps and regions where an open data infrastructure creates real value.
              </p>
              <div style={{display: 'flex', gap: '14px'}}>
                <a href="mailto:info@agrifooddata.org" className="btn primary">
                  Get in touch
                  <ChevronRight />
                </a>
                <Link
                  to={useBaseUrl('/docs/ecosystem/submit-service')}
                  className="btn ghost"
                >
                  Become a partner
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
