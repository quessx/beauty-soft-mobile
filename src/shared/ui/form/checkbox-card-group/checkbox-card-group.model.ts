import { computed, signal, Signal, WritableSignal } from "@angular/core";
import { TCheckboxCardGroup, TCheckboxCardItem } from "./checkbox-card-group.types";
import { CdkAccordionItem } from "@angular/cdk/accordion";

// Возможные режимы выбора (на будущее, сейчас используется только multi / single флагом в компоненте)
export enum SelectionMode {
    Single = 'single',
    Multiple = 'multiple'
}

export class CheckboxCardGroupModel {
    private readonly data: TCheckboxCardGroup[] = [];
    private totalItems = 0;
    readonly totalSelected: WritableSignal<string[]> = signal([]);
    readonly isTotalSelected: Signal<boolean> = computed(() => this.totalItems > 0 && this.totalItems === this.totalSelected().length);

    // Режим будущего расширения (пока компонент задаёт multi = true/false)
    constructor(data: ReadonlyArray<TCheckboxCardGroup>, private readonly mode: SelectionMode = SelectionMode.Multiple) {
        // Копируем верхний уровень (избегаем мутаций исходного массива извне)
        this.data = [...data];
        this.recountTotalItems();
        this.recalculateTotalSelected();
    }

    // универсальный обход всех групп (включая вложенные)
    private traverseGroups(groups: ReadonlyArray<TCheckboxCardGroup>, cb: (g: TCheckboxCardGroup) => void): void {
        for (const g of groups) {
            cb(g);
            if (g.groups?.length) this.traverseGroups(g.groups, cb);
        }
    }

    private findGroupById(id: string, groups: ReadonlyArray<TCheckboxCardGroup> = this.data): TCheckboxCardGroup | undefined {
        for (const g of groups) {
            if (g.id === id) return g;
            if (g.groups?.length) {
                const found = this.findGroupById(id, g.groups);
                if (found) return found;
            }
        }
        return undefined;
    }

    private flattenItems(): TCheckboxCardItem[] {
        const items: TCheckboxCardItem[] = [];
        this.traverseGroups(this.data, g => items.push(...g.items));
        return items;
    }

    private recountTotalItems(): void {
        this.totalItems = 0;
        this.traverseGroups(this.data, g => this.totalItems += g.items.length);
    }

    private recalculateTotalSelected(): void {
        const collected: string[] = [];
        this.traverseGroups(this.data, (group) => {
            if (group.selectedItems) collected.push(...group.selectedItems());
            else if (group.selected && group.selected()) collected.push(group.selected());
        });
        // Убираем дубликаты (на всякий случай)
        const unique = Array.from(new Set(collected));
        this.totalSelected.set(unique);
    }

    // Deprecated public helpers (оставлены как protected – можно удалить позже, пока не используем, но сохраняем контракт)
    protected addTotalSelected(id: string): this { if (!this.totalSelected().includes(id)) this.totalSelected.set([...this.totalSelected(), id]); return this; }
    protected removeTotalSelected(id: string): this { if (this.totalSelected().includes(id)) this.totalSelected.set(this.totalSelected().filter(i => i !== id)); return this; }

    public getItems(): readonly TCheckboxCardGroup[] { return this.data; }

    public getAllItemsFlat(): readonly TCheckboxCardItem[] { return this.flattenItems(); }

    public updateAll(flag: boolean): void {
        this.traverseGroups(this.data, (group) => {
            group.selectedItems ??= signal<string[]>([]);
            if (flag) {
                const ids = group.items.map(i => i.id);
                group.selectedItems.set(ids);
                group.items.forEach(item => item.selected.set(item.id));
            } else {
                group.selectedItems.set([]);
                group.items.forEach(item => item.selected.set(''));
            }
        });
        this.recalculateTotalSelected();
    }

    public updateGroup(flag: boolean, groupId: string, item?: CdkAccordionItem): boolean {
        const group = this.findGroupById(groupId);
        if (!group) return false;
        group.selectedItems ??= signal<string[]>([]);
        if (flag) {
            const ids = group.items.map(i => i.id);
            group.selectedItems.set(ids);
            group.items.forEach(i => i.selected.set(i.id));
            item?.open();
        } else {
            group.selectedItems.set([]);
            group.items.forEach(i => i.selected.set(''));
            item?.close();
        }
        this.recalculateTotalSelected();
        return true;
    }

    public updateItem(flag: boolean, groupId: string, itemId: string): boolean {
        const group = this.findGroupById(groupId);
        if (!group) return false;
        group.selectedItems ??= signal<string[]>([]);
        const item = group.items.find(i => i.id === itemId);
        if (!item) return false;

        if (flag) {
            // В режиме Single можно было бы очистить остальные – оставляем точку расширения
            if (this.mode === SelectionMode.Single) {
                // сбрасываем все внутри группы
                group.selectedItems.set([]);
                group.items.forEach(i => i.selected.set(''));
            }
            if (!group.selectedItems().includes(itemId)) {
                group.selectedItems.set([...group.selectedItems(), itemId]);
            }
            item.selected.set(item.id);
        } else {
            if (group.selectedItems().includes(itemId)) {
                group.selectedItems.set(group.selectedItems().filter(id => id !== itemId));
            }
            item.selected.set('');
        }
        this.recalculateTotalSelected();
        return true;
    }
}
