import type { ImageSourcePropType } from "react-native";

export type PromotionalBanner = {
  id: number;
  title: string;
  bannerImage: ImageSourcePropType;
  detailImage: ImageSourcePropType;
};

export const PROMOTIONAL_BANNERS: PromotionalBanner[] = [
  {
    id: 1,
    title: "INSTALL 1.1.1.1 FOR A FASTER EXPERIENCE",
    bannerImage: require("@/assets/Banner_20251209170621lke3.jpg"), 
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },
  {
    id: 2,
    title: "CHICKEN ROAD 2",
    bannerImage: require("@/assets/Banner_20250812180341sv9g.jpg"),
    detailImage:require("@/assets/ashu.png"),
  },
  {
    id: 3,
    title: "Cummulative 10Days Recharge Bonus",
    bannerImage: require("@/assets/Banner_20250728144118et9j.jpg"),
    detailImage:require("@/assets/ashu2.png"),
  },
  {
    id: 4,
    title: "Tutorial AR Wallet How To Buy & Sell ARB Coins",
    bannerImage: require("@/assets/Banner_202508190055411etn.png"),
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },
  {
    id: 5,
    title: "Member First Deposit Bonus",
    bannerImage: require("@/assets/Banner_20250324130803du5l.jpg"),
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },
  {
    id: 6,
    title: "AGENT REFFERAL BONUS",
    bannerImage: require("@/assets/Banner_2025031913463468d9.jpg"),
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },
  {
    id: 7,
    title: "REFFERAL BONUS",
    bannerImage: require("@/assets/Banner_20250319134140rpj6.jpg"),
    detailImage:require("@/assets/asss.png"),
  },
  {
    id: 8,
    title: "RECHARGE BONUS FOR NEW PLAYERS",
    bannerImage: require("@/assets/Banner_20250324130748d4lf.jpg"),
    detailImage:require("@/assets/asss.png"),
  },
  {
    id: 9,
    title: "7-DAYS CUMULATIVE BETTING REWARDS",
    bannerImage: require("@/assets/Banner_202505051626178ysv.png"),
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },
  {
    id: 10,
    title: "MINI GAMES DAILY MISSION REWARDS",
    bannerImage: require("@/assets/Banner_20250505174559l35y.jpg"),
    detailImage:require("@/assets/editor_20251209174449kmw6.png"),
  },  
  {
    id: 11,
    title: "Benefits of Using AR WALLET",
    bannerImage: require("@/assets/Banner_20250509160039hucu.jpg"),
    detailImage:require("@/assets/ashu45.png"),
  },
];

export function getPromotionalBannerById(
  id: number,
): PromotionalBanner | undefined {
  return PROMOTIONAL_BANNERS.find((b) => b.id === id);
}
