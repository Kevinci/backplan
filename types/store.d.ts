import { Event } from "./event";

export interface Store {
    id: string;
    name?: string;
    location: string;
    description: string;
    events: Event[];
}