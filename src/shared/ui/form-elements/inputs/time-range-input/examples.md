# Примеры использования TimeRangeInputComponent

## Базовое использование

```html
<app-time-range-input 
    [startTime]="'09:00'"
    [endTime]="'17:00'">
</app-time-range-input>
```

## С обработчиком событий

```html
<app-time-range-input 
    [startTime]="workStartTime"
    [endTime]="workEndTime"
    (timeChange)="onWorkTimeChange($event)">
</app-time-range-input>
```

## В Reactive Form

```typescript
// В компоненте
this.scheduleForm = this.fb.group({
  workTime: this.fb.control({
    startTime: '08:00',
    endTime: '18:00'
  })
});
```

```html
<!-- В шаблоне -->
<app-time-range-input 
    formControlName="workTime">
</app-time-range-input>
```

## Отключенное состояние

```html
<app-time-range-input 
    [startTime]="'10:00'"
    [endTime]="'11:00'"
    [disabled]="true">
</app-time-range-input>
```

## С placeholder

```html
<app-time-range-input 
    [startTime]="''"
    [endTime]="''"
    [placeholder]="'Введите время'>
</app-time-range-input>
```
