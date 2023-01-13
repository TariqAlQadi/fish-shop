import { SWRConfig } from "swr";
import Head from "../components/Head";
import GlobalStyle from "../styles";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <SWRConfig value={{ fetcher }}>
        <Head />
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}
