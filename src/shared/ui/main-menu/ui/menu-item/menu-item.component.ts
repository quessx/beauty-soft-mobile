import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExpendableIconComponent } from '@icons/expendable-icon';
import { IMenuItem } from '@ui/main-menu';
import { TextComponent } from "@ui/text";
import { TranslatePipe } from 'beauty-soft-common';

@Component({
    selector: 'bsm-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    imports: [CommonModule, ExpendableIconComponent, TextComponent, TranslatePipe]
})
export class MenuItemComponent {
    @Input({ required: true }) item: IMenuItem | null = null;
}
