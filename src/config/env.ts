import dotenv from "dotenv";

dotenv.config();

class EnvConfig {
  public port: string | undefined;
  public app_name: string | undefined;
  public node_env: string | undefined;
  public client_url: string | undefined;
  public sender_email: string | undefined;
  public sender_email_password: string | undefined;
  public rabbitmq_endpoint: string | undefined;
  public elastic_search_url: string | undefined;

  constructor() {
    this.port = process.env.PORT || "";
    this.app_name = process.env.APP_NAME || "";
    this.node_env = process.env.NODE_ENV || "";
    this.client_url = process.env.CLIENT_URL || "";
    this.sender_email = process.env.SENDER_EMAIL || "";
    this.sender_email_password = process.env.SENDER_EMAIL_PASSWORD || "";
    this.rabbitmq_endpoint = process.env.RABBITMQ_ENDPOINT || "";
    this.elastic_search_url = process.env.ELASTIC_SEARCH_URL || "";
  }
}

export const envConfig: EnvConfig = new EnvConfig();
