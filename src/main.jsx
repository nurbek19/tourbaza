import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import './index.css'
import App from './App.jsx'
import OwnerAdvertisementsList from './pages/OwnerAdvertisementsList.jsx'
import CreateAdvertisement from './pages/CreateAdvertisement.jsx'
import UserSearchPage from './pages/UserSearchPage.jsx';
import PartnerPage from './pages/PartnerPage.jsx';

WebApp.ready();


const router = createBrowserRouter([
  {
    path: "/tourbaza/",
    element: <App />,
    children: [
      {
        path: "/tourbaza/",
        element: <CreateAdvertisement />,
      },
      {
        path: "/tourbaza/my-tours",
        element: <OwnerAdvertisementsList />,
      },
      {
        path: "/tourbaza/search",
        element: <UserSearchPage />,
      },
      {
        path: "/tourbaza/partner",
        element: <PartnerPage />
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
