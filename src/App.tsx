import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MainCatalog } from './pages/main-catalog/main-catalog'
import { Fabricator } from './pages/fabricators/fabricators'
import { FabricatorDetails } from './pages/fabricators_details/fabricators_details'
import '../src/shared/translator/i18n';
import { AdminNavbar } from './pages/admin/admin-navbar/admin-navbar';
import { Event } from './pages/event/event'
import { EventPage } from './pages/event-page/event-page'
import { ContactInformation } from './pages/contact-information/contact-information'
function App() {
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainCatalog />
    },
    {
      path: '/stats',
      //loader: sessionLoader,
      element: (
          <AdminNavbar />
      )
    },
    {
      path: '/manufacturers/:manufacturer_id',
      //loader: sessionLoader,
      element: (
          <Fabricator />
      )
    },
    {
      path: '/manufacturers/:manufacturer_id/:manufacturer_id_description',
      //loader: sessionLoader,
      element: (
          <FabricatorDetails />
      )
    },
    {
      path: '/event',
      //loader: sessionLoader,
      element: (
          <Event />
      )
    },
    {
      path: '/event/:event_id',
      //loader: sessionLoader,
      element: (
          <EventPage />
      )
    },
    {
      path: '/contacts',
      //loader: sessionLoader,
      element: (
          <ContactInformation />
      )
    },
    {
      path: '/admin/login',
      //loader: sessionLoader,
      element: (
          <ContactInformation />
      )
    },
  ], { basename: '/' })


  return (
      <RouterProvider router={router} />
  )
}

export default App
