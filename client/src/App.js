// import logo from './logo.svg';
import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,

} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
import NavBar from "./components/views/NavBar/NavBar"
import Footer from "./components/views/Footer/Footer"
import VideoUploadPage from './components/views/VideoUploadPage/VideoUploadPage'
import VideoDetailPage from './components/views/VideoDetailPage/VideoDetailPage'
import SubscriptionPage from './components/views/SubscriptionPage/SubscriptionPage'
import Auth from './hoc/auth'

function App() {
  return (
    <Router>
      <NavBar />
      <div>


        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* <Route exact path="/">
            <LandingPage />
          </Route> */}
          {/* // null 누구나
          // false 비회원
          // true 회원 */}

          {/* 깔끔하게는 이렇게 */}
          <Route exact path="/" component={Auth(LandingPage, null)} />

          <Route path="/login" component={Auth(LoginPage, false)} />

          <Route path="/register" component={Auth(RegisterPage, false)} />

          <Route path="/video/upload" component={Auth(VideoUploadPage, true)} />

          <Route path="/video/:videoId" component={Auth(VideoDetailPage, null)} />

          <Route path="/subscription" component={Auth(SubscriptionPage, null)} />



        </Switch>
      </div>
      <Footer />
    </Router >
  );
}


export default App;
