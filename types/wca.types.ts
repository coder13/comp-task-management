export interface WCAUser {
  id: string;
  name: string;
  email: string;
  avatar: {
    url: string;
    thumb_url: string;
  };
  country_iso2: string;
  delegate_status: string;
}
