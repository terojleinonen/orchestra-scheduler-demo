import type { ScheduleEvent } from "@scheduler/shared";

export interface PositionedEvent extends ScheduleEvent {
  lane: number;
  laneCount: number;
}

function overlaps(a: ScheduleEvent, b: ScheduleEvent): boolean {
  return new Date(a.start).getTime() < new Date(b.end).getTime() &&
    new Date(b.start).getTime() < new Date(a.end).getTime();
}

export function layoutEvents(events: ScheduleEvent[]): PositionedEvent[] {
  const sorted = [...events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const clusters: ScheduleEvent[][] = [];
  let currentCluster: ScheduleEvent[] = [];
  let currentClusterEnd = -Infinity;

  for (const event of sorted) {
    const start = new Date(event.start).getTime();
    const end = new Date(event.end).getTime();

    if (currentCluster.length === 0 || start < currentClusterEnd) {
      currentCluster.push(event);
      currentClusterEnd = Math.max(currentClusterEnd, end);
    } else {
      clusters.push(currentCluster);
      currentCluster = [event];
      currentClusterEnd = end;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  const positioned: PositionedEvent[] = [];

  for (const cluster of clusters) {
    const lanes: ScheduleEvent[][] = [];
    const clusterPositions: PositionedEvent[] = [];

    for (const event of cluster) {
      let assignedLane = -1;

      for (let laneIndex = 0; laneIndex < lanes.length; laneIndex += 1) {
        const lane = lanes[laneIndex];
        const last = lane[lane.length - 1];
        if (!overlaps(last, event)) {
          lane.push(event);
          assignedLane = laneIndex;
          break;
        }
      }

      if (assignedLane === -1) {
        lanes.push([event]);
        assignedLane = lanes.length - 1;
      }

      clusterPositions.push({
        ...event,
        lane: assignedLane,
        laneCount: 1
      });
    }

    const laneCount = Math.max(lanes.length, 1);
    clusterPositions.forEach((event) => {
      event.laneCount = laneCount;
    });

    positioned.push(...clusterPositions);
  }

  return positioned;
}
