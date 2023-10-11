import React, {useEffect, useState} from "react";
import {Route, Switch} from "react-router-dom";
import NavBar from "./components/NavBar";
import Logo from "./components/Logo";
import Search from "./components/search/Search";
import AllGames from "./components/search/AllGames";
import AllReviews from "./components/search/AllReviews";
import Game from "./components/pages/Game";
import Review from "./components/pages/Review";
import List from "./components/pages/List";
import MyCorner from "./components/pages/MyCorner";

function App() {
  return (
    <>
      <NavBar />
      <Logo />
      <Switch>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/search/all-games">
          <AllGames />
        </Route>
        <Route path="/search/all-reviews">
          <AllReviews />
        </Route>
        <Route path="/games/:id">
          <Game />
        </Route>
        <Route path="/reviews/:id">
          <Review />
        </Route>
        <Route path="/lists/:id">
          <List />
        </Route>
        <Route exact path="/">
          <MyCorner />
        </Route>
        <Route path="*">
          <h1>404 Not Found</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;