import { TLangObject } from "@i18n/lang.types";

export const langData: TLangObject = {
    ru: {
        appointment_details_widget: {
            details_info: {
                titles: {
                    specialist: "Специалист",
                    client: "Клиент",
                    state: "Статус"
                },
                comment_placeholder: "Комментарий",
                specialists_popup: {
                    client: {
                        wrapper: {
                            close_button: 'Назад',
                            success_Button: 'Добавить',
                            label: 'Клиент',
                            icon: 'plus'
                        },
                        empty_state: {
                            title: 'Клиент не найден',
                            placeholder: 'Проверьте написание или создайте нового, если его ещё нет в базе.',
                            button: 'Создать нового клиента'
                        }
                    },
                    specialist: {
                        wrapper: {
                            close_button: 'Назад',
                            success_Button: '',
                            label: '',
                            icon: 'plus'
                        },
                        empty_state: {
                            title: 'Специалист не найден',
                            placeholder: 'Проверьте написание или создайте нового, если его ещё нет в базе.',
                            button: ''
                        }
                    }
                }
            }
        }
    },
}
