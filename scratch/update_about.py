import re

with open(r"c:\Users\SHREE\Desktop\Nobilitas\app\about\page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Observer
old_observer = """    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.active);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    const elements = document.querySelectorAll(`.${styles.revealY75}, .${styles.revealY55}, .${styles.revealY50}, .${styles.revealX50}, .${styles.revealOpacity}`);
    elements.forEach((el) => observer.observe(el));

    // Failsafe — force reveal-in after 3 s if observer fires late
    const timer = setTimeout(() => {
      elements.forEach((el) => el.classList.add(styles.active));
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };"""
new_observer = """    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

    // Failsafe — force reveal-in after 3 s if observer fires late
    const timer = setTimeout(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('revealed');
      });
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };"""
content = content.replace(old_observer, new_observer)

# 2. Hero Section
content = content.replace(
    '<h1 className={`${styles.revealY75} ${styles.delay0} ${mounted ? styles.active : \'\'}`}>',
    '<h1 style={{ opacity: mounted ? 1 : 0, transform: mounted ? \'translateY(0)\' : \'translateY(75px)\', transition: \'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)\', transitionDelay: \'0ms\' }}>'
)
content = content.replace(
    '<div className={`${styles.aboutHeroSubheading} ${styles.revealY75} ${styles.delay200} ${mounted ? styles.active : \'\'}`}>',
    '<div className={styles.aboutHeroSubheading} style={{ opacity: mounted ? 1 : 0, transform: mounted ? \'translateY(0)\' : \'translateY(75px)\', transition: \'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)\', transitionDelay: \'200ms\' }}>'
)
content = content.replace(
    '<a href="#story-section">(SCROLL DOWN)</a>',
    '<a href="#story-section" style={{ opacity: mounted ? 1 : 0, transform: mounted ? \'translateY(0)\' : \'translateY(75px)\', transition: \'opacity 880ms cubic-bezier(0.22, 1, 0.36, 1), transform 880ms cubic-bezier(0.22, 1, 0.36, 1)\', transitionDelay: \'400ms\' }}>(SCROLL DOWN)</a>'
)

# 3. Story Section
content = content.replace(
    '<h2 className={`${styles.h2SerifLeft} ${styles.revealY55}`}>welcome to nobilitas</h2>',
    '<h2 className={styles.h2SerifLeft} data-reveal="up">welcome to nobilitas</h2>'
)
content = content.replace(
    '<Link href="/contact" className={`${styles.secondaryButton} ${styles.revealY55} ${styles.delay150}`}>',
    '<Link href="/contact" className={styles.secondaryButton} data-reveal="up" data-delay="100">'
)
content = content.replace(
    '<p className={`${styles.storyP} ${styles.revealY55} ${styles.delay150}`}>',
    '<p className={styles.storyP} data-reveal="up" data-delay="200">'
)
content = content.replace(
    '<div className={`${styles.keyMetricLeft} ${styles.revealY50}`}>',
    '<div className={styles.keyMetricLeft} data-reveal="up" data-delay="100">'
)
content = content.replace(
    '<div className={`${styles.keyMetricRight} ${styles.revealY50} ${styles.delay150}`}>',
    '<div className={styles.keyMetricRight} data-reveal="up" data-delay="200">'
)

# 4. Partners Section
content = content.replace(
    '<h2 className={styles.h2SerifLeft}>trusted by hundreds</h2>',
    '<h2 className={styles.h2SerifLeft} data-reveal="up">trusted by hundreds</h2>'
)
content = content.replace(
    'className={`${styles.clientCell} ${styles.revealY50} ${styles[`delay${((i % 4) + 1) * 100}`]}`}',
    'className={styles.clientCell}\n              data-reveal="fade"\n              data-delay={[\'100\', \'200\', \'300\'][i % 3]}'
)

# 5. Vision & Mission Section
content = content.replace(
    '<h2 className={`${styles.h2SerifLeft} ${styles.revealY55}`}>what we truly stand for</h2>',
    '<h2 className={styles.h2SerifLeft} data-reveal="up">what we truly stand for</h2>'
)
content = content.replace(
    '<div className={`${styles.visionMissionImage} ${styles.revealOpacity}`}>',
    '<div className={styles.visionMissionImage} data-reveal="fade" data-delay="100">'
)
content = content.replace(
    '<div className={`${styles.visionLeft} ${styles.revealX50}`}>',
    '<div className={styles.visionLeft} data-reveal="right">'
)
content = content.replace(
    '<p className={`${styles.revealX50} ${styles.delay100}`}>To become the most trusted single-source procurement partner for India\\\'s offices, hotels, hospitals, and factories.</p>',
    '<p data-reveal="right" data-delay="100">To become the most trusted single-source procurement partner for India\\\'s offices, hotels, hospitals, and factories.</p>'
)
content = content.replace(
    '<div className={`${styles.missionLeft} ${styles.revealX50}`}>',
    '<div className={styles.missionLeft} data-reveal="right" data-delay="200">'
)
content = content.replace(
    '<p className={`${styles.revealX50} ${styles.delay100}`}>To deliver reliable, quality-vetted workplace supplies with speed and transparency — making procurement feel like one phone call.</p>',
    '<p data-reveal="right" data-delay="300">To deliver reliable, quality-vetted workplace supplies with speed and transparency — making procurement feel like one phone call.</p>'
)

# 6. Values Section
content = content.replace(
    '<h2 className={styles.h2SerifLeft}>values we are proud of</h2>',
    '<h2 className={styles.h2SerifLeft} data-reveal="up">values we are proud of</h2>'
)
content = content.replace(
    '<div className={styles.valueImage}>',
    '<div className={styles.valueImage} data-reveal="fade">'
)
content = content.replace(
    '<div className={`${styles.valueItem} ${styles.revealX50}`}>',
    '<div className={styles.valueItem} data-reveal="right" data-delay="100">'
)
content = content.replace(
    '<div className={`${styles.valueItem} ${styles.revealX50} ${styles.delay100}`}>',
    '<div className={styles.valueItem} data-reveal="right" data-delay="200">'
)
content = content.replace(
    '<div className={`${styles.valueItem} ${styles.revealX50} ${styles.delay200}`}>',
    '<div className={styles.valueItem} data-reveal="right" data-delay="300">'
)
# For the 4th value it was `<div className={`${styles.valueItem} ${styles.revealX50}`}>` -> will be replaced by the 1st replace! So we need to be careful.
# Ah, I should use re.sub for these to index them.
# Let's fix that. I will just rewrite the file content back later.
