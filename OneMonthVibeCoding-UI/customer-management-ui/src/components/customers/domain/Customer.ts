export interface Customer {
  clientId: number;
  clientFirstName: string;
  clientLastName: string;
  prefferName: string;
  dateofBirth: string; // ISO date string
  createBy: string;
  createDate: string; // ISO date string
  updateBy: string;
  updateDate: string; // ISO date string
  isDeleted?: boolean;
}
