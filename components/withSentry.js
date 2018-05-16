import React from "react";
import Raven from "raven-js";
const dev = process.env.NODE_ENV !== "production";

function withSentry(Child) {
  return class WrappedComponent extends React.Component {
    static getInitialProps(context) {
      if (Child.getInitialProps) {
        return Child.getInitialProps(context);
      }
      return {};
    }
    constructor(props) {
      super(props);
      this.state = {
        error: null
      };
      if (!dev) {
        Raven.config(
          "https://2c77ccb753274fac9e62c5f441fda415@sentry.io/1190322"
        ).install();
      }
    }

    componentDidCatch(error, errorInfo) {
      if (!dev) {
        this.setState({ error });
        Raven.captureException(error, { extra: errorInfo });
      }
    }

    render() {
      return <Child {...this.props} error={this.state.error} />;
    }
  };
}

export default withSentry;
