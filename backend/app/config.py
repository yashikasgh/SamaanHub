from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str
    jwt_secret: str
    jwt_expire_minutes: int = 480
    cors_origins: str = "http://localhost:5173"
    admin_email: str = ""
    admin_password: str = ""
    shopify_store_domain: str = ""
    shopify_api_version: str = "2025-10"
    shopify_client_id: str = ""
    shopify_client_secret: str = ""
    shopify_access_token: str = ""
    wc_base_url: str = ""
    wc_consumer_key: str = ""
    wc_consumer_secret: str = ""
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""

settings = Settings()
