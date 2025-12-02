# TimeRangeInputComponent

Компонент для ввода диапазона времени с двумя полями времени, разделенными дефисом.

## Использование

```html
<app-time-range-input 
    [startTime]="'14:00'"
    [endTime]="'15:00'"
    [disabled]="false"
    [placeholder]="'Введите время'"
    (timeChange)="onTimeChange($event)">
</app-time-range-input>
```

## Входные параметры (Inputs)

- `startTime: string` - начальное время (по умолчанию: '')
- `endTime: string` - конечное время (по умолчанию: '')
- `disabled: boolean` - состояние отключения (по умолчанию: false)
- `placeholder: string` - placeholder для полей ввода (по умолчанию: '')

## Выходные события (Outputs)

- `timeChange: EventEmitter<{startTime: string, endTime: string}>` - событие изменения времени

## Особенности

- Реализует интерфейс `ControlValueAccessor` для интеграции с Angular Reactive Forms
- Поддерживает двустороннее связывание данных
- Адаптивный дизайн для мобильных устройств
- Стилизация в соответствии с дизайн-системой проекта
