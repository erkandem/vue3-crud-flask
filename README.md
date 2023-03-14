# Vue + Flask SPA

Source: https://testdriven.io/blog/developing-a-single-page-app-with-flask-and-vuejs/
Code: https://github.com/testdrivenio/flask-vue-crud

follow ons:
 - deployment: https://testdriven.io/blog/deploying-flask-to-heroku-with-docker-and-gitlab/
 - checkout functionality: https://testdriven.io/blog/accepting-payments-with-stripe-vuejs-and-flask/
 - very interesting 3 approaches: https://testdriven.io/blog/combine-flask-vue/


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

| Tech          | Tutorial | My Setup |
|---------------|----------|----------|
| Vue           | 2.6.11   | 3.2.47   |
| Vue CLI       | 4.5.11   | -        |
| Vite          | -        | 4.1.4    |
| plugin-vue    | -        | 1.9.0    |
| Node          | 15.7.0   | 18.14.2  |
| npm           | 7.4.3    | 9.5.0    |
| Flask         | 1.1.2    | 2.2.3    |
| Python        | 3.9.2    | 3.11.2   |
| Bootstrap     | 4.6.0    | 4.6.2    |


Sections:
 - 1 Objectives
 - 2 Flask and Vue
 - 3 Flask Setup
 - 4 Vue Setup
 - 5 Bootstrap Setup
 - 6 What are we Building?
 - 7 GET Route
 - 8 Bootstrap Vue
 - 9 POST Route
 - 10 Alert Component
 - 11 PUT Route
 - 12 DELETE Route
 - 13 Conclusion

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


### Adding CSS

One way to add external CSS is to have the `.css` files in the `assets/css/`.
A `main.css` is created and both are imported into it

```css
@import './normalize.css';
@import './sakura.css';
```

Finally, the `main.css` is imported into `main.js`

```js 
import './assets/css/main.css'
```

### Connecting to the API

 - used `axios` to make "XHR" calls
 - import that we used the `Flask-CORS` plugin in Flask
   to allow for such request in case the backend is
   accessed via a different domain.
   See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 - wrote a utility to reuse the schema of the backendApi in `backendSchema`
 - defined a reactive variable to store the result and initialized it
 - wrote the `getPing` function to call the backend API  and
 - connected `getPing` to the `onMounted` hook
 - rendered the result in the target location in the template
 - extended the test of `CoreComponent` to use the axios library and it's mock-adapter
 - flush promises and await it before inspecting ;)


### Code Coverage

 - c8 can be used for code coverage stats
 - there is a Vitest plugin to get it working
```sh
npm install @vitest/coverage-c8 --save-dev
```
 - added `"testcov": "vitest --coverage",` script to `package.json`
 - static HTML and JSON on code coverage:
```js
// vitest.config.js
//...
    test: {
       coverage: {
          provider: 'c8', 
          reporter: ['json', 'html']
       }
       //...
    }
```
### IntelliJ integration
https://vitest.dev/guide/debugging.html#intellij-idea

> Create a 'Node.js' run configuration. Use the following settings to run all tests in debug mode:


| Setting                | Value                            |
|------------------------|----------------------------------|
| Working directory      | /path/to/your-project-root       |
| JavaScript file	       | ./node_modules/vitest/vitest.mjs |
| Application parameters | run --threads false              |

### Refactor to match Tutorial

Did a TDD approach. Feels good. But how do you test that the features and code you moved
don't exist anymore on certain page? Hard to check for non-existence.

 - create a dummy HomeView and Home component
 - create PingView and Ping component
 - install the vue-router
 - configure PingView and HomeView to be plugged in the CoreComponents main element
 - refactor the backend call and onmount of ping from CoreComponent to the Ping component
 - Add navigation links to the HomeView and PingView into the HeaderComponent

Added a missing test for the case when the call on the ping endpoint fails.
 - throw a network error with the axios adapter
 - in case we don't get a 2xx
 - 
Structure of the app:
```
App [
   HeaderComponent
   CoreComponent [
      <main>
         <RouterView>
      </main>
   ]
   FooterComponent
]

RouterViews [
   HomeView [ HomeComponent ]
   PingView [ PingComponent ]
]
```
**Extra:**

 - check that specific subcomponents are present:
```js
mount(App).getComponent({name: 'SubComponentName'})
```

 - throwing a network error with the axios mock adapter
```js
axiosMock.onGet(url).networkError()
```

 - `createRouter`, `RouterLink` and `RouterView` components/factories
   API Doc for vue-router: https://router.vuejs.org/api/

 - `toBe` for primitives in `expect` of `vitest
   https://vitest.dev/api/expect.html#tobe

## 5 Bootstrap

[THAT one](http://getskeleton.com/) with much more features. 

### The Bootstrap Grid System

 - The B Grid system needs one top level `container` class (ideally one).
 - Each `row` class in a container will offer a split into columns.
 - The maximum number of columns is 12.
 - `col-sm-10` class e.g. offers 10/12 of the `col-sm`.
 - ❓ `sm` is a keyword for the breakpoint? so it's controlled manually instead of automatically?
 - ❓ wrap the header main and footer into row and col or 
   have row and col inside of them ?
https://getbootstrap.com/docs/4.0/layout/grid/


**Extras:**

 - The scope keyword can be omitted in the components style.
   It can also be combined with both a scope and unscoped component
   https://vue-loader.vuejs.org/guide/scoped-css.html#scoped-css

Love it:

> Now we can start building out the functionality of our CRUD app.

## 6 What are we Building?

Stated Mission Goal from testdriven.io
 - JSON restful backend via Python Flask
 - about 1 endpoint ("books")
 - Vue Front End to interact with that endpoint
And I will sprinkle in:
 - Tests for Flask
 - Tests for Vue

## 7 GET Route

We want to expose a list of book objects. Each objects shall have the field:
 - `title` containing the title of the book
 - `author` containing the author of the book
 - `read` a boolean indicating whether the book was already read (or not)

### Server Side
 - moved testing client and other fixtures into `conftest.py`, so pytest picks them up
 - created per route test modules
 - created tests for books route wrote the resolver and defined the route
 - wrapped the list of books into a getter

### Client Side
 - added constants module for e.g. strings
 - added books route to `backendSchema` object
 - added tests covering the behavior of the booksComponent on
   - success
   - error
   - network error
 - in addition to the tutorial added a `span` containing summarizing the result of the API call 

## 8 POST Route

https://www.rfc-editor.org/rfc/rfc9110.html#section-9.3.3

### server side
 - validation function for books using a schema dictionary
 - checks if record is duplicate


### client side
 - created a modal to render the form to add a book. however,...
 - ... bootsrap-vue modules do not work as expected, however having bootsrap css loaded anyway
   the modal can be styled manually with the tags needed
   - https://getbootstrap.com/docs/4.0/components/forms/
   - https://getbootstrap.com/docs/4.0/components/buttons/
   - https://testdriven.io/courses/learn-vue/updating-data-via-http-put/#H-9-editusermodal-component
 - bootstrap-vue-next does not work good enough either (Vue 3 Bootstrap 5)
 - I mocked axios many more times to avoid unintended http calls which I only noticed after I killed
   the backend which was coincidentally running during the tests
 - removed many `console.log` calls

## 10 Alert Component

 - only clientside code
 - bootsrap alert component: https://getbootstrap.com/docs/4.0/components/alerts/
 - alternative in bulma: https://bulma.io/documentation/elements/notification/
 - nice ranking if CSS frameworks: https://2021.stateofcss.com/en-US/technologies/css-frameworks
 - covered it with tests and implemented dismissability
 - could make sense to have and array of alerts

## 11 PUT Route

https://www.rfc-editor.org/rfc/rfc9110.html#section-9.3.4
https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2

### Server Side

 - wrote tests for the PUT route
 - left a note regarding schema validation
