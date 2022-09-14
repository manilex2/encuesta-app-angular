import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrentUserState, currentUserFeatureKey } from '../reducers/currentuser.reducers';

export const selectCurrentUser = createFeatureSelector<CurrentUserState>(currentUserFeatureKey);

export const currentUser = createSelector(
  selectCurrentUser,
  (selectCurrentUser) => selectCurrentUser.currentUser
)
