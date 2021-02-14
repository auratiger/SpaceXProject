import react, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useLaunch } from '../../contexts/LauncesContext';

import styles from '../../styles/launch.module.css';

enum launchData {
    number = "flight_number",
    mission = "mission_name",
    date = "launch_date_utc",
    site = "launch_site",
    site_name = "site_name_long",
    details = "details",
    rocket = "rocket",
    rocket_name = "rocket_name",
    success = "launch_success",
    links = "links",
    patch = "mission_patch",
}

const launch = () => {
    const router = useRouter();
    const [launch, setLaunch] = useState({});
    const [loading, setLoading] = useState(true);

    const context = useLaunch();

    const fetchData = async (id) => {
        const config = { params: {
                id: router.query.launch_id
            }
        }

        const result = await axios("http://localhost:5000/launch", config);
        setLaunch(result.data);
        setLoading(false);
    };

    useEffect(() => {
        const launch_id:number = parseInt(router.query.launch_id?.toString());
        if(context.launches[launch_id]){
            console.log(3);
            
            setLaunch(context.launches[launch_id]);
            setLoading(false);
        }else{
            console.log(5);
            
            fetchData(launch_id);
        }
    }, [router]);

    const overviewTableElements = [
        {key: "rocket", value: "1", class: "overview_row"},
        {key: "site", value: "1", class: "overview_row"},
        {key: "success", value: "1", class: "overview_row"},
        {key: "flight_number", value: "1", class: "overview_row"},
    ];

    const renderOverviewTable = () => {
        return (
            <div>
                {overviewTableElements.map(el => {
                    return <div className={styles[el.class]}>
                        <span>{el.key}</span>
                        <span style={{margin:"auto"}}></span>
                        <span>{el.value}</span>
                    </div>
                })}
            </div>
        )
    }

    const renderOverview = () => {
        return loading ?
            <div></div> :
            <div className={styles.overview_container}>
                <div className={styles.overview_left}>
                    <h2>{`Mission ${launch[launchData.mission]}`}</h2>
                    <h1 className={styles.lable}>OVERVIEW</h1>
                    {renderOverviewTable()}
                </div>
                <div className={styles.overview_right}>
                    <img src={launch[launchData.links][launchData.patch]} alt="patch" width="85%" height="85%"/>
                </div>
            </div>
    }

    return (
        <div className={styles.container}>
            {renderOverview()}
        </div>
    )
};

export default launch;