import { useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadAll } from '@tsparticles/all';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaBitcoin, FaChartLine, FaShieldAlt } from 'react-icons/fa'; // Iconos para el navbar y secciones
import styles from './LandingPage.module.css';
import logo from '/src/assets/imgweb/logo.jpg'

const LandingPage = () => {
    const navigate = useNavigate();
    const heroSectionRef = useRef(null);
    const [particlesLoaded, setParticlesLoaded] = useState(false);

    const { scrollYProgress } = useScroll();

    const translateYHero = useTransform(scrollYProgress, [0, 0.5], ['0%', '-20%']);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadAll(engine);
        }).then(() => {
            setParticlesLoaded(true);
        });
    }, []);

    const particlesOptions = {
        background: {
            color: {
                value: '#000000', // Fondo negro
            },
        },
        fpsLimit: 120,
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: 'push',
                },
                onHover: {
                    enable: true,
                    mode: 'repulse',
                },
            },
            modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: '#ff9100', // Partículas naranjas
            },
            links: {
                color: '#ffffff', // Líneas de conexión blancas (sutil)
                distance: 150,
                enable: true,
                opacity: 0.2, // Más tenues
                width: 1,
            },
            move: {
                direction: 'none',
                enable: true,
                outModes: {
                    default: 'bounce',
                },
                random: false,
                speed: 2,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: 'circle',
            },
            size: {
                value: { min: 1, max: 5 },
            },
        },
        detectRetina: true,
    };

    // Variantes para la animación de entrada del héroe
    const heroContentVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: "easeOut",
                staggerChildren: 0.2,
                delayChildren: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className={styles.landingPageContainer}>
            {particlesLoaded && (
                <Particles
                    id="tsparticles"
                    options={particlesOptions}
                    className={styles.particlesBackground}
                />
            )}

            <nav className={styles.navbar}>
                <div className={styles.navbarBrand}>
                     Cripto Listo
                </div>
                <ul className={styles.navbarNav}>
                    <li><a href="#inicio">Inicio</a></li>
                    <li><a href="#beneficios">Beneficios</a></li>
                    <li><a href="#plataforma">Plataforma</a></li>
                    <li><a href="#registro">Registro</a></li>
                </ul>
            </nav>

            <section id="inicio" className={`${styles.heroSection} ${styles}`} ref={heroSectionRef}> {/* Reintegrado styles.aeroblur */}
                <motion.div
                    className={styles.heroContent}
                    initial="hidden"
                    animate="visible"
                    variants={heroContentVariants}
                    style={{
                        y: translateYHero,
                        opacity: opacityHero
                    }}
                >
                    <motion.div className={styles.heroLogoContainer} variants={itemVariants}>
                        {/* Agrega tu logo aquí. Asegúrate de tener la imagen en tu carpeta `public` o `src/assets` */}
                        <img src={logo} alt="Company Logo" className={styles.heroLogo} />
                    </motion.div>
                    <motion.h1 variants={itemVariants}>Cripto Listo</motion.h1>
                    <motion.p variants={itemVariants}>
                        Realiza transferencias desde cualquier parte del mundo. Tu mercado de criptomonedas de confianza.
                    </motion.p>
                    <a href="#beneficios" className="text-reset text-decoration-none">
                    <motion.button
                        className={styles.ctaButton}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Explora
                    </motion.button>
                    </a>
                </motion.div>
            </section>

            <section id="beneficios" className={`${styles.benefitsSection} ${styles}`}> {/* Reintegrado styles.aeroblur */}
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    Beneficios
                </motion.h2>
                <div className={styles.benefitsGrid}>
                    <motion.div
                        className={styles.benefitItem}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className={styles.iconCircle}>💰</div>
                        <h3>Confianza Monetaria</h3>
                        <p>Transacciones que no devaluan tu billetera</p>
                    </motion.div>
                    <motion.div
                        className={styles.benefitItem}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className={styles.iconCircle}>🌍</div>
                        <h3>Acceso Global</h3>
                        <p>Opera desde cualquier lugar del mundo, 24/7.</p>
                    </motion.div>
                    <motion.div
                        className={styles.benefitItem}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className={styles.iconCircle}>🛡️</div>
                        <h3>Transferencia Segura</h3>
                        <p>Acceso a billetera sólo a traves de llaves publicas</p>
                    </motion.div>
                </div>
            </section>

            <section id="plataforma" className={`${styles.featuresSection} ${styles}`}> {/* Reintegrado styles.aeroblur */}
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    Nuestra Plataforma
                </motion.h2>
                <div className={styles.featuresGrid}>
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <FaShieldAlt className={styles.cardIcon} />
                        <h3>Privacidad</h3>
                        <p>
                            No monitoreamos información sensible
                        </p>
                    </motion.div>
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <FaChartLine className={styles.cardIcon} />
                        <h3>Versatilidad</h3>
                        <p>
                            Facilita el manejo de tu billetera
                        </p>
                    </motion.div>
                    <motion.div
                        className={styles.featureCard}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <FaBitcoin className={styles.cardIcon} />
                        <h3>Educación Financiera</h3>
                        <p>
                            Accede a información actualizada acerca de criptoactivos
                        </p>
                    </motion.div>
                </div>
            </section>

            

            <section id="registro" className={`${styles.ctaSection} ${styles}`}> {/* Reintegrado styles.aeroblur */}
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                >
                    ¿Listo para el Futuro Financiero?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Únete a nuestra comunidad y comienza tu viaje en el mundo de las criptomonedas.
                </motion.p>
                <motion.button
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    onClick={() => navigate("/logreg")}
                >
                    Regístrate Ahora
                </motion.button>
            </section>

            <footer className={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Cripto Listo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;