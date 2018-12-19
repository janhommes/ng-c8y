import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  CoreModule,
  BootstrapComponent,
  CommonModule,
  HOOK_OPTIONS,
  HOOK_NAVIGATOR_NODES,
  NavigatorNode
} from '@c8y/ngx-components';
import { HelloComponent } from './hello/hello.component';
import { MoreComponent } from './more/more.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HelloComponent
        },
        {
          path: 'more',
          component: MoreComponent
        }
      ],
      { enableTracing: false, useHash: true }
    ),
    CoreModule,
    CommonModule
  ],
  bootstrap: [BootstrapComponent],

  // You need to provide some options to the app to
  // allow deployment to the Cumulocity platform
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
        get: () => ([
          {
            label: 'Hello',
            path: '',
            icon: 'star'
          }, {
            label: 'More',
            path: '/more',
            icon: 'rocket'
          }
        ])
      },
      multi: true
    }
  ],

  declarations: [HelloComponent, MoreComponent]
})
export class AppModule {}
