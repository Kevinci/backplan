import { Event } from "./event";

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    description: string;
    isAdmin: boolean;
    worktime: string;
    events: Event[];
}

