export function readField(
  obj: any,
  fieldNames: string[]
) {

  for (const name of fieldNames) {

    if (obj && obj[name] !== undefined) {
      return obj[name]
    }

  }

  return undefined

}