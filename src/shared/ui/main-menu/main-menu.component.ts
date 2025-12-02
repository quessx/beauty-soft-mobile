import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { IMenuItem } from '.';
import { MenuItemComponent } from './ui/menu-item';

@Component({
    selector: 'bsm-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    imports: [MenuItemComponent, PanelMenuModule]
})
export class MainMenuComponent {
    public items: InputSignal<IMenuItem[]> = input<IMenuItem[]>([]);

    public clickMenuItemEvent: OutputEmitterRef<void> = output();

    public handleClickMenuItem(item: IMenuItem) {
        if (item.items && item.items.length > 0) {
            return;
        }
        this.clickMenuItemEvent.emit();
    }
}
