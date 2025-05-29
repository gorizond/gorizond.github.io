import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to launch',
    Svg: require('@site/static/img/landing_easy_to_lanch.svg').default,
    description: (
      <>
        One CLI command and your cluster is ready. Gorizond handles the hard stuff.
      </>
    ),
  },
  {
    title: 'VPN by default',
    Svg: require('@site/static/img/landing_vpn_by_default.svg').default,
    description: (
      <>
        Built-in Headscale forms a NAT-less mesh network.
      </>
    ),
  },
  {
    title: 'IoT ready',
    Svg: require('@site/static/img/landing_iot_ready.svg').default,
    description: (
      <>
        Low resource usage and high resiliency — great for the edge.
      </>
    ),
  },
  {
    title: 'Coming soon: P2P Wi‑Fi',
    Svg: require('@site/static/img/landing_p2p_wi_fi.svg').default,
    description: (
      <>
        batman-adv mesh over Wi‑Fi for true peer-to-peer networking.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
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

export default function HomepageFeatures(): ReactNode {
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
