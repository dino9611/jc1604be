const INITIAL_STATE = {
  id: 0,
  isLogin: false,
  username: "",
  isverified: 0,
  cart: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload, isLogin: true };
    default:
      return state;
  }
};
