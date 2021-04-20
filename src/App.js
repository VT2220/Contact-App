import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//PAGES
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import EditContact from "./pages/EditContact";
//REDUX
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/registration" component={Registration} />
          <Route exact path="/" component={Login} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/editcontact/:id" component={EditContact} />
          <Route component={Login} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
