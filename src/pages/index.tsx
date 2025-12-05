import type { ReactNode } from "react";
import { useEffect } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Translate, { translate } from "@docusaurus/Translate";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import PricingModule from "@site/src/components/PricingModule";
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
            The simplest way to launch and manage k3s on IoT
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
              Gorizond Tutorial - 5min ⏱️
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
              Go to app
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
              View pricing
            </Translate>
          </button>
        </div>
      </div>
    </header>
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

    // Scroll on first render
    scrollToPricingIfNeeded();

    // Scroll on hash change
    window.addEventListener("hashchange", scrollToPricingIfNeeded);
    return () =>
      window.removeEventListener("hashchange", scrollToPricingIfNeeded);
  }, []);

  return (
    <Layout
      description={translate({
        id: "homepage.meta.description",
        message: "Gorizond: the simplest way to launch and manage k3s on IoT",
      })}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <section id="pricing">
          <PricingModule />
        </section>
      </main>
    </Layout>
  );
}
