// Product image mapping — keys stored in DB, resolved to import paths at build time
import performanceBottle from "@assets/io2-performance-bottle.png";
import canOriginal from "@assets/io2-can-original.jpg";
import nightlifeShot from "@assets/io2-nightlife-shot.png";
import brainBoost from "@assets/io2-brain-boost.png";
import varietyPack from "@assets/io2-variety-pack.png";

const imageMap: Record<string, string> = {
  "io2-performance-bottle": performanceBottle,
  "io2-can": canOriginal,
  "io2-nightlife-shot": nightlifeShot,
  "io2-brain-boost": brainBoost,
  "io2-variety-pack": varietyPack,
};

export function getProductImage(imageUrl: string | null | undefined): string | undefined {
  if (!imageUrl) return undefined;
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http")) return imageUrl;
  // Look up in our map
  return imageMap[imageUrl] || undefined;
}
