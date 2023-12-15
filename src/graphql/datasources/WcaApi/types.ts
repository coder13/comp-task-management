import { EventId } from '@wca/helpers';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  scope: string;
  created_at: number;
}

export interface ProfileResponse {
  me: User;
}

export interface Competition {
  class: 'competition';
  id: string;
  name: string;
  information: string;
  venue: string;
  contact: string;
  registration_open: string;
  registration_close: string;
  use_wca_registration: boolean;
  announced_at: string;
  base_entry_fee_lowest_denomination: number;
  currency_code: string;
  start_date: string;
  end_date: string;
  enable_donations: boolean;
  competitor_limit: number;
  extra_registration_requirements: string;
  on_the_spot_registration: boolean;
  on_the_spot_entry_fee_lowest_denomination: number | null;
  refund_policy_percent: number;
  refund_policy_limit_date: string;
  guests_entry_fee_lowest_denomination: number;
  qualification_results: boolean;
  external_registration_page: string;
  event_restrictions: boolean;
  cancelled_at: string | null;
  waiting_list_deadline_date: string;
  event_change_deadline_date: string;
  guest_entry_status: string;
  allow_registration_edits: boolean;
  allow_registration_self_delete_after_acceptance: boolean;
  allow_registration_without_qualification: boolean;
  guests_per_registration_limit: number | null;
  force_comment_in_registration: boolean;
  url: string;
  website: string;
  short_name: string;
  city: string;
  venue_address: string;
  venue_details: string;
  latitude_degrees: number;
  longitude_degrees: number;
  country_iso2: string;
  event_ids: EventId[];
  registration_opened?: boolean;
  main_event_id: string;
  number_of_bookmarks: number;
  using_stripe_payments?: boolean | null;
  uses_qualification?: boolean;
  uses_cutoff?: boolean;
  delegates: User[];
  organizers: User[];
  tabs: Tab[];
}

export interface User {
  class: 'User';
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  delegate_status: DelegateStatus | null;
  wca_id: string;
  gender: 'f' | 'm' | 'o' | null;
  country_iso2: string;
  url: string;
  country: Coutnry;
  teams: any[];
  avatar: Avatar;
}

export interface Coutnry {
  id: string;
  name: string;
  continentId: string;
  iso2: string;
}

export interface Avatar {
  url: string;
  pending_url: string;
  thumb_url: string;
  is_default: boolean;
}

export interface Tab {
  id: number;
  competition_id: string;
  name: string;
  content: string;
  display_order: number;
}

enum DelegateStatus {
  Full = 'delegate',
  Trainee = 'trainee_delegate',
  Candidate = 'candidate_delegate',
  Senior = 'senior_delegate',
}
