import "@/styles/globals.css";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "next-themes";
import type { Metadata } from "next";
import type { AppProps } from "next/app";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Iroha",
  description: "",
};

const themeList: string[] = ["light", "dark"];

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider themes={themeList}>
        <main className={roboto.className}>
          <div className="bg-base-100">
            <div className="mx-auto max-w-screen-xl px-2">
              <Component {...pageProps} />
            </div>
          </div>
        </main>
      </ThemeProvider>
    </>
  );
}
