# FlashTune

Сервис подбора и продажи калибровок ЭБУ.

## Архитектура
- WordPress
- кастомная тема FlashTune
- WooCommerce для заказов и доступа после оплаты
- ЮKassa / PayKeeper как платежный шлюз
- закрытое файловое хранилище на VPS на старте
- каталог Firmware с массовым импортом

## Репозиторий
- `wp-content/themes/flashtune/` — тема WordPress
- `preview/` — статический прототип для GitHub Pages
- `docs/` — архитектура, аудит и решения проекта

## Важно
GitHub Pages используется только для статического превью интерфейса. PHP/WordPress на GitHub Pages не выполняется.
