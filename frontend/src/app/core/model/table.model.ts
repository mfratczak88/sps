export type Column = {
  name: string;
  translation: string;
  sortable?: boolean;
  link?: string;
};
export type OnButtonClick = (data: any) => void;
export type Button = {
  icon: string;
  onClick: OnButtonClick;
} & Column;
