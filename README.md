# FaberLab

Статический сайт без сборки, предназначенный для GitHub Pages. Для локального просмотра запустите `python -m http.server 4173` в этой папке.

## Заявки на почту

Форма использует сервис FormSubmit и отправляет заявки на `faberlab@inbox.ru`. При первой отправке FormSubmit пришлёт письмо со ссылкой для активации: откройте письмо и подтвердите адрес, иначе заявки не будут доставляться. Проверьте папку «Спам», затем отправьте пробную заявку и убедитесь, что она пришла. Данные формы обрабатывает сторонний сервис FormSubmit.

## GitHub Pages и собственный домен

В настройках репозитория Settings → Pages укажите Deploy from a branch, ветку `main`, папку `/ (root)`. Для подключения домена сначала добавьте его в Settings → Pages → Custom domain, а затем настройте DNS у регистратора. Для `www` создайте CNAME `www` → `tor4narek.github.io`. Для корневого домена настройте записи, указанные в документации GitHub. После выпуска сертификата включите Enforce HTTPS.

Документация: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
