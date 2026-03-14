export default function TimeColumn() {

  const hours = Array.from(
    { length: 14 },
    (_, i) => i + 8
  )

  return (

    <div className="timeColumn">

      {hours.map(hour => (

        <div
          key={hour}
          className="timeCell"
        >

          {String(hour).padStart(2, "0")}:00

        </div>

      ))}

    </div>

  )

}