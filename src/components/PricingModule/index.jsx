import React from 'react';
import styles from './styles.module.css';

const PricingTier = ({ title, price, features, highlighted, note }) => (
    <div className={`${styles.tier} ${highlighted ? styles.highlighted : ''}`}>
        <div className={styles.header}>
            <h3>{title}</h3>
            <div className={styles.price}>{price}</div>
            {note && <div className={styles.note}>{note}</div>}
        </div>

        <ul className={styles.features}>
            {features.map((feature, i) => (
                <li key={i} className={feature.included ? '' : styles.disabled}>
          <span className={styles.checkmark}>
            {feature.included ? '✓' : '✗'}
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
            title: 'Free Tier',
            price: '₽0',
            note: 'Limited functionality',
            features: [
                { included: true, text: '1 VM instance' },
                { included: true, text: 'Daily reboot' },
                { included: false, text: '24/7 uptime' },
                { included: false, text: 'Priority support' },
            ]
        },
        {
            title: 'Pay-as-you-go',
            price: '₽0.015/minute',
            note: 'Unlimited access',
            highlighted: true,
            features: [
                { included: true, text: 'Unlimited VMs' },
                { included: true, text: '24/7 runtime' },
                { included: true, text: 'Priority support' },
                { included: true, text: 'Advanced features' },
            ]
        }
    ];

    return (
        <section className={styles.pricingSection}>
            <h2 className="text--center">Choose Your Plan</h2>

            <div className={styles.grid}>
                {tiers.map((tier, i) => (
                    <div key={i} className={styles.column}>
                        <PricingTier {...tier} />
                    </div>
                ))}
            </div>

            <div className={styles.details}>
                <p>Free tier limitations:</p>
                <ul>
                    <li>Instance automatically reboots every 24h</li>
                    <li>Limited to 1 concurrent VM</li>
                </ul>
            </div>
        </section>
    );
}