export interface User {
    email: string;
    id: number;
    name?: string;
    picture?: string;
    password?: string;
}

// provide message interface with id not obligatory operationnal
export interface Message {
    id?: number;
    userId: number;
    groupId: number;
    text: string;
    action: string;
    type: string;
    created_at: Date;
}

export interface Group {
    id: number;
    title: string;
    users: { email: string }[];
    messages?: Message[];

}
