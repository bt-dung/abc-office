import "./globals.css";
import "./globals.scss";

export const metadata = {
  title: "ABC Office | Đăng nhập",
  description: "Giao diện đăng nhập chi tiết cho hệ thống quản trị ABC Office.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
