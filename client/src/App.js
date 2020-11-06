import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Upload from './components/Upload/Upload';
import Home from './components/Home/Home';
import Video from './components/Video/Video';
import { NavLink } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const routes = (
      <Switch>
        <Route path='/home' exact component={Home} />
        <Route path='/home/:videoId' exact component={Video} />
        <Route path='/' exact component={Upload} />
        <Redirect to='/' />
      </Switch>
    );

    return (
      <React.Fragment>
        <ToastContainer />
        <section className='header'>
          <ul className='navigation-items'>
            <li className='navigation-item'>
              <NavLink to='/home' exact>
                Home
              </NavLink>
            </li>
            <li className='navigation-item'>
              <NavLink to='/' exact>
                Upload
              </NavLink>
            </li>
          </ul>
        </section>
        {routes}
      </React.Fragment>
    );
}

export default App;
