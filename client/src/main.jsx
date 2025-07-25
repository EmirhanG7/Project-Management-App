import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import './index.css';
import {Provider} from "react-redux";
import {store} from "./store";
import {Toaster} from "@/components/ui/sonner.js";

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter
    future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}
  >
    <Provider store={store}>
      <Toaster/>
      <App/>
    </Provider>
  </BrowserRouter>
);