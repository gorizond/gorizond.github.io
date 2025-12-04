import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: "homepage.features.easy.title",
      message: "Easy to launch",
      description: "Feature title: easy to launch",
    }),
    Svg: require("@site/static/img/landing_easy_to_lanch.svg").default,
    description: (
      <>
        <Translate
          id="homepage.features.easy.description"
          description="Feature description: easy to launch"
        >
          One CLI command and your cluster is ready. Gorizond handles the hard
          stuff.
        </Translate>
      </>
    ),
  },
  {
    title: translate({
      id: "homepage.features.vpn.title",
      message: "VPN by default",
      description: "Feature title: VPN by default",
    }),
    Svg: require("@site/static/img/landing_vpn_by_default.svg").default,
    description: (
      <>
        <Translate
          id="homepage.features.vpn.description"
          description="Feature description: VPN by default"
        >
          Built-in Headscale forms a NAT-less mesh network.
        </Translate>
      </>
    ),
  },
  {
    title: translate({
      id: "homepage.features.iot.title",
      message: "IoT ready",
      description: "Feature title: IoT ready",
    }),
    Svg: require("@site/static/img/landing_iot_ready.svg").default,
    description: (
      <>
        <Translate
          id="homepage.features.iot.description"
          description="Feature description: IoT ready"
        >
          Low resource usage and high resiliency — great for the edge.
        </Translate>
      </>
    ),
  },
  {
    title: translate({
      id: "homepage.features.p2p.title",
      message: "Coming soon: P2P Wi‑Fi",
      description: "Feature title: P2P Wi-Fi coming soon",
    }),
    Svg: require("@site/static/img/landing_p2p_wi_fi.svg").default,
    description: (
      <>
        <Translate
          id="homepage.features.p2p.description"
          description="Feature description: P2P Wi-Fi"
        >
          batman-adv mesh over Wi‑Fi for true peer-to-peer networking.
        </Translate>
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
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
