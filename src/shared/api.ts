const apiUrl: string = 'https://costumier.pro/api/v1/' 

export async function fetchApi<T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${apiUrl}${path}`, init)
        return await response.json()
  }

  export async function fetchApiResponse(
    path: string,
    init?: RequestInit,
  ) {
    const response = await fetch(`${apiUrl}${path}`, init)
    return response
  }

export async function getCategoriesUser(language: string) {
    return await fetchApiResponse(`items/categories?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

export async function getManufacturersUser(category_id: string, language: string, offset?: number, startswith?: string) {
    return await fetchApiResponse(`catalog/manufacturers?category_id=${category_id}&language=${language}&offset=${offset}&startswith=${startswith ? startswith : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

export async function getManufactureDescription(category_id: string, language: string) {
    return await fetchApiResponse(`catalog/manufacturers/${category_id}?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }


export async function getEventsUser(language: string, offset?: number, startswith?: string) {
    return await fetchApiResponse(`catalog/events?language=${language}&offset=${offset}&startswith=${startswith ? startswith : ''}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

export async function getEventDescription(category_id: string, language: string) {
    return await fetchApiResponse(`catalog/events/${category_id}?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }


export async function getAd(ad_placement: string) {
    return await fetchApiResponse(`catalog/ads/ad?ad_placement=${ad_placement}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }


export async function sendForm(data: FormData, csrfToken: string) {
    return await fetchApiResponse(`user/processForm`, {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken, 
      },
      body: data
    })
  }

export async function searchCostume(language: string, startswith?: string) {
    return await fetchApiResponse(`catalog/search/categories?language=${language}&startswith=${startswith ? startswith : ''}&limit=5`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }
  
  export async function Authorize(data: any, csrfToken: string) {
      return await fetchApiResponse(`auth/login`, {
        
          method: 'POST',
          body: data.toString(),
          headers: {
              'x-csrf-token': csrfToken, 
              'accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            },
      })
    }
  
  interface Refresh {
      refresh_token: string | undefined, 
  }
  
  export async function refreshToken(data: Refresh, csrfToken: string) {
      return await fetchApiResponse(`auth/refreshToken`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'x-csrf-token': csrfToken, 
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
  
      })
    }
  
  export async function getAds(ad_placement: string, offset: string | number, accessToken: string | null | undefined) {
      return await fetchApiResponse(`admin/ads?ad_placement=${ad_placement}&offset=${offset}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  
  export async function getAdById(ad_placement: string, accessToken: string | null | undefined) {
      return await fetchApiResponse(`admin/ads/${ad_placement}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  export async function deleteAd(ad_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/ads/${ad_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'DELETE'
      })
    }
  
  
  export async function patchAd(data: FormData, ad_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/ads/${ad_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 

          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: data
      })
    }
  
  export async function createAd(data: FormData, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/ads/create`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'POST',
        body: data
      })
    }
  
  
  
  export async function getCategories(language: string) {
      return await fetchApiResponse(`items/categories?language=${language}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    }
  
  export async function getManufacturers(accessToken: string | undefined | null, category_id: string, language: string, offset?: number, status?: string, startswith?: string) {
      return await fetchApiResponse(`admin/manufacturers?category_id=${category_id}&language=${language}&offset=${offset}&status=${status === 'pending' ? 'pending' : 'accepted'}&startswith=${startswith ? startswith : ''}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  export async function getManufacturerById(accessToken: string | undefined | null, manufacturer_id: string, language: string) {
      return await fetchApiResponse(`admin/manufacturers/${manufacturer_id}?language=${language}`, {
        headers: {

          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  export async function deleteManufacturerApplication(manufacturer_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/manufacturers/${manufacturer_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'DELETE'
      })
    }
  
  interface manufacturerData {
      status: string
  }
  
  
  export async function patchManufacturerApplication(data: manufacturerData, ad_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/manufacturers/${ad_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: JSON.stringify(data)
      })
    }
  
  
  export async function patchManufacturer(data: FormData, ad_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/manufacturers/${ad_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: data
      })
    }
  
  export async function createManufacturer(data: FormData, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/manufacturers/create`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'POST',
        body: data
      })
    }
  
  
  
  export async function getEvents(accessToken: string | undefined | null, language: string, offset?: number, startswith?: string) {
      return await fetchApiResponse(`admin/events?language=${language}&offset=${offset}&startswith=${startswith ? startswith : ''}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  export async function getEventById(event_id: string, accessToken: string | undefined | null, language: string) {
      return await fetchApiResponse(`admin/events/${event_id}?language=${language}`, {
        headers: {
          'accept': 'application/json',

          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  
  export async function deleteEvent(event_id: string, accessToken: string | undefined | null, csrfToken: string) {
      return await fetchApiResponse(`admin/events/${event_id}`, {
        headers: {
          'accept': 'application/json',
          'x-csrf-token': csrfToken, 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'DELETE'
      })
    }
  
  
  export async function patchEvent(data: FormData, event_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/events/${event_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: data
      })
    }
  
  export async function createEvent(data: FormData, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/events/create`, {
        headers: {
          'x-csrf-token': csrfToken, 

          'Authorization': `Bearer ${accessToken}`
        },
        method: 'POST',
        body: data
      })
    }
  
  
    export async function getCostumes(accessToken: string | undefined | null, language: string, offset?: number) {
      return await fetchApiResponse(`admin/costumes?language=${language}&offset=${offset}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      })
    }
  
  export async function deleteCostume(event_id: string, accessToken: string | undefined | null, csrfToken: string) {
      return await fetchApiResponse(`admin/costumes/${event_id}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'DELETE'
      })
    }
  
  
  export async function patchCostume(data: any, event_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/costumes/${event_placement}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: JSON.stringify(data)
      })
    }
  
  export async function createCostume(data: any, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`admin/costumes/create`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
  
          'Authorization': `Bearer ${accessToken}`,
          'x-csrf-token': csrfToken, 
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  
  
  export async function deleteCategory(event_id: string, accessToken: string | undefined | null, csrfToken: string) {
      return await fetchApiResponse(`items/categories/${event_id}`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'DELETE'
      })
    }
  
  
  export async function patchCategory(data: any, event_placement: string, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`items/categories/${event_placement}`, {
        headers: {
          'x-csrf-token': csrfToken, 
          'Authorization': `Bearer ${accessToken}`
        },
        method: 'PATCH',
        body: data
      })
    }
  
  export async function createCategory(data: any, accessToken: string | null | undefined, csrfToken: string) {
      return await fetchApiResponse(`items/categories/create`, {
        headers: {
  
          'Authorization': `Bearer ${accessToken}`,
          'x-csrf-token': csrfToken, 
        },
        method: 'POST',
        body: data
      })
    }
  

export async function getCSRF() {
      return await fetchApiResponse(`csrf`, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
    }