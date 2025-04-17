import { PremiumPlans } from "@/components/premium/PremiumPlans";
import { useTranslation } from "react-i18next";

export default function PremiumPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">{t('premium.upgrade')}</h1>
      <PremiumPlans />
    </div>
  );
}