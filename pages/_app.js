import '../styles/globals.css'

import { initYandexMetrika } from '../src/helpers/yandexMetrika';
import { isClient } from '../src/helpers/utils';

if (isClient()) {
  initYandexMetrika();
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
