
import { useState } from 'react';
import { TextField, FormControlLabel, Switch, IconButton, Tooltip, Alert }from '@mui/material';
import './App.css';
import List from './components/List';
import { getData, generateRequestPattern, getValidatedData } from './helpers/utils';
import { ContentCopy, ContentPaste } from '@mui/icons-material';

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
    window.localStorage.setItem(source, JSON.stringify(data));
  }

  const pattern = generateRequestPattern(modules, fileTypes, domains, subdomains, modulesPath, rootDomain, https);

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
    const data = {
      modules,
      fileTypes,
      domains,
      subdomains,
      modulesPath,
      systemModulesPath,
      rootDomain,
      https
    };
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
      [
        'modules',
        'fileTypes',
        'domains',
        'subdomains',
        'modulesPath',
        'systemModulesPath',
        'rootDomain',
        'https',
      ].forEach((key) => setData(key, res[key]));

      const message = done ?
        'Paste from clipboard was successful!' :
        'Pasting from clipboard went through with some gaps!';

      showAlert(message, done ? 'success' : 'warning');

    }).catch(catchError);
  }

  const alertControl = alert.message ? <Alert variant="filled" severity={alert.severity}>
    {alert.message}
  </Alert> : '';

  return (
    <div className="app">
      <header>
        <div className='header-logo'>
          Fiddler regex generator
        </div>
        <Tooltip title="Copy All">
          <IconButton  onClick={() => copyAll()}><ContentCopy color="secondary"/></IconButton>
        </Tooltip>
        <Tooltip title="Paste">
          <IconButton  onClick={() => paste()}><ContentPaste color="secondary"/></IconButton>
        </Tooltip>
      </header>
      <main>
        <div className='app-settings'>
          <div className='app-settings-left'>
            <TextField
              label="Modules root path"
              variant="outlined"
              size="small"
              value={modulesPath}
              onChange={(event) => setData('modulesPath', event.target.value)}
            />
            <div className='app-settings-input-separator'></div>
            <TextField
              label="File system modules root"
              variant="outlined"
              size="small"
              value={systemModulesPath}
              onChange={(event) => setData('systemModulesPath', event.target.value)}
            />
          </div>
          <div className='app-settings-right'>
            <TextField
              label="Root Domain"
              variant="outlined"
              size="small"
              value={rootDomain}
              onChange={(event) => setData('rootDomain', event.target.value)}
            />
            <div className='app-settings-input-separator'></div>
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

        <div className='app-settings-lists'>
          <div className='app-settings-list-item app-settings-list-item-base'>
            <List items={modules.items} title={modules.title} setData={(data) => setData('modules', data)}/>
          </div>
          <div className='app-settings-list-item app-settings-list-item-base'>
            <List items={fileTypes.items} title={fileTypes.title} setData={(data) => setData('fileTypes', data)}/>
          </div>
          <div className='app-settings-list-item app-settings-list-item-base'>
            <List items={domains.items} title={domains.title} setData={(data) => setData('domains', data)}/>
          </div>
          <div className='app-settings-list-item app-settings-list-item-base'>
            <List items={subdomains.items} title={subdomains.title} setData={(data) => setData('subdomains', data)}/>
          </div>
          {/* fake elements */}
          <div className='app-settings-list-item-base'></div>
          <div className='app-settings-list-item-base'></div>
        </div>

        <div className='result'>
          <div className='result-row'>
            <div className='result-title'>Pattern:</div>
            <div className='result-text'>
              {pattern}
            </div>
            <Tooltip title="Copy Pattern">
              <IconButton  onClick={() => copy(pattern)}><ContentCopy color="action"/></IconButton>
            </Tooltip>
          </div>
          <div className='result-row'>
            <div className='result-title'>File path:</div>
            <div className='result-text'>
              {systemModulesPath}\$3\$4
            </div>
            <Tooltip title="Copy file path">
              <IconButton onClick={() => copy(`${systemModulesPath}\\$3\\$4`)}><ContentCopy color="action"/></IconButton>
            </Tooltip>
          </div>
        </div>
      </main>
      <div className='alert'>
        {alertControl}
      </div>
      <footer>
        GitHub: gagikpog
      </footer>
    </div>
  );
}
