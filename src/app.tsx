import styles from './App.module.css';
import Navbar from './components/Navbar/Navbar';
import HeroBanner from './components/HeroBanner/HeroBanner';

export default function App() {
    return (
        <div className={styles.app}>
            <Navbar />
            <div className={styles.mainContent}>
                <HeroBanner />
                {/* Additional content can go here */}
            </div>
        </div>
    );
}

