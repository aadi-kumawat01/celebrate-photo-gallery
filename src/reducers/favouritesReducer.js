export const favouriteActions = {
  add: 'ADD_FAVOURITE',
  remove: 'REMOVE_FAVOURITE',
}

export function favouritesReducer(state, action) {
  switch (action.type) {
    case favouriteActions.add:
      if (state.includes(action.photoId)) {
        return state
      }

      return [...state, action.photoId]

    case favouriteActions.remove:
      return state.filter((photoId) => photoId !== action.photoId)

    default:
      return state
  }
}
