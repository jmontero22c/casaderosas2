import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer id="contacto" className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerSection}>
                    <h3>Casa de Rosas</h3>
                    <p>
                        Arreglos florales, cestas de regalo y velas aromáticas.
                        <br />
                        Todo hecho con amor para cada ocasión. 💛
                    </p>
                </div>

                <div className={styles.footerSection}>
                    <h3>Navegación</h3>
                    <p>
                        <a href="/">Inicio</a><br />
                        <a href="/flores">Flores</a><br />
                        <a href="/anchetas">Anchetas</a>
                    </p>
                </div>

                <div className={styles.footerSection}>
                    <h3>Contáctanos</h3>
                    <p>
                        📍 Valledupar, Cesar, Colombia<br />
                        📱 +57 300 000 0000<br />
                        ✉️ info@casaderosas.com
                    </p>
                </div>
            </div>

            <div className={styles.footerBottom}>
                © {new Date().getFullYear()} Casa de Rosas. Todos los derechos reservados.
            </div>
        </footer>
    );
}
