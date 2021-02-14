import react, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { BsBoxArrowInRight } from "react-icons/bs";

import styles from '../styles/launches-page.module.css';

export default function Home() {
  const [launches, setLaunches] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


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
    console.log(result.data);
    setOffset(offset + queryLimit);
    setLoading(false);
    setLaunches((state) => [...state, ...result.data]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = (index) => {
    router.push("launch");
  }

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if(bottom){
      console.log("bottom");
      fetchData();
    }
  }

  const tableHeaders:Array<any> = [
    {name: "flight number", class: "col_item"},
    {name: "date", class: "col_item"},
    {name: "launch site", class: "col_item_site"},
    {name: "action", class: "col_item_action"},
  ]

  const renderTableHeaders = () => {
    return tableHeaders.map((element, index) => {
      return <div key={"head " + index} className={styles[element.class]}>{element.name}</div>
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
        <div className={styles.col_item_action} onClick={(index) => handleClick(index)}><BsBoxArrowInRight/></div>
      </>
    )
  }

  const renderLauches = () => {
      return loading ? 
        <h1>loading</h1> :
        launches.map((element, index:number) => {
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
        <hr className={styles.separator}/>
        <div className={styles.table_rows} onScroll={handleScroll}>
          {renderLauches()}
          <div style={{margin: "20px 0 20px 0"}}></div>
        </div>
    </div>
  )
}
