# BeautySoftMobile

## Описание проекта

BeautySoftMobile — это мобильное приложение, разрабатываемое с использованием Angular. Проект реализуется в соответствии с архитектурой Feature-Sliced Design (FSD), что обеспечивает масштабируемость, модульность и удобство поддержки кода.

### Архитектура FSD

Feature-Sliced Design (FSD) — это подход к организации фронтенд-проектов, основанный на разделении кода по функциональным признакам (features), слоям и областям ответственности.

#### Слои проекта

В данном проекте используются следующие слои (располагаются сверху вниз, где верхний — app, нижний — shared):

1. **app** — верхний слой, отвечает за инициализацию приложения, глобальные настройки и интеграцию слоёв.
2. **routes** — слой маршрутизации, определяет маршруты и навигацию между страницами.
3. **pages** — слой страниц, каждая страница объединяет виджеты и фичи для отображения конкретного экрана.
4. **widgets** — независимые UI-блоки, которые могут использоваться на страницах.
5. **features** — реализуют бизнес-функционал, объединяя сущности и логику.
6. **entities** — бизнес-сущности, модели и их логика.
7. **shared** — общий слой, содержит переиспользуемые компоненты, утилиты, типы и стили.

Слои располагаются сверху вниз в том же порядке, как и перечислены выше: `app` — верхний слой, `shared` — нижний. Верхние слои могут использовать нижние, но не наоборот.

Подробнее об архитектуре FSD: [https://feature-sliced.design/ru/docs](https://feature-sliced.design/ru/docs)

---

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Стиль кода

Правила оформления кода вынесены в отдельный файл: [CODE_STYLE.md](./CODE_STYLE.md)
