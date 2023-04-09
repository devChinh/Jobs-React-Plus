/**
là một thư mục tổ chức mã nguồn của bạn để chứa các tính năng chính của 
ứng dụng của bạn. Thư mục này có thể chứa các component, hàm xử lý logic
 và các file liên quan đến tính năng đónhư "đăng nhập", "tìm kiếm sản 
phẩm", "thanh toán", "giỏ hàng", vv. 
 */

import React from "react";

const LoginForm = () => (
  <form>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>
);

const LoginButton = ({ onClick }: any) => (
  <button onClick={onClick}>Login</button>
);

export { LoginForm, LoginButton };
