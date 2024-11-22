import { legacy_createStore as createStore,applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./components/redux/reducers/main"; 

const Middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...Middleware))
);

export default store;

