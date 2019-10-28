import {
  ADD_LINK,
  REQUEST_LINKS,
  RECEIVE_LINKS,
  REMOVE_LINK,
  REMOVE_LINK_BY_ID
} from '../actions/link';

const initialState = {
  isFetching: false,
  links: []
};

export default function counter(
  state = initialState,
  { type, link, links, index, insertIndex, id }
) {
  switch (type) {
    case ADD_LINK: {
      const newLinks =
        insertIndex !== null
          ? [
              ...state.links.slice(0, insertIndex),
              link,
              ...state.links.slice(insertIndex)
            ]
          : [...state.links, link];

      return {
        ...state,
        links: newLinks
      };
    }

    case REQUEST_LINKS:
      return {
        ...state,
        isFetching: true
      };

    case RECEIVE_LINKS:
      return {
        ...state,
        links: [...links, ...state.links],
        isFetching: false
      };

    case REMOVE_LINK:
      return {
        ...state,
        links: [...state.links.slice(0, index), ...state.links.slice(index + 1)]
      };

    case REMOVE_LINK_BY_ID:
      return {
        ...state,
        links: state.links.filter(({ _id }) => _id !== id)
      };

    default:
      return state;
  }
}
