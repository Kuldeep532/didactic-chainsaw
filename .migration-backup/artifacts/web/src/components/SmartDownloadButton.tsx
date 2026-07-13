import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, ExternalLink } from "lucide-react";

const APK_FALLBACK = {
  nexus_plus: "https://github.com/Kuldeep532/refactored-octo-couscous/releases/download/latest/nexus-plus.apk",
  geeta_nexus: "https://github.com/Kuldeep532/refactored-octo-couscous/releases/download/latest/geeta-nexus.apk",
};

const PACKAGE_NAMES = {
  nexus_plus: "com.nexuswavetech.nexusplus",
  geeta_nexus: "com.nexuswavetech.geetanexus",
};

export default function SmartDownloadButton({ app }: { app: "nexus_plus" | "geeta_nexus" }) {
  const [device, setDevice] = useState<"ios" | "android" | "desktop">("desktop");
  const [triggered, setTriggered] = useState(false);
  const packageName = PACKAGE_NAMES[app];
  const apkUrl = APK_FALLBACK[app];

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) setDevice("ios");
    else if (/android/.test(ua)) setDevice("android");
  }, []);

  const handleClick = () => {
    setTriggered(true);
    if (device === "ios") {
      // App Store search by package identifier (best effort)
      window.location.href = `https://apps.apple.com/search?term=${encodeURIComponent(packageName)}`;
    } else if (device === "android") {
      // Try native OEM app store intents first
      const intents = [
        // Samsung Galaxy Store
        `intent://details?id=${packageName}#Intent;scheme=samsungapps;package=com.sec.android.app.samsungapps;end`,
        // Huawei AppGallery
        `appmarket://details?id=${packageName}`,
        // Xiaomi GetApps
        `mimarket://details?id=${packageName}`,
        // Oppo App Market
        `oppomarket://details?package_name=${packageName}`,
        // Vivo App Store
        `vivomarket://details?id=${packageName}`,
        // Amazon Appstore
        `amzn://apps/android?p=${packageName}`,
        // Fallback: Google Play search
        `market://details?id=${packageName}`,
      ];

      // Try each intent in sequence via hidden iframe trick
      let attempt = 0;
      const tryNext = () => {
        if (attempt >= intents.length) {
          // All failed, fallback to APK download
          window.location.href = apkUrl;
          return;
        }
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = intents[attempt];
        document.body.appendChild(iframe);
        attempt++;
        setTimeout(() => {
          document.body.removeChild(iframe);
          tryNext();
        }, 600);
      };
      tryNext();
    } else {
      // Desktop: show QR or direct APK download
      window.open(apkUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button onClick={handleClick} disabled={triggered} size="lg" className="font-medium">
        <Smartphone className="w-4 h-4 mr-2" aria-hidden="true" />
        {device === "ios" ? "Open in App Store" : device === "android" ? "Get App" : "Download APK"}
      </Button>
      <a href={apkUrl} target="_blank" rel="noopener noreferrer" onClick={() => setTriggered(true)}>
        <Button variant="outline" size="lg">
          <Download className="w-4 h-4 mr-2" aria-hidden="true" />
          Direct APK
        </Button>
      </a>
      <Button variant="ghost" size="sm" asChild>
        <a href={`https://github.com/Kuldeep532/refactored-octo-couscous/releases`} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="w-4 h-4 mr-1" aria-hidden="true" />
          All Releases
        </a>
      </Button>
    </div>
  );
}
