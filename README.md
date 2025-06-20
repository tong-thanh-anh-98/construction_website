Setup project:
Install backend:

- cd "project name"
- composer create-project laravel/laravel backend

Install frontend ReactJs with vite:

- npm create vite@latest
- enter project name: frontend
- select react
- select javascript
  - cd "frontend name"
  - npm install
  - npm run dev

########################################################################
#################################################################
########################################################
################################################

Install Frontend:

- react bootstrap: npm install react-bootstrap bootstrap
- react-router-dom: npm i react-router-dom
- sass-embedded: npm i sass-embedded "OR" npm install -D sass-embedded
- Swiper React Components: npm i swiper
- React hook form: npm i react-hook-form
- React Toastify: npm i react-toastify
- React icons: npm install react-icons
- React Jodit WYSIWYG Editor: npm i jodit-react
- Installation lodash: npm i lodash
- Cài thư viện react-i18next (thêm đa ngôn ngữ):
- npm install react-i18next i18next i18next-http-backend i18next-browser-languagedetector
* cấu hình:
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['vi', 'en'],
    fallbackLng: 'vi',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

export default i18n;

########################################################################
#################################################################
########################################################
################################################

Install Backend:

- Install Laravel Sanctum: php artisan install:api
- Installing Intervention Image: composer require intervention/image
- Clear cache IntelliSense trong VSCode (Ctrl+Shift+P → “Reload Window”)|(Tùy chọn) Chạy lại composer dump-autoload nếu dùng CLI: composer dump-autoload
- Cài bản dịch Laravel chính thức (tiếng Việt, đa ngôn ngữ): composer require laravel-lang/lang
  => Sau đó publish:

* php artisan lang:add vi
* php artisan lang:add en
cấu hình trong AppServiceProvider:
public function boot(): void
    {
        $lang = request()->header('Accept-Language');
        if ($lang && in_array($lang, ['vi', 'en'])) {
            App::setLocale($lang);
        }
    }
