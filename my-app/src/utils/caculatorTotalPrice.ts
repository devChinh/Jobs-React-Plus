/**
 folder : utils dùng để xử lý các logic được dùng nhiều trong các component
 */

// Hàm tính tổng giá trị sản phẩm trong giỏ

export const calculateTotalPrice = (cartItems: number[]) => {
  return cartItems.reduce(
    (accumulator: number, currentProduct: any) =>
      accumulator + currentProduct.price * currentProduct.quantity,
    0
  );
};
