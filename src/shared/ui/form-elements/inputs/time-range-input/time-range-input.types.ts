// Type definitions for component
import { TuiTime } from '@taiga-ui/cdk';

export interface TimeRangeValue {
    startTime: string;
    endTime: string;
}

export interface TimeRangeValueTui {
    fromTime?: TuiTime | null;
    toTime?: TuiTime | null;
    startTime?: TuiTime | string | null;
    endTime?: TuiTime | string | null;
}
