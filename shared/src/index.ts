export interface ScheduleEvent {
  id: string;
  orchestra: string;
  title: string;
  conductor: string;
  equipment: string;
  category: string;
  start: string;
  end: string;
  year: number;
  month: number;
  week: number;
  date: string;
  weekday: string;
}

export interface ScheduleMeta {
  orchestra: string;
  availableYears: number[];
  availableMonthsByYear: Record<string, number[]>;
}

export interface ScheduleApiResponse {
  meta: ScheduleMeta;
  events: ScheduleEvent[];
}

export interface WeekApiResponse {
  meta: ScheduleMeta;
  year: number;
  week: number;
  events: ScheduleEvent[];
}
