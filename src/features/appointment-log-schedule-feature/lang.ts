import { TLangObject } from "@i18n/lang.types";

export const langData: TLangObject = {
    ru: {
        appointment_page_front: {
            routes: {
                visit_history: "История посещений",
                details: "Детали документа",
                change_history: "История изменений",
                card_client: "Карточка клиента",
                loyalty: "Лояльность",
            },
            buttons: {
                save: "Сохранить",
                delete: "Удалить запись"
            },
            success: {
                status: "Статус изменен",
                changed: "Изменения сохранены",
                deleted: "Запись удалена",
            },
            errors: {
                required: "Обязательное поле",
                deleted: "Ошибка удаления записи"
            },
            checkbox_popup: {
                center_text: 'Фильтр',
                entities_title: 'Сотрудники'
            }
        }
    },
}
