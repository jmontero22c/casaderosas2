import styles from './WhatsAppButton.module.css';

interface WhatsAppButtonProps {
    phoneNumber?: string;
    message?: string;
}

export default function WhatsAppButton({
    phoneNumber = '573004468890',
    message = 'Hola, me gustaría cotizar un producto de Casa de Rosas 🌹',
}: WhatsAppButtonProps) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.button} ${styles.pulse}`}
            aria-label="Cotizar por WhatsApp"
        >
            💬
        </a>
    );
}
