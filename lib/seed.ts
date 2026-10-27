import prisma from "@/lib/prisma";

export const allowedCountries = [
  "Bénin",
  "Cameroun",
  "Côte d'Ivoire",
  "Burkina Faso",
  "Niger",
];

export async function ensureSeedData() {
  const count = await prisma.appSetting.count();
  if (count === 0) {
    const defaultProducts = [
      { name: "Station Total Énergie 2K", label: "2 000 FCFA", amount: 2000, dailyReturn: 300, totalReturn: 54000, durationDays: 180, color: "#f7c948", imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 5K", label: "5 000 FCFA", amount: 5000, dailyReturn: 800, totalReturn: 144000, durationDays: 180, color: "#1c8f4b", imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 15K", label: "15 000 FCFA", amount: 15000, dailyReturn: 2400, totalReturn: 432000, durationDays: 180, color: "#ef8f17", imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 35K", label: "35 000 FCFA", amount: 35000, dailyReturn: 5600, totalReturn: 1008000, durationDays: 180, color: "#f0a500", imageUrl: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 50K", label: "50 000 FCFA", amount: 50000, dailyReturn: 8500, totalReturn: 1530000, durationDays: 180, color: "#1d3557", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 100K", label: "100 000 FCFA", amount: 100000, dailyReturn: 17000, totalReturn: 3060000, durationDays: 180, color: "#2a9d8f", imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80" },
      { name: "Station Total Énergie 250K", label: "250 000 FCFA", amount: 250000, dailyReturn: 45000, totalReturn: 8100000, durationDays: 180, color: "#e63946", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80" },
    ];

    await prisma.investmentProduct.createMany({
      data: defaultProducts,
    });

    const defaultSettings = [
      { key: "paymentLink", value: "https://payliv.shop/pay/plv_rkermm7f-" },
      { key: "telegramLink", value: "https://t.me/+74TGsMBlIwwyYTI0" },
      { key: "telegramSupportLink", value: "https://t.me/+avYieGqPfUtlNDI0" },
      { key: "referralRate1", value: "25" },
      { key: "referralRate2", value: "3" },
      { key: "referralRate3", value: "2" },
      { key: "withdrawalFeePercent", value: "15" },
      { key: "minWithdrawal", value: "800" },
      { key: "allowedCountries", value: JSON.stringify(allowedCountries) },
      { key: "logoText", value: "Total Énergie" },
      { key: "infoPopupTitle", value: "INFORMATION" },
      { key: "popupText", value: JSON.stringify([
        "Inscrivez-vous maintenant et recevez 500 FCFA gratuitement.",
        "Invitez vos amis à investir et gagnez 25% / 3% / 2% sur 3 niveaux.",
        "Les rendements sont versés automatiquement chaque jour pendant 180 jours.",
        "Investissez dès 2 000 FCFA et commencez à gagner dès le lendemain."
      ]) }
    ];

    await prisma.appSetting.createMany({ data: defaultSettings });
  }
}

export async function getSettings() {
  await ensureSeedData();
  const settings = await prisma.appSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return {
    paymentLink: map.paymentLink ?? "https://payliv.shop/pay/plv_rkermm7f-",
    telegramLink: map.telegramLink ?? "https://t.me/+74TGsMBlIwwyYTI0",
    telegramSupportLink: map.telegramSupportLink ?? "https://t.me/+avYieGqPfUtlNDI0",
    referralRate1: Number(map.referralRate1 ?? "25"),
    referralRate2: Number(map.referralRate2 ?? "3"),
    referralRate3: Number(map.referralRate3 ?? "2"),
    withdrawalFeePercent: Number(map.withdrawalFeePercent ?? "15"),
    minWithdrawal: Number(map.minWithdrawal ?? "800"),
    allowedCountries: JSON.parse(map.allowedCountries ?? JSON.stringify(allowedCountries)),
    logoText: map.logoText ?? "Total Énergie",
    popupTitle: map.infoPopupTitle ?? "INFORMATION",
    popupText: JSON.parse(map.popupText ?? JSON.stringify([
      "Inscrivez-vous maintenant et recevez 500 FCFA gratuitement.",
      "Invitez vos amis à investir et gagnez 25% / 3% / 2% sur 3 niveaux.",
      "Les rendements sont versés automatiquement chaque jour pendant 180 jours.",
      "Investissez dès 2 000 FCFA et commencez à gagner dès le lendemain."
    ])),
  };
}

export async function getProducts() {
  await ensureSeedData();
  return prisma.investmentProduct.findMany({
    where: { active: true },
    orderBy: { amount: "asc" },
  });
}

export async function createNotification(userId: string, title: string, message: string) {
  await prisma.notification.create({
    data: {
      userId,
      title,
      message,
    },
  });
}
