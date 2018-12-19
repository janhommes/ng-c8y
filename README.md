# ng-c8y
This guide shows how you can setup the [@angular/cli](https://www.npmjs.com/package/@angular/cli), however It is recommend to use the [@c8y/cli](https://www.npmjs.com/package/@c8y/cli) because it brings branding and translation capabilities out of the box.

## Requirments
You need to have a tenant registered at http://cumulocity.com, git, node and npm installed.
 

## Getting started by cloning this repository
First get a local copy:
```
git clone janhommes/ng-c8y
npm install
```

Align the `./proxy.config.json` by replacing `http://demos.cumuloyity.com` with your tenant url:
```json
{
  "/apps/ng-c8y/**": {
    "target": "http://localhost:4200/",
    "pathRewrite": {
      "^/apps/ng-c8y": ""
    }
  },
  "/**!(apps)/**/*": {
    "target": "{{your-tenant-url}}",
    "changeOrigin": true,
    "secure": false,
    "ws": true
  }
}
```

Start the project by running serve with the proxy and disable auto-reload (not working currently with the Web Socket concept of Cumulocity):
```
ng serve --proxy-config=proxy.config.json --life-reload false
```

Point your browser to http://localhost:4200/apps/ng-c8y/. You should see the demo application and be able to login with your user and password.


## Getting started with a blank project
Install Angular cli:
```
npm install @angular/cli@6.2.8
```
> Note currently Cumulocity only support Angular 6

Create a new project:
```
ng new {{your-app-name}}
```

Add the @c8y dependencies and `rxjs-compat` (needed as ngx-bootstrap currently uses compatibility functions of rxjs):
```
npm install @c8y/style@9.21.0 @c8y/client@9.21.0 @c8y/ngx-components@9.21.0 rxjs-compat
```

Configure the proxy by adding a `./proxy.config.json` file:
```json
{
  "/apps/{{your-app-name}}/**": {
    "target": "http://localhost:4200/",
    "pathRewrite": {
      "^/apps/{{your-app-name}}": ""
    }
  },
  "/**!(apps)/**/*": {
    "target": "{{your-tenant-url}}",
    "changeOrigin": true,
    "secure": false,
    "ws": true
  }
}
```

Align the app-module to bootstrap the ngx-components:
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CoreModule, BootstrapComponent} from '@c8y/ngx-components';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([], { enableTracing: false, useHash: true }),
    CoreModule,
  ],
  bootstrap: [BootstrapComponent],
  
  // You need to provide some options to the app to
  // make it deployable to the Cumulocity platform
  providers: [
    { provide: HOOK_OPTIONS, useValue: {
      'name': '{{your-app-name}}',
      'contextPath': '{{your-app-name}}',
      'key': '{{your-app-name}}-application-key',
      'versions': {
        'ngx': '0.0.0'
      }
    }, multi: true}
  ]
})
export class AppModule {}
```

You need to add the bootstrapping component to your index.html and align the base-href:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{{your-app-name}}</title>
  <base href="apps/{{your-app-name}}/">

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <c8y-bootstrap></c8y-bootstrap>
</body>
</html>
```

Last step is to add the c8y styles as a global style import to the `angular.json`:
```
[...]
"styles": [
  { "input": "node_modules/@c8y/style/main.less", "bundleName": "c8ybranding" },
  "src/styles.css"
],
[...]
```

**Done**: Point your browser to http://localhost:4200/apps/{{your-app-name}}/. You should be able to login and see an empty application. You can now start to add a route to your app

## Adding your first route

Change to `app/src` and create your first component with the help of ng, e.g. `ng generate component hello`. Afterwards you need to align the `app.module.ts` and add the route:
```typescript
RouterModule.forRoot(
  [
    {
      path: '',
      component: HelloComponent
    }
  ],
  { enableTracing: false, useHash: true }
)
```
When you open the app you should see `Hello works`. You can now start to add [@c8y/ngx-components](https://www.npmjs.com/package/@c8y/ngx-components) to your app for example try `<c8y-title>Hello World</c8y-title>`.

## Adding navigator nodes
To enable the user to navigate through the app you can add navigator nodes. The prefered way of doing this is to add a hook to your module:

```typescript
providers: [
  {
    provide: HOOK_OPTIONS,
    useValue: {
      name: 'ng-demo',
      contextPath: 'ng-c8y',
      key: 'ng-c8y-application-key',
      versions: {
        ngx: '0.0.0'
      }
    },
    multi: true
  },
  {
    provide: HOOK_NAVIGATOR_NODES,
    useValue: {
      get: () => ([{
        label: 'Hello',
        path: '',
        icon: 'star'
      }, {
        label: 'More',
        path: 'more',
        icon: 'rocket'
      }])
    },
    multi: true
  }
]
```