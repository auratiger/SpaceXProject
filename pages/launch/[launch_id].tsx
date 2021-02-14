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
    const context = useLaunch();
    const router = useRouter();

    const [launch, setLaunch] = useState({});
    const [loading, setLoading] = useState(true);


    const fetchData = async (id) => {
        const config = { params: {
                id: id+1
            }
        }
        
        const result = await axios("http://localhost:5000/launch", config);
        setLaunch(result.data);
        setLoading(false);
    };

    useEffect(() => {
        if(!router.query.launch_id) return;

        const launch_id:number = parseInt(router.query.launch_id?.toString());
        
        if(context.launches[launch_id]){
            setLaunch(context.launches[launch_id]);
            setLoading(false);
        }else{
            // if launch data is not loaded, fetch the data from the server
            fetchData(launch_id);
        }
    }, [router]);

    const overviewTableElements = [
        {key: "Flight number", value: [launchData.number], class: "overview_row"},
        {key: "Rocket", value: [launchData.rocket, launchData.rocket_name], class: "overview_row"},
        {key: "Launching Site", value: [launchData.site, launchData.site_name], class: "overview_row"},
        {key: "Launch Successful", value: [launchData.success], class: "overview_row"},
    ];

    const renderOverviewTable = () => {
        return (
            <div>
                {overviewTableElements.map(el => {
                    let value = launch;
                    el.value.map(el => {
                        value=value[el]
                    });
                    return <div className={styles[el.class]}>
                        <span>{el.key}</span>
                        <span style={{margin:"auto"}}></span>
                        <span>{value.toString()}</span>
                    </div>
                })}
            </div>
        )
    }

    const renderOverview = () => {
        return loading ?
            <div>Loading</div> :
            <div className={styles.overview_container}>
                <div className={styles.overview_left}>
                    <h1 className={styles.mission_lable}>{`Mission ${launch[launchData.mission]}`}</h1>
                    <h1 className={styles.lable}>OVERVIEW</h1>
                    {renderOverviewTable()}
                </div>
                <div className={styles.overview_right}>
                    <img src={launch[launchData.links][launchData.patch]} alt="patch" width="85%" height="85%"/>
                </div>
            </div>
    }

    const renderDetailCard = () => {
        return <div className={styles.detail_card_container}>
            <span className={styles.details_lable}>{"Launch details:"}</span>
            <span className={styles.details}>{launch[launchData.details] ? launch[launchData.details] : "No details have been specified."}</span>
        </div>
    }

    const renderRocketSpecs = () => {
        return <div className={styles.rocket_specs_container}>

        </div>
    }

    return (
        <div className={styles.container}>
            {renderOverview()}
            {renderDetailCard()}
            {renderRocketSpecs()}
        </div>
    )
};

export default launch;