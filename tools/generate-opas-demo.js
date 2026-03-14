const fs = require("fs")

const productions = [
  {
    title: "Mahler Symphony No.2",
    composer: "Gustav Mahler",
    conductor: "Anna Virtanen"
  },
  {
    title: "Brahms Symphony No.1",
    composer: "Johannes Brahms",
    conductor: "Marco Rossi"
  },
  {
    title: "Beethoven Symphony No.7",
    composer: "Ludwig van Beethoven",
    conductor: "Elena Kovacs"
  },
  {
    title: "Tchaikovsky Symphony No.5",
    composer: "Pyotr Tchaikovsky",
    conductor: "David Chen"
  }
]

const venues = [
  "Main Hall",
  "Studio A",
  "Studio B"
]

const serviceTypes = [
  "rehearsal",
  "sectional",
  "dress rehearsal",
  "concert"
]

function random(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

function addDays(date,days){
  const d = new Date(date)
  d.setDate(d.getDate()+days)
  return d
}

function formatDate(date){

  const y = date.getFullYear()
  const m = String(date.getMonth()+1).padStart(2,"0")
  const d = String(date.getDate()).padStart(2,"0")

  return `${y}-${m}-${d}`

}

let xml = `
<opasExport generated="2026-01-01">
  <season year="2026">
    <productions>
`

let serviceCounter = 1

productions.forEach((prod,pIndex)=>{

  xml += `
  <production id="P${pIndex+1}">
    <title>${prod.title}</title>
    <composer>${prod.composer}</composer>
    <conductor>${prod.conductor}</conductor>

    <services>
`

  for(let i=0;i<20;i++){

    const date = addDays(new Date("2026-03-01"), i)

    const startTimes = ["09:00","13:00","19:00"]

    const type = random(serviceTypes)

    xml += `
      <service id="S${serviceCounter++}">
        <type>${type}</type>
        <date>${formatDate(date)}</date>
        <start>${random(startTimes)}</start>
        <duration>${type==="concert"?120:150}</duration>
        <venue>${random(venues)}</venue>
      </service>
`

    if(type==="rehearsal"){

      xml += `
      <service id="S${serviceCounter++}">
        <type>sectional</type>
        <section>strings</section>
        <date>${formatDate(date)}</date>
        <start>09:00</start>
        <duration>120</duration>
        <venue>Studio A</venue>
      </service>
`

      xml += `
      <service id="S${serviceCounter++}">
        <type>sectional</type>
        <section>brass</section>
        <date>${formatDate(date)}</date>
        <start>09:00</start>
        <duration>120</duration>
        <venue>Studio B</venue>
      </service>
`

    }

  }

  xml += `
    </services>
  </production>
`

})

xml += `
    </productions>
  </season>
</opasExport>
`

fs.writeFileSync("server/src/data/demo-opas.xml", xml)

console.log("Demo OPAS XML generated.")