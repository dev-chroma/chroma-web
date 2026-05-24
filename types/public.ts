export interface NewsletterPayload {
  email: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface PublicResponse {
  message: string;
}
