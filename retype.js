function retype(data) {
    data = data
        .map(function(d) {
            return {
                Language : d['Language'],
                NumberSpeakers: +(d['Number of speakers'].replace(/,/g,""))
            }})
        .sort((a,b) => {
            return b.NumberSpeakers - a.NumberSpeakers
        })

    return data.slice(2,22)
}

function filterBasedOnMostRecentYear(filterObject, year) {
    filterObjectLanguages = filterObject.map((d) => d.Language)
    year = year
        .map(function(d) {
            return {
                Language : d['Language'],
                NumberSpeakers: +(d['Number of speakers'].replace(/,/g,""))
            }})
        .filter(function(d) {
            return filterObjectLanguages.includes(d.Language)
            
        })
        .sort((a,b) => {
            return b.NumberSpeakers - a.NumberSpeakers
        })
    
    yearLangs = year.map(d => d.Language)
    intersection = filterObjectLanguages.filter(x => !yearLangs.includes(x))
    return year
}

function extrapolate(year,data1,data2,data3) {

    let outArr = []

    const allValues=  data3.map((d) => d.Language)

    for (const element of allValues) {
        dat3 = data3.find(o => o.Language == element) 

        dat2 = data2.find(o => o.Language == element) 

        dat1 = data1.find(o => o.Language == element)

        let firstDif = (dat3.NumberSpeakers - dat2.NumberSpeakers) / 6

        let secondDif = (dat2.NumberSpeakers - dat1.NumberSpeakers) / 7

        let growth = (firstDif*.5) + (secondDif*.5)

        outArr.push({
            Language: element,
            NumberSpeakers: dat3.NumberSpeakers + ((year - 2013)*growth)
        })

    }
    return outArr

}

