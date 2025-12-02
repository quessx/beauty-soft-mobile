import { AppointmentJsonldAppointmentRead } from "@api/index";

export const APPOINTMENT_COLORS: Record<AppointmentJsonldAppointmentRead.ColorEnum | "not_selected", string> = {
    not_selected: "#E3E3E3",
    red: '#F86D61',
    green: '#73BF75',
    yellow: '#FFEF6C',
    blue: '#4682b4',
    orange: '#FFA07A',
    purple: '#B18FCF'
};