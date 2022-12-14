import { Dispatch } from 'redux'
import { ActionType } from '../action-types'
import { Action } from '../actions'
import { saveCells } from '../action-creators'
import { RootState } from '../reducers'

export const persistMiddleware = ({
  dispatch,
  getState,
}: {
  dispatch: Dispatch<Action>
  getState: () => RootState
}) => {
  let timer: any
  // TODO: There is something wrong with the debouncing logic. Fix it.
  return (next: (action: Action) => void) => {
    return (action: Action) => {
      next(action)

      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL,
          ActionType.DELETE_CELL,
          ActionType.INSERT_CELL_AFTER,
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer)
        }

        timer = setTimeout(() => {
          saveCells()(dispatch, getState)
        }, 250)
      }
    }
  }
}
