/**
thường được sử dụng để chứa các thư viện (library) hoặc các module chung, có thể được 
sử dụng trong nhiều nơi trong ứng dụng 
*/

import axios from "axios";
export const axiosCustom = axios.create();
