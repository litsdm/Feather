// @flow
import * as React from 'react';

import AppHeader from '../components/AppHeader';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;

  render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <AppHeader />
        {children}
      </React.Fragment>
    );
  };
}
