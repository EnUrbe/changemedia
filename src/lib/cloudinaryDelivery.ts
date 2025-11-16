export interface DeliveryOptions {
  cloudName: string;
  publicId: string;
  transformation?: string;
  version?: string | number;
  deliveryType?: string;
}

export function buildCloudinaryUrl({
  cloudName,
  publicId,
  transformation,
  version,
  deliveryType = "image",
}: DeliveryOptions) {
  const safePublicId = publicId.replace(/^\/+/, "");
  const segments = ["https://res.cloudinary.com", cloudName, deliveryType, "upload"];
  if (transformation) {
    segments.push(transformation);
  }
  if (version) {
    segments.push(`v${version}`);
  }
  segments.push(safePublicId);
  return segments.join("/");
}
