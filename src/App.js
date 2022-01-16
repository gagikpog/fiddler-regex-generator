
import { useState } from 'react';
import './App.css';
import List from './components/List';

const defaultData = {
  modules: {
    title: 'Modules',
    items: []
  },
  fileTypes: {
    title: 'File Types',
    items: []
  },
  domains: {
    title: 'Domains',
    items: []
  },
  subdomains: {
    title: 'Subdomains',
    items: []
  },
  modulesPath: '',
  rootDomain: '',
  systemModulesPath: '',
  https: true
}

function getData(key) {
  const dataStr = window.localStorage.getItem(key);
  let res = null;
  try {
    if (dataStr) {
      res = JSON.parse(dataStr);
    }
  } catch (error) {
    res = null;
  }

  return res || defaultData[key];
}

export default function App(props) {

  const [modules, setModules] = useState(() => getData('modules'));
  const [fileTypes, setFileTypes] = useState(() => getData('fileTypes'));
  const [domains, setDomains] = useState(() => getData('domains'));
  const [subdomains, setSubdomains] = useState(() => getData('subdomains'));

  const setData = (source, data) => {
    const setter = {
      modules: setModules,
      fileTypes: setFileTypes,
      domains: setDomains,
      subdomains: setSubdomains
    }[source];

    setter(data);
    window.localStorage.setItem(source, JSON.stringify(data));
  }

  return (
    <div className="app">
      <header>header</header>
      <main>
        <div className='app-settings'>
          <div className='app-settings-left'>
            <label className='app-settings-label'>Modules root path</label>
            <input></input>
            <label className='app-settings-label'>File system modules root</label>
            <input></input>
          </div>
          <div className='app-settings-right'>
            <label className='app-settings-label'>Root Domain</label>
            <input></input>
            <div>
              <label>HTTPS</label>
              <input className='app-settings-label' type="checkbox"></input>
            </div>
          </div>
        </div>

        <div className='app-settings-lists'>
          <div className='app-settings-list-item'>
            <List items={modules.items} title={modules.title} setData={(data) => setData('modules', data)}/>
          </div>
          <div className='app-settings-list-item'>
            <List items={fileTypes.items} title={fileTypes.title} setData={(data) => setData('fileTypes', data)}/>
          </div>
          <div className='app-settings-list-item'>
            <List items={domains.items} title={domains.title} setData={(data) => setData('domains', data)}/>
          </div>
          <div className='app-settings-list-item'>
            <List items={subdomains.items} title={subdomains.title} setData={(data) => setData('subdomains', data)}/>
          </div>
          {/* fake elements */}
          <div className='app-settings-list-item'></div>
          <div className='app-settings-list-item'></div>
        </div>

        <div className='result'>

        </div>
      </main>
      <footer>
        footer
      </footer>
    </div>
  );
}
