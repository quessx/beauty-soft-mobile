# Specialist Component

## Описание

Компонент для выбора специалиста (мастера) или клиента с поддержкой множественного использования на одной странице.

## Архитектура

### Компонент-уровень изоляции

Каждый экземпляр `SpecialistComponent` имеет свою собственную изолированную инстанцию `SpecialistService`, что позволяет использовать несколько компонентов на одной странице без конфликтов состояния.

### Сервисы

#### SpecialistService (Component-level)
- **Scope**: Component-level (каждый компонент имеет свой экземпляр)
- **Назначение**: Управление локальным состоянием компонента
- **Ключевые поля**:
  - `selectOption` - выбранное значение
  - `optionsSignal` - список опций
  - `searchTerm` - поисковый запрос
  - `texts` - тексты для UI

#### SpecialistCoordinatorService (Root-level)
- **Scope**: Application-level (singleton)
- **Назначение**: Координация между компонентами и popup
- **Функции**:
  - Управление событиями открытия/закрытия popup
  - Передача данных активного компонента в popup
  - Синхронизация изменений обратно к активному компоненту

## Использование

```typescript
<bsm-specialist
    [options]="employeesStore.getPositionsTableItems()"
    [isShowIcon]="true"
    [texts]="getSpecialistTexts('specialist')"
    [state]="'master'"
    formControlName="employeeId">
</bsm-specialist>

<bsm-specialist
    [options]="clientsStore.getPositionsTableItems()"
    [texts]="getSpecialistTexts('client')"
    [state]="'client'"
    formControlName="clientId">
</bsm-specialist>
```

## Решенные проблемы

### Проблема: Конфликт состояния при множественном использовании

**До**: `SpecialistService` был синглтоном (`providedIn: 'root'`), что приводило к перезаписи состояния при использовании нескольких экземпляров компонента.

**После**: 
- `SpecialistService` предоставляется на уровне компонента (Component-level provider)
- Глобальная коммуникация вынесена в `SpecialistCoordinatorService`
- Каждый компонент имеет изолированное состояние

### Схема работы

```
┌─────────────────────┐     ┌─────────────────────┐
│ SpecialistComponent │     │ SpecialistComponent │
│   (Master)          │     │   (Client)          │
├─────────────────────┤     ├─────────────────────┤
│ SpecialistService   │     │ SpecialistService   │
│ (isolated instance) │     │ (isolated instance) │
└──────────┬──────────┘     └──────────┬──────────┘
           │                           │
           └────────┬──────────────────┘
                    │ register active
                    ▼
         ┌──────────────────────────┐
         │ SpecialistCoordinatorService │
         │      (singleton)          │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │ SpecialistPopupFeature    │
         │ (uses coordinator data)   │
         └───────────────────────────┘
```

## Best Practices

1. **Не инжектите SpecialistService напрямую** в другие компоненты - используйте `SpecialistCoordinatorService` для глобальной коммуникации
2. **Регистрация активного компонента** происходит автоматически при вызове `onSpecialistEvent()`
3. **Popup использует координатор** для доступа к данным активного компонента и синхронизации изменений

## Миграция с предыдущей версии

Если вы использовали `SpecialistService` в других компонентах для глобальной коммуникации:

```typescript
// Старый код
private specialistService: SpecialistService = inject(SpecialistService);
this.specialistService.getSpecialistSubjectAsObservable()...

// Новый код
private specialistCoordinator: SpecialistCoordinatorService = inject(SpecialistCoordinatorService);
this.specialistCoordinator.getSpecialistSubjectAsObservable()...
```
