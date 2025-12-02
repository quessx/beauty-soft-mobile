import { TLangObject } from "@i18n/lang.types";


export const langData: TLangObject = {
    ru: {
        clients_details_page_front: {
            header: {
                text: "Карточка клиента",
            },
            input: {
                name: {
                    label: "Имя",
                    placeholder: "Введите имя"
                },
                last_name: {
                    label: "Фамилия",
                    placeholder: "Введите фамилию"
                },
                phone: {
                    label: "Телефон",
                    placeholder: "Введите телефон"
                },
                email: {
                    label: "E-mail",
                    placeholder: "Введите e-mail"
                },
                gender: {
                    label: "Пол",
                    options: {
                        'male': "Мужской",
                        "female": "Женский",
                        'unknown': "Не выбрано"
                    }
                },
                discount: {
                    label: "Скидка",
                    placeholder: "Введите скидку"
                },
                birth_date: {
                    label: "Дата рождения",
                    placeholder: "Выберите дату рождения"
                },
                note: {
                    label: "Примечание",
                    placeholder: "Введите примечание"
                }
            },
            buttons: {
                add: "Добавить",
            },
            tooltips: {
                primaryPhone: "Основной номер",
            },
            footer: {
                expense: "Сумма затрат:",
                visit_prefix: "за",
                visits: {
                    one: "посещение",
                    few: "посещения",
                    many: "посещений"
                },
            },
            success_info: {
                success: "Данные обновлены",
                error: "Ошибка"
            }
        }
    },
}
