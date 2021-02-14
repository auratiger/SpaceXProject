import react from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/navigation.module.css';
import Image from 'next/image'

const NavBar = () => {
    const router = useRouter();

    return (
        <div className={styles.header}>
            <Image 
                src={"/logo.png"}
                alt={"logo"}
                className={styles.logo}
                onClick={() => router.push("/", "/")}
                width={220}
                height={55}
            />
        </div>
    )
}


export default NavBar;
