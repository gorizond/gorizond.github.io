import type {ReactNode} from 'react';
import {useEffect} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import PricingModule from '@site/src/components/PricingModule';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/docs/intro">
                        Gorizond Tutorial - 5min ⏱️
                    </Link>
                    <div style={{ margin: '16px' }}></div>
                    <Link
                        className="button button--secondary button--lg"
                        style={{ backgroundColor: '#90EBCD' }}
                        to="https://gorizond.negash.ru">
                        Go to app
                    </Link>
                    <div style={{ margin: '16px' }}></div>
                    <Link
                        className="button button--secondary button--lg"
                        to="#pricing">
                        View pricing
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home(): ReactNode {
    const {siteConfig} = useDocusaurusContext();

    useEffect(() => {
        const scrollToPricingIfNeeded = () => {
            if (typeof window === 'undefined') return;
            if (window.location.hash === '#pricing') {
                const el = document.getElementById('pricing');
                if (el) {
                    setTimeout(() => {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 0);
                }
            }
        };

        // Scroll on first render
        scrollToPricingIfNeeded();

        // Scroll on hash change
        window.addEventListener('hashchange', scrollToPricingIfNeeded);
        return () => window.removeEventListener('hashchange', scrollToPricingIfNeeded);
    }, []);

    return (
        <Layout description="Description will go into a meta tag in <head />">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
                <PricingModule />
            </main>
        </Layout>
    );
}