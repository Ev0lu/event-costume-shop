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


interface CodeData {
    recipient: string, 
    code: string,
    linkId: string
}


export async function getCategories(language: string) {
    return await fetchApiResponse(`items/categories?language=${language}`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

export async function getManufacturers(category_id: string, language: string, offset?: number, startswith?: string) {
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


export async function getEvents(language: string, offset?: number, startswith?: string) {
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


export async function sendForm(data: FormData) {
    return await fetchApiResponse(`user/processForm`, {
      method: 'POST',
      body: data
    })
  }


interface PhoneData {
    recipient: string, 
    linkId: string,
    validate: boolean
}


export async function searchCostume(language: string, startswith?: string) {
    return await fetchApiResponse(`catalog/search/categories?language=${language}&startswith=${startswith ? startswith : ''}&limit=5`, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }