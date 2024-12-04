import { AuthContextProvider } from "./_utils/auth-context";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Petopia",
  description: "Find your perfect pet companion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
