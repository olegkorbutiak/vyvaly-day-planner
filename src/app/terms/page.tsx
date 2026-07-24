import Link from "next/link";

export const metadata = {
  title: "Умови використання — My Perfect Day Planner",
};

export default function TermsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-6 pb-10">
      <Link
        href="/"
        className="mb-4 font-condensed text-xs font-bold uppercase tracking-wide text-brand-green underline underline-offset-2"
      >
        ← На головну
      </Link>

      <h1 className="font-condensed text-xl font-bold uppercase tracking-wide text-brand-text">
        Умови використання
      </h1>
      <p className="mt-1 text-xs text-brand-muted">
        My Perfect Day Planner · Останнє оновлення: 24.07.2026
      </p>

      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-brand-text">
        <section>
          <p>
            Використовуючи «My Perfect Day Planner» (далі — «Застосунок»), ви погоджуєтесь з
            наведеними нижче умовами.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            1. Опис сервісу
          </h2>
          <p className="mt-1">
            Застосунок надає безкоштовний персональний планувальник задач із голосовим/AI
            розпізнаванням дат та опціональною синхронізацією з Google Calendar.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            2. Використання «як є»
          </h2>
          <p className="mt-1">
            Застосунок надається «як є», без гарантій безперебійної роботи. Розробник не несе
            відповідальності за втрату даних, пропущені нагадування чи неточності
            AI-розпізнавання дат.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            3. Ваш обліковий запис
          </h2>
          <p className="mt-1">
            Ви відповідаєте за збереження доступу до свого Google-акаунта, через який
            відбувається вхід у Застосунок.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            4. Зміни умов
          </h2>
          <p className="mt-1">
            Ці умови можуть змінюватись. Актуальна версія завжди доступна на цій сторінці.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            5. Контакти
          </h2>
          <p className="mt-1">korbutyak.oleg@gmail.com</p>
        </section>
      </div>
    </div>
  );
}
