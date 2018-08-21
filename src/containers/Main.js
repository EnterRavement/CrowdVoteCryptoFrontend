import React, { Component } from "react";
import { Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CryptotileBox from "./cryptotilesbox";
import DetailsPage from "../containers/Details2";
import NotFound from "../components/404NotFound";
import { GetDetailRoutes } from "../store/actions/DetailRoutes";
import { fetchCryptoStats } from "../store/actions/cryptostats";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { TransitionGroup } from "react-transition-group";
import Switch from "react-router-transition-switch";
import cookiepolicy from "../components/CookieConsent";

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      DetailRoutes: []
    };
  }
  componentWillMount() {
    if (this.props.cryptos.length < 1) {
      this.props.fetchCryptoStats().then(res => {
        let DetailRoutes = this.props.cryptos.map(val => {
          return (
            <Route
              key={val.id}
              path={"/" + val.name.toLowerCase().replace(/\s/g, "-")}
              render={props => (
                <DetailsPage symbol={val.symbol} name={val.name} />
              )}
            />
          );
        });
        this.setState({ DetailRoutes });
      });
    }
  }

  render() {
    const { location } = this.props;

    return (
      <div className="container">
        <TransitionGroup>
          <Switch key={location.key} location={location}>
            <Route exact path="/" component={CryptotileBox} />
            {this.state.DetailRoutes}
            <Route path="/cookie-policy" component={cookiepolicy} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route component={NotFound} />
          </Switch>
        </TransitionGroup>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cryptos: state.cryptodata
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      GetDetailRoutes,
      fetchCryptoStats
    }
  )(Main)
);
