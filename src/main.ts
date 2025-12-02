import { bootstrapApplication } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

async function initCapacitorPlugins() {
    if (Capacitor.getPlatform() !== 'web') {
        await SafeArea.getSafeAreaInsets().then((insets: SafeAreaInsets) => {
            document.documentElement.style.setProperty('--safe-area-inset-top', insets.insets.top + 'px');
            document.documentElement.style.setProperty('--safe-area-inset-bottom', insets.insets.bottom + 'px');
        });
    }

}

await initCapacitorPlugins();

bootstrapApplication(AppComponent, appConfig)
    .catch((err: unknown) => console.error(err));
