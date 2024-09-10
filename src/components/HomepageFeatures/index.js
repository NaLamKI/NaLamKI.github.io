import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Projekt',
    Svg: require('@site/static/img/ic_solar_notes.svg').default,
    description: (
      <>
        NaLamKI ist ein Forschungsprojekt bis Ende 2024, das KI-Dienste für die Landwirtschaft entwickelt. Es wertet Daten von Landmaschinen, Satelliten und Drohnen aus, integriert sie in einer Plattform und stellt Ergebnisse über ein Dashboard oder offene Schnittstellen bereit.
      </>
    ),
  },
  {
    title: 'Mission',
    Svg: require('@site/static/img/ic_analytics.svg').default,
    description: (
      <>
        NaLamKI stellt Landwirten maschinenunabhängige Dienste bereit, die Arbeitsabläufe erleichtern, Feldzustände analysieren, Erträge verbessern und Ressourcen einsparen.
      </>
    ),
  },
  {
    title: 'Ziel',
    Svg: require('@site/static/img/ic_tour.svg').default,
    description: (
      <>
        Während der Forschungsphase können Landwirte sich kostenlos registrieren, um die Dienste auf ihren Feldern zu testen. Dienstanbieter können über ein Formular die Integration ihrer Services in die NaLamKI-Plattform beantragen.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
