import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import AuthProvider from './contexts/auth';
import reportWebVitals from './reportWebVitals';
import 'react-toastify/dist/ReactToastify.css';


const queryClient = new QueryClient()


ReactDOM.render(
  <QueryClientProvider client={queryClient}>

    <AuthProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>

        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
