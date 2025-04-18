import { Provider } from "@/utils/provider";
import localFont from "next/font/local";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";
const GIP = localFont({
  src: [
    {
      path: "./fonts/GIP-Thin.woff",
      weight: "300",
    },
    {
      path: "./fonts/GIP-Regular.woff",
      weight: "400",
    },
    {
      path: "./fonts/GIP-Medium.woff",
      weight: "500",
    },
    {
      path: "./fonts/GIP-SemiBold.woff",
      weight: "600",
    },
    {
      path: "./fonts/GIP-Bold.woff",
      weight: "700",
    },
    {
      path: "./fonts/GIP-ExtraBold.woff",
      weight: "800",
    },
    {
      path: "./fonts/GIP-Black.woff",
      weight: "900",
    },
    {
      path: "./fonts/GIP-Heavy.woff",
      weight: "1000",
    },
  ],
  variable: "--font-gip",
});

export const metadata = {
  title: "Hire.mn - Админ",
  description: "Powered by Axiom Inc.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${GIP.variable} antialiased overscroll-y-none`}>
          <AntdRegistry>{children}</AntdRegistry>
        </body>
      </Provider>
    </html>
  );
}
