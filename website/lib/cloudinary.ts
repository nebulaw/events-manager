export const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/edjango-events/image/upload";

export function cloudinaryLoader({ src, width, height, quality }: { src: string, width: number, height?: number, quality?: string }) {
  const imageExtracted = src.substring(src.lastIndexOf("/") + 1);
  const params = ['f_auto', 'c_limit', `w_${width}`, `h_${height || width}`, `q_${quality || 'auto'}`]
  // return `https://res.cloudinary.com/edjango-events/${params.join(',')}/${src}`
  return `${CLOUDINARY_BASE_URL}/${params.join(",")}/${imageExtracted}`
}