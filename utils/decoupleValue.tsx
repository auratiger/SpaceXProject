const decoupleValue = (value:{} = {}, param:string = "") => {
    const query:Array<string> = param.split('/');

    query.map(el => {
        value=value?.[el];
    })

    return value;
}

export default decoupleValue;