export interface SendEmailDTO {
  template: string;
  receiver: string;
  locals: EmailLocals;
}

export interface EmailLocals {
  sender?: string;
  app_link: string;
  app_icon: string;
  offer_link?: string;
  amount?: string;
  buyer_username?: string;
  seller_username?: string;
  title?: string;
  description?: string;
  delivery_days?: string;
  order_id?: string;
  order_due?: string;
  requirements?: string;
  order_url?: string;
  original_date?: string;
  new_date?: string;
  reason?: string;
  subject?: string;
  header?: string;
  type?: string;
  message?: string;
  service_fee?: string;
  total?: string;
  username?: string;
  verify_link?: string;
  reset_link?: string;
  otp?: string;
}
