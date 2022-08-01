import annotations from './annotations.js'
import narrations from './narration.js'

export default class SceneManager {
    constructor(extrapolate, data4, data3, data2, data1, margin, d3, makeAnnotations, width, height) {
        this.nums = data3.map(d => d.NumberSpeakers),
        this.data4 = data4,
        this.data3 = data3,
        this.data2 = data2,
        this.data1 = data1,
        this.makeAnnotations = makeAnnotations,
        this.d3 = d3,
        this.margin = margin,
        this.width = width,
        this.height = height,
        this.buildSVG(),
        this.buildButtons(narrations.length),
        this.buildandAppendX(data3),
        this.buildandAppendY()
        this.sideSVG = null
        this.createInitialScene()
    }
    buildButtons(num) {
        for (let i = 0; i < num; i++) {
            this.d3.select("#btn-group")
                .append('button')
                .text((i+1).toString())
                .attr('style', 'margin-right:10px')
                .on('click', () => this.createScene(i.toString()))
        }
    }

    buildSVG() {
        this.svg = this.d3.select("#my_dataviz")
            .append("svg")
                .attr('id','annotationSVG')
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .call(this.makeAnnotations[0])
            .append("g")
                .attr('id','dataCenter')
                .attr("transform",
                    "translate(" + this.margin.left + "," + this.margin.top + ")")
    }

    buildX(data) {
        this.x = this.d3.scaleBand()
            .range([ 0, this.width ])
            .domain(data.map(function(d) { return d.Language; }))
            .padding(0.2);

    }
    appendX() {
        this.svg.append("g")
            .attr("id","xAxis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.d3.axisBottom(this.x))
    }
    buildY() {
        const nums = this.data3.map(d => d.NumberSpeakers)

        this.y = this.d3.scaleLinear()
            .domain([0, this.d3.max(nums)])
            .range([ this.height, 0]);
    }
    appendY() {
        this.svg.append("g")
            .attr("id","yAxis")
            .attr("class", "myYaxis")
            .call(this.d3.axisLeft(this.y));
    }
    buildandAppendX(data) {
        this.buildX(data)
        this.appendX()
    }
    buildandAppendY() {
        this.buildY()
        this.appendY()
    }
    createInitialScene() {
        this.buildY()
        this.createScene('0')
    }
    createScene(sceneNumber) {
        console.log('CREATE SCENE CALLED WITH ', sceneNumber)
        const dataFromSceneNumber = {
            '0':{
                data:this.data3,
                buildX: true,
      
            },
            '1':{
                data:this.data1,
                buildX: false,
   
            },
            '2':{
                data:this.data1,
                buildX: true,
           
            },
            '3':{
                data:this.data2,
                buildX: false,
           
            },
            '4':{
                data:this.data2,
                buildX: true,
       
            },
            '5':{
                data:this.data3,
                buildX: true,

            },
            '6':{
                data:this.data4,
                buildX: true,
 
            },
            '7':{
                data:this.data3,
                buildX: true,
 
            }
        }

        const doBuild = dataFromSceneNumber[sceneNumber].buildX
        let newData = dataFromSceneNumber[sceneNumber].data

        console.log('NEW DATA', newData)
        console.log(typeof sceneNumber)
        this.d3.select("#my_dataviz")
            .select('#annotationSVG')
            .call(this.makeAnnotations[Number(sceneNumber)])


        
        

        if (doBuild || sceneNumber == '0'){
            var x = this.d3.scaleBand()
                .range([ 0, this.width ])
                .domain(newData.map(function(d) { return d.Language; }))
                .padding(0.2);
            this.x = x

        } else {
            x = this.x
        }



        var use_this_y = this.d3.scaleLinear()
                .domain([0, this.d3.max(this.nums)])
                .range([ this.height, 0]);

        
        let tempheight = this.height

        

        var u = this.svg.selectAll("rect")
            .data(newData)
    
        u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.Language); })
        .attr("y", function(d) { return use_this_y(d.NumberSpeakers); })
        .attr("width", this.x.bandwidth())
        .attr("height", function(d) { 
            return (tempheight) - use_this_y(d.NumberSpeakers); 
        })
        .attr("fill", "#69b3a2")

        if (doBuild) {
            this.d3.select("#xAxis")
                .call(d3.axisBottom(x))
        }

        if (sceneNumber == '7'){
            console.log('IN')
    
            function range(start, end) {
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
                }
                
            var tempData = range(2020, 2050); 

            this.sideSVG = this.d3.select("#my_dataviz")
                        .append("div")
                            .attr('id','otherDiv')
                            .attr("width", 150)
                            .attr("height", 700)
            

            this.sideSVG
                .append('select')
                .attr('name','what')
                .attr('class','select')
                .on('change', function() {
                    let selectValue = d3.select('select').property('value')

                    let out = this.yearFromDropDrown(selectValue,this.data1,this.data2,this.data3)
                    console.log(out)
                })
                .attr('width', 150)
                .selectAll('option')
                .data(tempData)
                .enter()
                .append('option')
                    .attr('value',d => d)
                    .text(d => d)
                        
            
        }

        this.createNarration(sceneNumber)

    }
    extrapolate(year) {

        let outArr = []
    
        const allValues =  data3.map((d) => d.Language)
    
        for (const element of allValues) {
            dat3 = this.data3.find(o => o.Language == element) 
    
            dat2 = this.data2.find(o => o.Language == element) 
    
            dat1 = this.data1.find(o => o.Language == element)
    
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
    yearFromDropDrown(year) {

        const doBuild = true
        let newData = this.extrapolate(year)

        let newNums = this.d3.max(newData.map(d => d.NumberSpeakers))

        console.log('NEW DATA', newData)
        console.log(typeof sceneNumber)
        this.d3.select("#my_dataviz")
            .select('#annotationSVG')
            .call(this.makeAnnotations[Number(sceneNumber)])



        if (doBuild || sceneNumber == '0'){
            var x = this.d3.scaleBand()
                .range([ 0, this.width ])
                .domain(newData.map(function(d) { return d.Language; }))
                .padding(0.2);
            this.x = x

        } else {
            x = this.x
        }


        var use_this_y = this.d3.scaleLinear()
                .domain([0, this.d3.max(newNums)])
                .range([ this.height, 0]);

        
        let tempheight = this.height


        var u = this.svg.selectAll("rect")
            .data(newData)
    
        u
        .enter()
        .append("rect")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d.Language); })
        .attr("y", function(d) { return use_this_y(d.NumberSpeakers); })
        .attr("width", this.x.bandwidth())
        .attr("height", function(d) { 
            return (tempheight) - use_this_y(d.NumberSpeakers); 
        })
        .attr("fill", "#69b3a2")

        if (doBuild) {
            this.d3.select("#xAxis")
                .call(d3.axisBottom(x))
        }

        console.log('YES')
        u
        .on('click',function() {

            function range(start, end) {
                return Array(end - start + 1).fill().map((_, idx) => start + idx)
                }
                var tempData = range(2020, 2050); // [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

            this.sideSVG = this.d3.select("#my_dataviz")
                        .append("svg")
                            .attr('id','annotationSVG')
                            .attr("width", 50)
                            .attr("height", 500)

            this.sideSVG
                .append('select')
                .selectAll('option')
                .data(tempData)
                .enter()
                .append('option')
                    .attr('value',d => d)
                    .on('click', )
                        
            })
        

        this.createNarration(sceneNumber)

    }
    createNarration(sceneNumber) {

        if (sceneNumber != '7'){
            this.d3.select('#narration_year')
            .text(`The Year is ${narrations[sceneNumber].year}`)
        }
        else {
            this.d3.select('#narration_year')
            .text(`${narrations[sceneNumber].year}`)

        }


        this.d3.select("#narration_text")
            .text(narrations[sceneNumber].desc)
    }



}