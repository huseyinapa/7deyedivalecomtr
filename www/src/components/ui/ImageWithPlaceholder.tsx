"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export default function ImageWithPlaceholder({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  sizes,
  placeholder = "empty",
  blurDataURL,
}: ImageWithPlaceholderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Basit bir blur placeholder base64
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHBEf/EABUBAQEAAAAAAAAAAAAAAAAAAAAAAAAB/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 text-gray-400">
            <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-xs">Görsel yüklenemedi</p>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          priority={priority}
          loading={priority ? "eager" : loading}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          style={{
            objectFit: "cover",
            transition: "opacity 0.3s ease-in-out",
            opacity: isLoading ? 0 : 1,
          }}
        />
      )}
    </div>
  );
}
