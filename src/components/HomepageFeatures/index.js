import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'The Project',
    Svg: require('@site/static/img/ic_solar_notes.svg').default,
    description: (
      <>
        NaLamKI is a research project running until the end of 2024 from where it will expands into new areas with its work set to continue beyond 2024. It develops AI services for agriculture, analyzing data from agricultural machinery, satellites, and drones, integrating them into a platform, and providing results through a dashboard and open interfaces.
      </>
    ),
  },
  {
    title: 'Our Goal',
    Svg: require('@site/static/img/ic_analytics.svg').default,
    description: (
      <>
        The NaLamKI project aims to improve agricultural processes through the use of cloud and AI technologies. To achieve this, a Gaia-X-compliant Software-as-a-Service platform is being developed collecting agricultural data. AI applications provided on the platform support farmers in analyzing the condition of plants and soil across large areas, aiding processes such as irrigation, fertilization, and pest control.
      </>
    ),
  },
  {
    title: 'Your Use',
    Svg: require('@site/static/img/ic_tour.svg').default,
    description: (
      <>
        NaLamKI will simplify and speed up crop monitoring on large agricultural areas. Remote data collection via drones or satellites, combined with AI-driven weather and crop development models, provides valuable insights into soil conditions. Farmers can detect issues with irrigation, fertilization, or pest infestations early, enabling faster responses. This targeted approach reduces the use of pesticides and fertilizers, leading to cost savings, lower environmental impact, and improved climate resilience.
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
