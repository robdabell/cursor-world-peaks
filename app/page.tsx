import { Atlas } from "@/components/Atlas";
import { LocalAtlas } from "@/components/LocalAtlas";

export default function Home() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <LocalAtlas />;
  }
  return <Atlas />;
}
