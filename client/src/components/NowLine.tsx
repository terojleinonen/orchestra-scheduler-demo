import { useEffect, useState } from "react"

const START_HOUR = 8

function getCurrentOffset() {

  const now = new Date()

  const minutes =
    now.getHours() * 60 + now.getMinutes()

  const startOffset = START_HOUR * 60

  return minutes - startOffset

}

export default function NowLine() {

  const [offset, setOffset] =
    useState(getCurrentOffset())

  useEffect(() => {

    const interval = setInterval(() => {
      setOffset(getCurrentOffset())
    }, 60000)

    return () => clearInterval(interval)

  }, [])

  if (offset < 0) return null

  return (

    <div
      className="nowLine"
      style={{ top: offset }}
    />

  )

}