export type RowData = {
  name: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
};

export type Column = {
  key: keyof RowData;
  label: string;
  align?: 'left' | 'right' | 'center';
};
