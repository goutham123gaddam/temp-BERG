import type { GroupedOption } from "../components/type/projectType";

export const PROJECT_FILTER_OPTION: GroupedOption[]= [
  {
    group: 'STATUS',
    type: 'checkbox',
    options: ['Active', 'Inactive']
  },
  {
    group: 'PROJECT NAME',
    type: 'checkbox',
    options: ['Vista Project', 'Amazon Project', 'Google Project', 'Xamnet ENT', 'Polaris Derby']
  },

];

export const PROJECT_FILTER_DATE: GroupedOption[] = [
  {
    group: 'DATE',
    type: 'radio',
    options: ['Today', 'This week', 'This month', 'This year', 'Last 7 days', 'Last 30 days', 'Custom']
  }
];


export const BATCH_FILTER_OPTION: GroupedOption[]= [
  {
    group: 'STATUS',
    type: 'checkbox',
    options: ['Active', 'Inactive']
  },
  {
    group: 'PROJECT NAME',
    type: 'checkbox',
    options: ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4', 'Batch 4']
  },

];