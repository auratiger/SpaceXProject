import react from 'react';
import styles from '../../styles/navigation.module.css';
import Image from 'next/image'

const NavBar = () => {

    return (
        <div className={styles.header}>
            <Image 
                src={"/logo.png"}
                alt={"logo"}
                className={styles.logo}
                width={200}
                height={70}
            />
        </div>
    )
}


export default NavBar;
