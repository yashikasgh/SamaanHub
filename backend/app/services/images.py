import hashlib
import cloudinary
import cloudinary.uploader
from ..config import settings

def configured() -> bool:
    return bool(settings.cloudinary_cloud_name and settings.cloudinary_api_key and settings.cloudinary_api_secret)

def upload(url: str) -> str | None:
    """Upload a remote image to Cloudinary. Returns the public_id, or None if Cloudinary isn't configured."""
    if not configured():
        return None
    cloudinary.config(cloud_name=settings.cloudinary_cloud_name, api_key=settings.cloudinary_api_key,
                      api_secret=settings.cloudinary_api_secret, secure=True)
    pid = hashlib.sha1(url.encode()).hexdigest()[:24]
    res = cloudinary.uploader.upload(url, public_id=pid, folder="catalogforge", overwrite=False, resource_type="image")
    return res["public_id"]

def base_url(public_id: str) -> str:
    return f"https://res.cloudinary.com/{settings.cloudinary_cloud_name}/image/upload/{public_id}"
