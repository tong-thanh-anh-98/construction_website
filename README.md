########################################################################
#################################################################
SETUP PROJECTS
########################################################
################################################
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
PROJECT SETTINGS
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

Install Backend:
- Install Laravel Sanctum: php artisan install:api
- Installing Intervention Image: composer require intervention/image

- Clear cache IntelliSense trong VSCode (Ctrl+Shift+P → “Reload Window”)|(Tùy chọn) Chạy lại composer dump-autoload nếu dùng CLI: composer dump-autoload
+ 1. Reload Window (trong VSCode): Lệnh: Ctrl + Shift + P → gõ Reload Window → Enter
Mục đích:
- Làm mới hoàn toàn giao diện và trạng thái của VSCode.
- Khắc phục sự cố IntelliSense (gợi ý code, auto-complete).
- Tái khởi động các extension đang chạy (ví dụ: PHP Intelephense, Laravel Blade Snippets...).
- Cập nhật lại cây thư mục và cấu trúc dự án nếu VSCode chưa nhận ra các thay đổi file.

+ 2. composer dump-autoload
- Lệnh CLI trong Laravel/PHP: composer dump-autoload
Mục đích:
-Tái tạo file autoload (vendor/composer/autoload_classmap.php...) mà Composer sử dụng để tự động load các class trong dự án PHP.
- Được dùng khi bạn:
  + Tạo file class mới (controller, model, service...).
  + Xóa hoặc đổi tên class.
  + Gặp lỗi Class not found.
=> Composer autoload giúp PHP biết class nằm ở đâu để tự động require đúng file khi chạy.
