import type { ReactNode } from "react";
import { useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import PricingModule from "@site/src/components/PricingModule";
import InfraDiagram from "@site/src/components/InfraDiagram";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          <Translate
            id="homepage.hero.tagline"
            description="Homepage hero subtitle"
          >
            Самый простой способ запустить и управлять k3s на IoT
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
          >
            <Translate
              id="homepage.hero.cta.tutorial"
              description="Primary CTA button text"
            >
              Туториал Gorizond — 5 минут ⏱️
            </Translate>
          </Link>
          <div style={{ margin: "16px" }}></div>
          <Link
            className="button button--secondary button--lg"
            style={{ backgroundColor: "#90EBCD" }}
            to="https://gorizond.negash.ru/dashboard/"
          >
            <Translate
              id="homepage.hero.cta.app"
              description="CTA to open the app"
            >
              Войти в приложение
            </Translate>
          </Link>
          <div style={{ margin: "16px" }}></div>
          <button
            type="button"
            className="button button--secondary button--lg"
            onClick={() => {
              const el = document.getElementById("pricing");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
          >
            <Translate
              id="homepage.hero.cta.pricing"
              description="CTA to scroll to pricing"
            >
              Тарифы
            </Translate>
          </button>
        </div>
      </div>
    </header>
  );
}

function ProblemSection() {
  return (
    <section className={styles.problemSection}>
      <div className="container">
        <div className={styles.problemIntro}>
          <Heading as="h2" className={styles.problemTitle}>
            Зачем Gorizond?
          </Heading>
          <p className={styles.problemText}>
            Gorizond убирает сетевую головную боль и управление control plane
            для IoT/edge: k3s поднимается за минуты, узлы сами выходят в mesh
            через headscale/tailscale, кластеры сразу появляются в Rancher с
            GitOps через Fleet. Никаких ручных VPN, пробросов и настройки
            ingress — одна команда на устройстве и готовый UI.
          </p>
        </div>
        <figure className={styles.problemVisual}>
          <InfraDiagram />
        </figure>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  useEffect(() => {
    const scrollToPricingIfNeeded = () => {
      if (typeof window === "undefined") return;
      if (window.location.hash === "#pricing") {
        const el = document.getElementById("pricing");
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 0);
        }
      }
    };

    scrollToPricingIfNeeded();
    window.addEventListener("hashchange", scrollToPricingIfNeeded);
    return () => window.removeEventListener("hashchange", scrollToPricingIfNeeded);
  }, []);

  return (
    <Layout
      description={translate({
        id: "homepage.meta.description",
        message: "Gorizond: лучший способ запустить и управлять k3s на IoT",
      })}
    >
      <HomepageHeader />
      <main>
        <ProblemSection />
        <HomepageFeatures />
        <section id="pricing">
          <PricingModule />
        </section>
      </main>
    </Layout>
  );
}
