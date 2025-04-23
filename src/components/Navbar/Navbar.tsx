import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const contractAddress = "E7jDjYFT6VAxSbtPPRnF8pEeWpsVCLbM7LyTAgM1pump"; // Example contract address
  
  // Create shortened version of the address (first 6 and last 4 characters)
  const shortenedAddress = `${contractAddress.substring(0, 6)}...${contractAddress.substring(contractAddress.length - 4)}`;
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContent}>
        <div className={styles.leftSide}>
          <div className={styles.logoContainer}>
            <img src="/v1.png" alt="Deeple Logo" className={styles.logoImage} />
          </div>
          
          <ul className={styles.navLinks}>
            <li><a target='_blank' href="https://x.com/deeplearnonsol?s=21">Twitter</a></li>
            {/* <li><a href="#telegram">Telegram</a></li> */}
            <li><a target='_blank' href="https://pump.fun/coin/E7jDjYFT6VAxSbtPPRnF8pEeWpsVCLbM7LyTAgM1pump?include-nsfw=true">Pump.fun</a></li>
          </ul>
        </div>
        
        <div className={styles.rightSide}>
          <div className={styles.contractAddressContainer}>
            <span className={styles.caLabel}>CA:</span>
            <div className={styles.addressWrapper} onClick={copyToClipboard} title={contractAddress}>
              <span className={styles.contractAddress}>
                {shortenedAddress}
              </span>
              <button className={styles.copyButton}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            {isCopied && <div className={styles.copiedTooltip}>Copied!</div>}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 