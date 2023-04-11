import handleUser from './index'

let reducer = (state = { ...handleUser.state }, action: { type: string, value: any }) => {
  let newState = JSON.parse(JSON.stringify(state))
  for (let key in handleUser.actionNames) {
    if (action.type === handleUser.actionNames[key]) {
      handleUser.actions[handleUser.actionNames[key]](newState, action)
      break;
    }
  }
  return newState
}
export default reducer
