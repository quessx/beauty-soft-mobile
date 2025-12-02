# Text Component

Универсальный компонент для отображения текста с различными стилями и цветами.

## Использование

```html
<!-- Основной текст -->
<bsm-text type="body-s-medium" color="primary">
  Основной текст
</bsm-text>

<!-- Вторичный текст -->
<bsm-text type="caption-l" color="secondary">
  Вторичный текст
</bsm-text>

<!-- Ошибка -->
<bsm-text type="caption-l-medium" color="red">
  Сообщение об ошибке
</bsm-text>
```

## Параметры

### type (обязательный)
Определяет стиль типографики:
- `body-s-medium` - Основной текст 16px, medium
- `body-s` - Основной текст 16px, regular
- `caption-l-medium` - Текст 14px, medium
- `caption-l` - Текст 14px, regular

### color (обязательный)
Определяет цвет текста:
- `primary` - Основной цвет текста
- `secondary` - Вторичный цвет текста
- `tertiary` - Третичный цвет текста
- `quaternary` - Четвертичный цвет текста
- `red` - Красный цвет (для ошибок/предупреждений)
