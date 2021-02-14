import react, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { BsBoxArrowInRight } from "react-icons/bs";
import {useLaunch} from '../contexts/LauncesContext';

import styles from '../styles/launches-page.module.css';

export default function Home() {
  const router = useRouter();

  const context = useLaunch();

  const [loading, setLoading] = useState(true);

  const queryLimit:number = 15;
  const [offset, setOffset] = useState<number>(0);

  const fetchData = async () => {
    const config = {
      params: {
        offset: offset,
        limit: queryLimit
      }
    }
    const result = await axios("http://localhost:5000/launches", config);
    context.setLaunches((state) => [...state, ...result.data]);
    setOffset(offset + queryLimit);
    setLoading(false);
  };

  useEffect(() => {
    if(context.launches.length === 0){
      (async () => {
        fetchData();
      })();
    }else{
      setLoading(false);
    }
  }, []);

  const handleClick = (e, index) => {
    e.preventDefault();
    router.push(`launch/${index}`, `launch/${index}`);
  }

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if(bottom){
      fetchData();
    }
  }

  const tableHeaders:Array<any> = [
    {name: "Flight number", class: "col_header"},
    {name: "Date", class: "col_header_date"},
    {name: "Launch site", class: "col_header_site"},
  ]

  const renderTableHeaders = () => {
    return tableHeaders.map((element, index) => {
      return <span key={"head " + index} className={styles[element.class]}>{element.name}</span>
    })
  }

  const renderLaunchElements = (element, index) => {
    const date = new Date(element["launch_date_unix"]);
    const formattedTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`
    return (
      <>
        <div className={styles.col_item}>{element["flight_number"]}</div>
        <div className={styles.col_item}>{formattedTime}</div>
        <div className={styles.col_item_site}>{element["launch_site"]["site_name_long"]}</div>
        <div className={styles.col_item_action} onClick={(e) => handleClick(e, index)}><BsBoxArrowInRight/></div>
      </>
    )
  }

  const renderLauches = () => {
      return loading ? 
        Array.apply(null, Array(offset + queryLimit)).map(el => {
          return <div className={styles.empty_table_row}>loading...</div>
        }):
        context.launches.map((element, index:number) => {
          return <div key={index} className={styles.table_row}>
            {renderLaunchElements(element, index)}
          </div>
        });
  }

  return (
    <div className={styles.container}>
        <div className={styles.table_header}>
          {renderTableHeaders()}
        </div>
        <div className={styles.table_rows} onScroll={handleScroll}>
          {renderLauches()}
          <div style={{margin: "20px 0 20px 0"}}></div>
        </div>
    </div>
  )
}
