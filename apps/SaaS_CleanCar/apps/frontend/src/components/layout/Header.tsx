import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    rightAction?: React.ReactNode;
}

export function Header({ title, rightAction }: HeaderProps) {
    return (
        <header className={styles.header}>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.actions}>
                {rightAction}
                {/* Helper icons typically found in dashboard */}
                <button className={styles.buttonSecondary} aria-label="Notifications">🔔</button>
            </div>
        </header>
    );
}
