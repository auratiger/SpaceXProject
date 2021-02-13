import Head from 'next/head'
import react, {useState, useEffect} from 'react';
import axios from 'axios';

import styles from '../styles/launches-page.module.css';

export default function Home() {
  const [launches, setLaunches] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const queryLimit:number = 15;
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const config = {
        params: {
          offset: offset,
          limit: queryLimit
        }
      }

      const result = await axios("http://localhost:5000/launches", config);
      console.log(result.data);
      setLoading(false);
      setLaunches(result.data);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.table}>
        <div className={styles.table_header}>
          <div className={styles.col_head}>ele</div>
          <div className={styles.col_head}>ele</div>
          <div className={styles.col_head}>ele</div>
        </div>
        <hr className={styles.separator}/>
        {loading ? 
          <h1>loading</h1> :
          launches.map((element, index) => {
            return <div key={index} className={styles.table_row}>
              {element["flight_number"]}
            </div>
          })
        }
      </div>



    </div>
  )
}
