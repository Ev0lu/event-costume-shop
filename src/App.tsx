import './App.css'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'

import { MainCatalog } from './pages/main-catalog/main-catalog'
import { Fabricator } from './pages/fabricators/fabricators'
import { FabricatorDetails } from './pages/fabricators_details/fabricators_details'
import '../src/shared/translator/i18n';
import { Event } from './pages/event/event'
import { EventPage } from './pages/event-page/event-page'
import { ContactInformation } from './pages/contact-information/contact-information'
import { AdminLogin } from './pages/admin-login/admin-login'
import { AdminAd } from './pages/admin-ad/admin-ad'
import { AdminApplications } from './pages/admin-application/admin-application'
import { AdminCostumes } from './pages/admin-costumes/admin-costumes'
import { AdminEvents } from './pages/admin-events/admin-events'
import { AdminManufactures } from './pages/admin-manufactures/admin-manufactures'
import { Categories } from './pages/categories/categories'
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'
import { getCSRF, refreshToken } from './shared/api'

export const setToken = (tokenName: string, newToken: string | null) => {
  if (newToken) {
    const decoded = jwtDecode(newToken)
    Cookies.set(tokenName, newToken, {
      expires: decoded.exp,
    })
    return
  }
  Cookies.remove(tokenName)
}

export const getToken = (tokenName: string) => Cookies.get(tokenName)

export const isTokenExpired = (tokenName: string) => {
  const token = getToken(tokenName)
  if (!token) return true
  const decoded = jwtDecode(token)
  const timeLeft = (decoded.exp ?? 0) - Date.now() / 1000
  return timeLeft < 15
}


function App() {
  
  const getCsrfToken = async () => {
    if (sessionStorage.getItem('csrf_token')){

    } else {
      const response = await getCSRF()
      const data = await response.json()
      console.log(data)
      sessionStorage.setItem('csrf_token', data.csrf_token)
    }

  }

  const sessionLoader = async () => {
    getCsrfToken()
    if (isTokenExpired('access')) {
        const token = getToken('refresh'); 
        const data = {
          "refresh_token": token
        }
        const response = await refreshToken(data, sessionStorage.getItem('csrf_token') || '')
        if (response.ok) {
          const data = await response.json();
          setToken('access', data.accessToken)
          setToken('refresh', data.refreshToken)  
        } else {
          return redirect('/admin/login')
        }
      }
    return true
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainCatalog />
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
      path: "/admin/login",
      element: <AdminLogin />
    },
    {
      path: "/admin/",
      loader: sessionLoader,
      element: <AdminAd />
    },
    {
      path: "/admin/manufactures",
      loader: sessionLoader,
      element: <AdminManufactures />
    },
    {
      path: "/admin/applications",
      loader: sessionLoader,
      element: <AdminApplications />
    },
    {
      path: "/admin/events",
      loader: sessionLoader,
      element: <AdminEvents />
    },
    {
      path: "/admin/costumes",
      loader: sessionLoader,
      element: <AdminCostumes />
    },
    {
      path: "/admin/categories",
      loader: sessionLoader,
      element: <Categories />
    },
  ], { basename: '/' })


  return (
      <RouterProvider router={router} />
  )
}

export default App


