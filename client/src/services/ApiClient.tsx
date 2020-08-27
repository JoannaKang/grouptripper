const routingApiUrl =
  process.env.REACT_APP_ROUTING_API_URL || 'https://api.openrouteservice.org';
const routingApiKey =
  process.env.REACT_APP_ROUTING_API_KEY || 'yourSecretKeyShouldNotBeHere';

const reqRoute = {
  LatLng: [
    [-0.09, 51.505],
    [-0.1068, 51.51258],
  ],
  profile: 'driving-car',
  format: 'geojson',
};

const ApiClient = {
  getRoute: (
    endpoint: string,
    reqBodyString: string
  ): Promise<GeoJSON.FeatureCollection> => {
    return fetch(
      // 'localhost',
      `${routingApiUrl}/v2/directions/${reqRoute.profile}/${reqRoute.format}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json; charset=utf-8',
          Accept:
            'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          Authorization: routingApiKey,
        },
        body: reqBodyString,
      }
    ).then((res) => res.json());
  },
};

export default ApiClient;

const defaultApiUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

type clientOptions<T> = {
  apiBaseUrl?: string;
  data?: T;
  accessToken?: string;
  queryParams?: QueryParams;
};

export function client<T, P = T>(
  endpoint: string,
  {
    apiBaseUrl = defaultApiUrl,
    data,
    accessToken,
    queryParams = {},
    ...options
  }: clientOptions<T> & RequestInit = {}
): Promise<P> {
  const headers = new Headers();
  if (data) headers.append('Content-Type', 'application/json');
  if (accessToken) headers.append('Authorization', `Bearer ${accessToken}`);

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers,
    ...options,
  };

  const queryString = queryParamsToString(queryParams);

  const request = new Request(
    encodeURI(`${apiBaseUrl}/${endpoint}${queryString}`),
    config
  );

  return window.fetch(request).then(async (response) => {
    try {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    } catch (e) {
      return Promise.reject(e);
    }
  });
}

type QueryParams = {
  [key: string]: string;
};

const queryParamsToString: (queryParams: QueryParams) => string = (
  queryParams
) => {
  const queryString = Object.entries(queryParams).reduce(
    (queryString, [key, value]) => {
      return queryString + `${key}=${value}`;
    },
    ''
  );

  return queryString ? `?${queryString}` : '';
};
