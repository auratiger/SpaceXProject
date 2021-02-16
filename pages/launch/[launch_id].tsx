import react, {useState, useEffect, createRef} from 'react';
import { useRouter } from 'next/router';
import decoupleValue from '../../utils/decoupleValue'
import { useLaunch } from '../../contexts/LauncesContext';
import { TiArrowBack } from "react-icons/ti";
import { FaAngleDown } from 'react-icons/fa';

import styles from '../../styles/launch.module.css';

enum launchData {
    number = "flight_number",
    mission = "mission_name",
    date = "launch_date_utc",
    site = "launch_site/site_name_long",
    details = "details",
    rocket_id = "rocket/rocket_id",
    rocket_name = "rocket/rocket_name",
    success = "launch_success",
    patch = "links/mission_patch",
}

enum rocketData {
    heightM = "height/meters",
    heightF = "height/feet",
    diameterM = "diameter/meters",
    diameterF = "diameter/feet",
    massK = "mass/kg",
    massL = "mass/kg",
    company = "company",
    country = "country",
    rocketType = 'rocket_type',
    payloads = "payload_weights",
    engineNo = "engines/number",
    engineType = "engines/type",
    engineLayout = "engines/layout",
    engineVersion = "engines/version",
    engineVacuum = "engines/thrust_vacuum/kN",
}

const launch = () => {
    const context = useLaunch();
    const router = useRouter();

    const [launch, setLaunch] = useState({});
    const [rocket, setRocket] = useState({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(!router.query.launch_id) return;

        const launch_id:number = parseInt(router.query.launch_id?.toString());
        
        if(context.launches[launch_id]){
            (async () => {
                const curr_launch = context.launches[launch_id];
                const rocket = await context.fetchData("http://localhost:5000/rocket", {rocket_id: decoupleValue(curr_launch, launchData.rocket_id)});
                setLaunch(curr_launch);
                setRocket(rocket.data);
                setLoading(false);
            })();
        }else{
            // if launch data is not loaded, fetch the data from the server
            (async () => {
                const result = await context.fetchData("http://localhost:5000/launch", {launch_id: launch_id+1});
                const rocket = await context.fetchData("http://localhost:5000/rocket", {rocket_id: decoupleValue(result.data, launchData.rocket_id)});
                console.log(rocket.data);
                setLaunch(result.data);
                setRocket(rocket.data);
                setLoading(false);
            })();
        }
    }, [router]);

    const toggleRow = (element) => {
        if(element.style.display == "none")
            element.style.display = "flex";
        else element.style.display = "none";
    }

    const overviewTableElements = [
        {key: "Flight number", value: launchData.number, class: "overview_row"},
        {key: "Rocket", value: launchData.rocket_name, class: "overview_row"},
        {key: "Launching Site", value: launchData.site, class: "overview_row"},
        {key: "Launch Successful", value: launchData.success, class: "overview_row"},
    ];

    const renderOverviewTable = () => {
        return (
            <div>
                {overviewTableElements.map(el => {
                    const value = decoupleValue(launch, el.value);
                    
                    return <div key={el.key} className={styles[el.class]}>
                        <span>{el.key}</span>
                        <span style={{margin:"auto"}}></span>
                        <span>{value?.toString()}</span>
                    </div>
                })}
            </div>
        )
    }

    const renderOverview = () => {
        return <div className={styles.overview_container}>
                <div className={styles.overview_left}>
                    <div className={styles.overview_header}>
                        <TiArrowBack className={styles.back_btn} onClick={() => router.back()}/>
                        <h1 className={styles.mission_lable}>{`Mission ${launch?.[launchData.mission]}`}</h1>
                    </div>
                    <h1 className={styles.lable}>OVERVIEW</h1>
                    {renderOverviewTable()}
                </div>
                <div className={styles.overview_right}>
                    <img src={decoupleValue(launch, launchData.patch)} alt="patch" width="85%" height="85%"/>
                </div>
            </div>
    }

    const renderDetailCard = () => {
        return <div className={styles.detail_card_container}>
            <span className={styles.details_lable}>{"Launch details:"}</span>
            <span className={styles.details}>{launch[launchData.details] ? launch[launchData.details] : "No details have been specified."}</span>
        </div>
    }

    const rocket_table = [
        {header: "Rocket specs", ref: createRef<HTMLDivElement>(), rows: [
            {key: "Country", value: rocketData.country, prefix: ""},
            {key: "Company", value: rocketData.company, prefix: ""},
            {key: "Type", value: rocketData.rocketType, prefix: ""},
            {key: "Height", value: rocketData.heightM, prefix: "M"},
            {key: "Diameter", value: rocketData.diameterM, prefix: "M"},
            {key: "Mass", value: rocketData.massK, prefix: "Kg"},
        ]},
        {header: "Engine", ref: createRef<HTMLDivElement>(), rows: [
            {key: "Number of engines", value: rocketData.engineNo, prefix: ""},
            {key: "Type", value: rocketData.engineType, prefix: ""},
            {key: "Version", value: rocketData.engineVersion, prefix: ""},
            {key: "Layout", value: rocketData.engineLayout, prefix: ""},
            {key: "Thrust vacuum", value: rocketData.engineVacuum, prefix: "kN"},
        ]},
        {header: "Payloads", ref: createRef<HTMLDivElement>(), rows: [
            {key: "Height", value: rocketData.heightM, prefix: "M"},
            {key: "Diameter", value: rocketData.diameterM, prefix: "M"},
            {key: "Mass", value: rocketData.massK, prefix: "Kg"},
        ]},
    ]

    const renderRocketSpecs = () => {
        return <div className={styles.rocket_info_table}>
            <span className={styles.rocket_lable}>{loading ? "" : decoupleValue(launch, launchData.rocket_name)}</span>
            {rocket_table.map(head => {
                return <>
                    <div className={styles.table_header} onClick={() => toggleRow(head.ref.current)}>
                        <FaAngleDown />
                        <span className={styles.table_header_lable}>{`${head.header} (${head.rows.length})`}</span>
                    </div>
                    <div className={styles.table_toggle} ref={head.ref} style={{display:"none"}}>
                        {head.rows.map(row => {
                            return <div key={row.key} className={styles.table_row}>
                                <span>{row.key}</span>
                                <span>{loading ? "" :decoupleValue(rocket, row.value)+row.prefix}</span>
                            </div>
                        })}
                    </div>
                </>
            })}
        </div>
    }

    return (
        <div className={styles.container}>
            {console.log(launch)}
            {renderOverview()}
            {renderDetailCard()}
            {renderRocketSpecs()}
        </div>
    )
};

export default launch;