// src/constant/project.ts
import type { GroupedOption } from "../components/type/projectType";

export const PROJECT_FILTER_OPTION: GroupedOption[] = [
  {
    group: 'STATUS',
    type: 'checkbox',
    options: ['Active', 'Completed']
  },
  {
    group: 'PROJECT NAME',
    type: 'checkbox',
    options: ['Product Color Annotation 2', 'Product Color Annotation 5']
  },
];

export const PROJECT_FILTER_DATE: GroupedOption[] = [
  {
    group: 'DATE',
    type: 'radio',
    options: ['Today', 'This week', 'This month', 'This year', 'Last 7 days', 'Last 30 days', 'Custom']
  }
];

export const BATCH_FILTER_OPTION: GroupedOption[] = [
  {
    group: 'STATUS',
    type: 'checkbox',
    options: ['on_track', 'at_risk', 'overdue']
  },
  {
    group: 'BATCH NAME',
    type: 'checkbox',
    options: ['Batch 1', 'Batch 2', 'Batch 3']
  },
];