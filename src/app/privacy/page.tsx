import Link from "next/link";

export const metadata = {
  title: "Політика конфіденційності — My Perfect Day Planner",
};

export default function PrivacyPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto px-5 pt-6 pb-10">
      <Link
        href="/"
        className="mb-4 font-condensed text-xs font-bold uppercase tracking-wide text-brand-green underline underline-offset-2"
      >
        ← На головну
      </Link>

      <h1 className="font-condensed text-xl font-bold uppercase tracking-wide text-brand-text">
        Політика конфіденційності
      </h1>
      <p className="mt-1 text-xs text-brand-muted">
        My Perfect Day Planner · Останнє оновлення: 24.07.2026
      </p>

      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-brand-text">
        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            1. Загальні положення
          </h2>
          <p className="mt-1">
            «My Perfect Day Planner» (далі — «Застосунок») — особистий планувальник задач.
            Ця сторінка описує, які дані збирає Застосунок, як вони використовуються та
            зберігаються.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            2. Які дані ми збираємо
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Дані Google-акаунта</strong> — ім&apos;я, електронна адреса та фото профілю,
              які Google передає при вході через «Увійти через Google».
            </li>
            <li>
              <strong>Дані задач</strong> — текст, дата, час і тривалість задач, які ви вносите
              в Застосунок вручну або диктуєте голосом.
            </li>
            <li>
              <strong>Доступ до Google Calendar</strong> — лише за вашою окремою явною згодою.
              Використовується виключно для створення, оновлення та видалення подій в окремому
              календарі «My Perfect Day Planner», який Застосунок створює у вашому Google
              Calendar. Застосунок не читає й не змінює жодні інші ваші календарі чи події.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            3. Як ми використовуємо дані
          </h2>
          <p className="mt-1">
            Дані використовуються виключно для роботи функцій Застосунку: збереження та
            показ ваших задач, синхронізація з Google Calendar, розпізнавання дати/часу в
            тексті за допомогою AI. Дані не продаються, не передаються рекламодавцям і не
            використовуються для реклами чи профілювання.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            4. Де зберігаються дані
          </h2>
          <p className="mt-1">
            Дані задач та ваш обліковий запис зберігаються в базі даних Supabase (регіон ЄС,
            Франкфурт) і захищені політиками доступу на рівні рядків (Row Level Security) —
            доступ до ваших даних має лише ваш власний обліковий запис.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            5. Треті сторони
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Google</strong> — для входу через акаунт та (за згодою) синхронізації з
              Google Calendar.
            </li>
            <li>
              <strong>Supabase</strong> — база даних та автентифікація.
            </li>
            <li>
              <strong>Groq</strong> — обробляє текст ваших нотаток для розпізнавання задач,
              дат і часу за допомогою AI-моделі; текст передається лише для цієї обробки і не
              зберігається Groq довгостроково.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            6. Ваші права
          </h2>
          <p className="mt-1">
            Ви можете в будь-який момент відкликати доступ до Google Calendar через налаштування
            свого Google-акаунта (myaccount.google.com/permissions). Щоб повністю видалити свій
            обліковий запис і всі дані з Застосунку, напишіть на електронну адресу нижче.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            7. Діти
          </h2>
          <p className="mt-1">
            Застосунок не призначений для осіб віком до 16 років і свідомо не збирає дані таких
            осіб.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            8. Зміни в політиці
          </h2>
          <p className="mt-1">
            Ми можемо оновлювати цю політику. Дата останнього оновлення вказана вгорі сторінки.
          </p>
        </section>

        <section>
          <h2 className="font-condensed text-sm font-bold uppercase tracking-wide text-brand-green">
            9. Контакти
          </h2>
          <p className="mt-1">
            Питання щодо цієї політики або ваших даних — korbutyak.oleg@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
