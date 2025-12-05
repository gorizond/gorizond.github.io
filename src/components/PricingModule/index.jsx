import React from "react";
import Translate, { translate } from "@docusaurus/Translate";
import styles from "./styles.module.css";

const PricingTier = ({ title, price, features, highlighted, note }) => (
  <div className={`${styles.tier} ${highlighted ? styles.highlighted : ""}`}>
    <div className={styles.header}>
      <h3>{title}</h3>
      <div className={styles.price}>{price}</div>
      {note && <div className={styles.note}>{note}</div>}
    </div>

    <ul className={styles.features}>
      {features.map((feature, i) => (
        <li key={i} className={feature.included ? "" : styles.disabled}>
          <span className={styles.checkmark}>
            {feature.included ? "✓" : "✗"}
          </span>
          {feature.text}
        </li>
      ))}
    </ul>
  </div>
);

export default function PricingModule() {
  const tiers = [
    {
      title: translate({
        id: "pricing.tier.free.title",
        message: "Free Tier",
        description: "Pricing tier title for free plan",
      }),
      price: "₽0",
      note: translate({
        id: "pricing.tier.free.note",
        message: "Limited functionality",
        description: "Short note for free plan",
      }),
      features: [
        {
          included: true,
          text: translate({
            id: "pricing.tier.free.feature.vm",
            message: "1 instance (worker)",
            description: "Free plan feature: instance/worker count",
          }),
        },
        {
          included: true,
          text: translate({
            id: "pricing.tier.free.feature.reboot",
            message: "Daily reboot",
            description: "Free plan feature: daily reboot",
          }),
        },
        {
          included: false,
          text: translate({
            id: "pricing.tier.free.feature.uptime",
            message: "24/7 uptime",
            description: "Free plan missing 24/7 uptime",
          }),
        },
        {
          included: false,
          text: translate({
            id: "pricing.tier.free.feature.support",
            message: "Priority support",
            description: "Free plan missing priority support",
          }),
        },
      ],
    },
    {
      title: translate({
        id: "pricing.tier.paid.title",
        message: "Pay-as-you-go",
        description: "Pricing tier title for paid plan",
      }),
      price: "₽0.015/minute",
      note: translate({
        id: "pricing.tier.paid.note",
        message: "Unlimited access",
        description: "Short note for paid plan",
      }),
      highlighted: true,
      features: [
        {
          included: true,
          text: translate({
            id: "pricing.tier.paid.feature.vms",
            message: "Unlimited instances (workers)",
            description: "Paid plan feature: unlimited instances/workers",
          }),
        },
        {
          included: true,
          text: translate({
            id: "pricing.tier.paid.feature.runtime",
            message: "24/7 runtime",
            description: "Paid plan feature: 24/7 runtime",
          }),
        },
        {
          included: true,
          text: translate({
            id: "pricing.tier.paid.feature.support",
            message: "Priority support",
            description: "Paid plan feature: priority support",
          }),
        },
        {
          included: true,
          text: translate({
            id: "pricing.tier.paid.feature.advanced",
            message: "Advanced features",
            description: "Paid plan feature: advanced features",
          }),
        },
      ],
    },
  ];

  return (
    <section className={styles.pricingSection}>
      <h2 id="pricing" className="text--center">
        <Translate id="pricing.title" description="Section title for pricing">
          Choose Your Plan
        </Translate>
      </h2>

      <div className={styles.grid}>
        {tiers.map((tier, i) => (
          <div key={i} className={styles.column}>
            <PricingTier {...tier} />
          </div>
        ))}
      </div>

      <div className={styles.details}>
        <p>
          <Translate
            id="pricing.limitations.title"
            description="Title for free tier limits"
          >
            Free tier limitations:
          </Translate>
        </p>
        <ul>
          <li>
            <Translate
              id="pricing.limitations.reboot"
              description="Free tier limitation: reboot every 24h"
            >
              Instance automatically reboots every 24h
            </Translate>
          </li>
          <li>
            <Translate
              id="pricing.limitations.count"
              description="Free tier limitation: instance/worker count"
            >
              Limited to 1 concurrent instance (worker)
            </Translate>
          </li>
        </ul>
      </div>
    </section>
  );
}
