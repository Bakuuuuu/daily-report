const store = {
  state: {
    num: 20
  },
  actionNames: {},
  actions: {
    add(state: { num: number }, action: { type: string, value: any }) {
      state.num += action.value
    },
    add1(state: { num: number }, action: { type: string, value: any }) {
      state.num += 10
    }
  },
  asyncActions: {
    asyncAdd(dispatch: Function) {
      setTimeout(() => {
        dispatch({ type: 'add', value: 3 })
      }, 1000)
    }

  },
}
let actionNames = {}
for (let key in store.actions) {
  actionNames[key] = key
}
store.actionNames = actionNames
export default store