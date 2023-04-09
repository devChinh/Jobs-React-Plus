/**
Thư mục types trong ReactJS thường được
sử dụng để định nghĩa các kiểu dữ liệu, các hằng số, các 
enum hoặc các interface cho các đối tượng hoặc component trong ứng dụng
 */

interface User {
  id: string;
  lastName: string;
  firstName: string;
  age: number;
}

export interface UsersState {
  data: null | User[];
  isLoading: boolean;
  error: null | string | any;
}