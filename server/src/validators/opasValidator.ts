export function validateService(service: any) {

  if (!service)
    throw new Error("Service missing")

  if (!service.date)
    throw new Error("Service missing date")

  if (!service.start)
    throw new Error("Service missing start time")

}