import Head from 'next/head'
import react, {useState, useEffect} from 'react';
import axios from 'axios';

import styles from '../styles/launches-page.module.css';

type launchElement = {
  crew: null,
  details:string,
  flight_number:number,
  is_tentative:boolean,
  launch_date_local:string,
  launch_date_utc:number,
  launch_failure_details:any,
  launch_site: any,
  launch_success:boolean,
  launch_window:number,
  launch_year:string,
  links:any,
  mission_id:Array<any>,
  mission_name:string,
  rocket:any,
  ships:Array<any>,
  static_fire_date_unix:number,
  static_fire_date_utc:string,
  tbd:boolean,
  telemetry:any,
  tentative_max_precision:string,
  timeline:any,
  upcoming:boolean
}

export default function Home() {
  const [launches, setLaunches] = useState<Array<launchElement>>([]);
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
      setOffset(offset + queryLimit);
      setLoading(false);
      setLaunches((state) => [...state, ...result.data]);

    })();
  }, []);

  const tableHeaders:Array<string> = [
    "flight number", "date", "launch site", "actions"
  ]

  const renderTableHeaders = () => {
    return tableHeaders.map((element, index) => {
      if(index == 2) return <div className={styles.col_head_site}>{element}</div>
      return <div className={styles.col_head}>{element}</div>
    })
  }

  const renderLaunchElements = (element) => {
    const date = new Date(element["launch_date_unix"]);
    const formattedTime = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}`
    return (
      <>
        <div className={styles.col_item}>{element["flight_number"]}</div>
        <div className={styles.col_item}>{formattedTime}</div>
        <div className={styles.col_item_site}>{element["launch_site"]["site_name_long"]}</div>
        <div className={styles.col_item}>{"action"}</div>
      </>
    )
  }

  const renderLauches = () => {
      return loading ? 
        <h1>loading</h1> :
        launches.map((element, index:number) => {
          return <div key={index} className={styles.table_row}>
            {renderLaunchElements(element)}
          </div>
        });
  }

  return (
    <div className={styles.container}>
      <div className={styles.table_header}>
        {renderTableHeaders()}
      </div>
      <hr className={styles.separator}/>
      {renderLauches()}
    </div>
  )
}
