const store = {
  state: {
    userInfo: {}
  },
  actionNames: {},
  actions: {
    login(state: { userInfo: object }, action: { type: string, value: any }) {
      state.userInfo = action.value
    }
  },
  asyncActions: {
    asyncLogin(dispatch: Function) {
      dispatch({ type: 'login', value: {} })
    },
  },
}
let actionNames = {}
for (let key in store.actions) {
  actionNames[key] = key
}
store.actionNames = actionNames
export default store