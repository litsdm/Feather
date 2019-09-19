import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func } from 'prop-types';
import { linkShape } from '../shapes';

import { fetchLinksIfNeeded, deleteLink } from '../actions/link';

import Links from '../components/Links';
import Loader from '../components/Loader';
import Empty from '../components/Links/Empty';

const mapStateToProps = ({ link: { links, isFetching } }) => ({
  links,
  isFetching
});

const mapDispatchToProps = dispatch => ({
  fetchLinks: () => dispatch(fetchLinksIfNeeded()),
  removeLink: link => dispatch(deleteLink(link))
});

const LinksPage = ({ links, fetchLinks, isFetching, removeLink }) => {
  useEffect(() => {
    fetchLinks();
  }, []);

  const renderLinks = () =>
    links.length > 0 ? (
      <Links links={links} removeLink={removeLink} />
    ) : (
      <Empty />
    );

  return isFetching ? <Loader /> : renderLinks();
};

LinksPage.propTypes = {
  isFetching: bool.isRequired,
  links: arrayOf(linkShape),
  fetchLinks: func.isRequired,
  removeLink: func.isRequired
};

LinksPage.defaultProps = {
  links: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksPage);
