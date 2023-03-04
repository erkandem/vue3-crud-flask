# Vue + Flask SPA

Source: https://testdriven.io/blog/developing-a-single-page-app-with-flask-and-vuejs/
Code: https://github.com/testdrivenio/flask-vue-crud

## 1 Objectives

**Contents:**

 - Flask 
   - Python
   - REST
 - Vue
   - JS
   - SPA
   - Components
   - Vue CLI
   - comparison to other Frameworks
 - Bootstrap
   - CSS

**Tech Setup**

| Tech       | Tutorial | My Setup     |
|------------|----------|--------------|
| Vue        | 2.6.11   |              |
| Vue CLI    | 4.5.11   | -            |
| Vite       | -        | 4.1.4        |
| plugin-vue | -        | 1.9.0        |
| Node       | 15.7.0   | 18.14.2      |
| npm        | 7.4.3    | 9.5.0        |
| Flask      | 1.1.2    |              |
| Python     | 3.9.2    | 3.11.2       |


Sections:
 - Objectives
 - Flask and Vue
 - Flask Setup
 - Vue Setup
 - Bootstrap Setup
 - What are we Building?
 - GET Route
 - Bootstrap Vue
 - POST Route
 - Alert Component
 - PUT Route
 - DELETE Route
 - Conclusion

## 2 Flask and Vue

#### Flask
...
#### Vue

Comparison to other frameworks: https://vuejs.org/v2/guide/comparison.html
TDD Tutorial: https://testdriven.io/courses/learn-vue/

## 3 Flask Setup

 - code is placed in the `server` directory
 - pip tools to manage deps
 - created a test for the route in the tutorial

## 4 Vue Setup

### Node Environment 
In the `client` directory run:

    npm init vue@latest
    npm install

Currently `vite` is used to scaffold a Vue project which we are guided through
during installation.

The dummy page can be served on local dev server with 

    npm run dev

### Overwrite Dummy App

I created components for the header, main and footer part of the HTML.

```sh
$ tree ./src -A
./src
├── App.vue
├── assets
├── components
│   ├── CoreComponent.vue
│   ├── FooterComponent.vue
│   ├── HeaderComponent.vue
│   └── __tests__
│       ├── App.spec.js
│       ├── CoreComponent.spec.js
│       ├── FooterComponent.spec.js
│       └── HeaderComponent.spec.js
└── main.js
```

For now, they are static. The components are pieced together in `App.vue`.
The complete app is then imported into `main.js` and createApp is used to
get a Vue instance.

The syntax for component names requires at least two words to avoid
future collisions with HTML tags, which are one word tags.

### Initial Test coverage

There is not much to test here. But the modules exist so let's cover them.
The syntax for test files is `<ComponentName>.spec.js`.

Test modules:

 - HeaderComponent.spec.js: check that the rendered component has one `header` tag
 - FooterComponent.spec.js :check that the rendered component has one `footer` component
 - CoreComponent.spec.js: check that the rendered component has one `main` component
 - App.spec.js: check that the subcomponents are mounted into the wrapper component
