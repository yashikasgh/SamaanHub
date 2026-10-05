export function getOptimizedImageUrl(url: string | null, width?: number): string | null {
  if (!url) return null;
  
  if (url.includes('res.cloudinary.com')) {
    // Inject optimization parameters
    // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234/id
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const transforms = ['f_auto', 'q_auto'];
      if (width) transforms.push(`w_${width}`);
      return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }
  }
  
  return url;
}
