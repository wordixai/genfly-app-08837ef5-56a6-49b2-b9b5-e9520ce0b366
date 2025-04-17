import { PassportMode } from "@/components/passport/PassportMode";
import { useTranslation } from "react-i18next";

export default function PassportPage() {
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">{t('passport.title')}</h1>
      <PassportMode />
    </div>
  );
}