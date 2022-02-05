
import Head from 'next/head'
import { useState } from 'react';
import { TextField, FormControlLabel, Switch, IconButton, Tooltip, Alert, Link }from '@mui/material';
import styles from '../styles/App.module.css';
import List from '../src/components/List';
import {
  getData,
  generateRequestPattern,
  getValidatedData,
  defaultData,
  listFields,
  simpleFields,
  isClient
} from '../src/helpers/utils';
import { ContentCopy, ContentPaste, RestartAlt } from '@mui/icons-material';

export default function App(props) {

  const [modules, setModules] = useState(() => getData('modules'));
  const [fileTypes, setFileTypes] = useState(() => getData('fileTypes'));
  const [domains, setDomains] = useState(() => getData('domains'));
  const [subdomains, setSubdomains] = useState(() => getData('subdomains'));
  const [modulesPath, setModulesPath] = useState(() => getData('modulesPath'));
  const [systemModulesPath, setSystemModulesPath] = useState(() => getData('systemModulesPath'));
  const [rootDomain, setRootDomain] = useState(() => getData('rootDomain'));
  const [https, setHttps] = useState(() => getData('https'));

  const [alert, setAlert] = useState(() => ({message: '', severity: 'success'}));

  const appSettingsListItemClasses = `${styles['app-settings-list-item']} ${styles['app-settings-list-item-base']}`;

  const setData = (source, data) => {
    const setter = {
      modules: setModules,
      fileTypes: setFileTypes,
      domains: setDomains,
      subdomains: setSubdomains,
      modulesPath: setModulesPath,
      systemModulesPath: setSystemModulesPath,
      rootDomain: setRootDomain,
      https: setHttps
    }[source];

    setter(data);
    if (isClient()) {
      window.localStorage.setItem(source, JSON.stringify(data));
    }
  }

  const { pattern, filesPath } =
    generateRequestPattern(modules, fileTypes, domains, subdomains, modulesPath, rootDomain, https, systemModulesPath);

  const showAlert = (message, severity, delay = 4000) => {
    setAlert({ message, severity });
    setTimeout(() => {
      setAlert({ message: '', severity: 'success' });
    }, delay);
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showAlert('Copying to clipboard was successful!', 'success');
    }).catch(() => {
      showAlert('Could not copy text', 'error');
    });
  }

  const copyAll = () => {
    const data = { modules, fileTypes, domains, subdomains, modulesPath, systemModulesPath, rootDomain, https };
    copy(JSON.stringify(data, null, 2));
  }

  const paste = () => {
    const catchError = () => showAlert('Could not paste text', 'error');;

    navigator.clipboard.readText().then((text) => {
      return text;
    }).then((text) => {
      return JSON.parse(text || '');
    }).then((data) => {
      const {res, done} = getValidatedData(data);
      [...listFields, ...simpleFields].forEach((key) => setData(key, res[key]));

      const message = done ?
        'Paste from clipboard was successful!' :
        'Pasting from clipboard went through with some gaps!';

      showAlert(message, done ? 'success' : 'warning');

    }).catch(catchError);
  }

  const resetAll = () =>{
    [...listFields, ...simpleFields].forEach((key) => setData(key, defaultData[key]));
    localStorage.clear();
    showAlert('Reset success', 'success');
  };

  const alertControl = alert.message ? <Alert variant="filled" severity={alert.severity}>
    {alert.message}
  </Alert> : '';

  return (
    <div className={styles.app}>
      <Head>
        <link rel="icon" href="/f-favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="-FBEZCX9HvkJukBI3Zg3qUiql7Z85yLF7WQvrWY2WFc" />
        <meta name="yandex-verification" content="dcdcd457fb53fada" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Fiddler regex generator" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        {/*
          manifest.json provides metadata used when your web app is installed on a
          user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
        */}
        <link rel="manifest" href="/manifest.json" />
        <title>Regex generator</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.logo}>
          Fiddler regex generator
        </div>
        <Tooltip title="Reset all">
          <IconButton  onClick={() => resetAll()}><RestartAlt color="secondary"/></IconButton>
        </Tooltip>
        <Tooltip title="Copy All">
          <IconButton  onClick={() => copyAll()}><ContentCopy color="secondary"/></IconButton>
        </Tooltip>
        <Tooltip title="Paste">
          <IconButton  onClick={() => paste()}><ContentPaste color="secondary"/></IconButton>
        </Tooltip>
      </header>
      <main className={styles.main}>
        <div className={styles['app-settings']}>
          <div className={styles['app-settings-left']}>
            <TextField
              label="Modules root path"
              variant="outlined"
              size="small"
              value={modulesPath}
              onChange={(event) => setData('modulesPath', event.target.value)}
            />
            <div className={styles['app-settings-input-separator']}></div>
            <TextField
              label="File system modules root"
              variant="outlined"
              size="small"
              value={systemModulesPath}
              onChange={(event) => setData('systemModulesPath', event.target.value)}
            />
          </div>
          <div className={styles['app-settings-right']}>
            <TextField
              label="Root Domain"
              variant="outlined"
              size="small"
              value={rootDomain}
              onChange={(event) => setData('rootDomain', event.target.value)}
            />
            <div className={styles['app-settings-input-separator']}></div>
            <FormControlLabel
              control={
                <Switch
                  checked={https}
                  onChange={(event) => setData('https', event.target.checked)}
                />
                }
              label="HTTPS"
            />
          </div>
        </div>

        <div className={styles['app-settings-lists']}>
          <div className={appSettingsListItemClasses}>
            <List items={modules.items} title={modules.title} setData={(data) => setData('modules', data)}/>
          </div>
          <div className={appSettingsListItemClasses}>
            <List items={fileTypes.items} title={fileTypes.title} setData={(data) => setData('fileTypes', data)}/>
          </div>
          <div className={appSettingsListItemClasses}>
            <List items={domains.items} title={domains.title} setData={(data) => setData('domains', data)}/>
          </div>
          <div className={appSettingsListItemClasses}>
            <List items={subdomains.items} title={subdomains.title} setData={(data) => setData('subdomains', data)}/>
          </div>
          {/* fake elements */}
          <div className={styles['app-settings-list-item-base']}></div>
          <div className={styles['app-settings-list-item-base']}></div>
        </div>

        <div className={styles.result}>
          <div className={styles['result-row']}>
            <div className={styles['result-title']}>Pattern:</div>
            <div className={styles['result-text']}>
              {pattern}
            </div>
            <Tooltip title="Copy Pattern">
              <IconButton  onClick={() => copy(pattern)}><ContentCopy color="action"/></IconButton>
            </Tooltip>
          </div>
          <div className={styles['result-row']}>
            <div className={styles['result-title']}>File path:</div>
            <div className={styles['result-text']}>
              {filesPath}
            </div>
            <Tooltip title="Copy file path">
              <IconButton onClick={() => copy(filesPath)}><ContentCopy color="action"/></IconButton>
            </Tooltip>
          </div>
        </div>
      </main>
      <div className={styles.alert}>
        {alertControl}
      </div>
      <footer className={styles.footer}>
        <Link href="https://github.com/gagikpog/fiddler-regex-generator" color="inherit" target="_blank">
          GitHub: gagikpog
        </Link>
      </footer>

      {/* Yandex.Metrika counter */}
      <noscript>
        <div>
          <img src="https://mc.yandex.ru/watch/87380093" alt="" className={styles.ym} />
        </div>
        </noscript>
    </div>
  );
}
