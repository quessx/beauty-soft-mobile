import { TLangObject } from "./lang.types";

export const generalLangData: TLangObject = {
    ru: {
        front_general: {
            titles: {
                employees: "Сотрудники",
                clients: "Клиенты",
                summary: "Summary",
                salaries: "Salaries",
                booking: "Журнал записи",
                loyalty: "Лояльность",
                settings: "Настройки",
                registration: "Регистрация"
            },
            page_titles: {
                registration: {
                    company: 'Регистрация компании',
                    user: 'Регистрация пользователя',
                    sent_email: 'Отправка письма'
                }
            },
            paginator: {
                selected: "Выбрано:",
                items_per_page: "Результатов на странице:"
            },
            placeholders: {
                not_selected: "Не выбрано"
            },
            visit_state: {
                waiting: 'В ожидании',
                arrived: 'Пришёл',
                not_arrived: 'Не пришёл',
                confirmed: 'Подтвердил',
                cancelled: 'Отменил'
            },
            pay_status: {
                paid: 'Оплачено',
                unpaid: 'Не оплачено'
            },
            date: {
                months: "января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря"
            },
            time: {
                hour: {
                    abbreviation: "ч"
                },
                minute: {
                    abbreviation: "мин"
                },
                set_duration: "{{hour}} ч {{minute}} мин",
            },
            search_service_options: {
                goods: "Добавить товар",
                services: "Добавить услугу"
            },
            filter: {
                buttons: {
                    clear: 'Очистить',
                    select: 'Выбрать',
                }
            },
            buttons: {
                save: "Сохранить",
                paid: "Оплатить"
            },
            inputs: {
                search: "Поиск"
            },
            access_error: 'Недостаточно прав для совершения операции',
            errors: {
                phone_form_invalid: 'Неверный формат телефона',
            },
        }

    }
}
