import { PeakDetail } from "@/components/PeakDetail";
import { LocalPeakDetail } from "@/components/LocalPeakDetail";

export default async function PeakPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <LocalPeakDetail slug={slug} />;
  }
  return <PeakDetail slug={slug} />;
}
