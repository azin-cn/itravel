interface Locations {
  lat: number;
  lng: number;
}

interface FormattedAddresses {
  recommend: string;
  rough: string;
}

interface AddressComponent {
  nation: string;
  province: string;
  city: string;
  district: string;
  street: string;
  street_number: string;
}

interface AdInfoLocation {
  lat: number;
  lng: number;
}

interface AdInfo {
  nation_code: string;
  adcode: string;
  phone_area_code: string;
  city_code: string;
  name: string;
  location: AdInfoLocation;
  nation: string;
  province: string;
  city: string;
  district: string;
}

interface GeocodeResult {
  location: Locations;
  address: string;
  formatted_addresses: FormattedAddresses;
  address_component: AddressComponent;
  ad_info: AdInfo;
}
