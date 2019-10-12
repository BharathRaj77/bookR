import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@app/shared';

import { ExamplesRoutingModule } from './examples-routing.module';
import { ExamplesComponent } from './examples/examples.component';
import { StockMarketComponent } from './stock-market/stock-market.component';
import { stockMarketReducer } from './stock-market/stock-market.reducer';
import { StockMarketEffects } from './stock-market/stock-market.effects';
import { StockMarketService } from './stock-market/stock-market.service';
import { ParentComponent } from './theming/parent/parent.component';
import { ChildComponent } from './theming/child/child.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { InternationalizationComponent } from './i18n/i18n.component';
import { SecuredService } from './authenticated/services/secured.service';
import { EditorAuthenticatedComponent } from './editorauthenticated/editorauthenticated.component';

@NgModule({
  imports: [
    SharedModule,
    ExamplesRoutingModule,
    StoreModule.forFeature('examples', {
      stocks: stockMarketReducer
    }),
    EffectsModule.forFeature([StockMarketEffects])
  ],
  declarations: [
    ExamplesComponent,
    StockMarketComponent,
    ParentComponent,
    ChildComponent,
    AuthenticatedComponent,
    EditorAuthenticatedComponent,
    InternationalizationComponent
  ],
  providers: [StockMarketService, SecuredService]
})
export class ExamplesModule {
  constructor() {}
}
