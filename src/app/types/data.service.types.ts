export interface User {
    email: string;
    id: number;
    name?: string;
    picture?: string;
    password?: string;
}

export interface Message {
    type: string;
    userId: number;
    groupId: number;
    text: string;
    created_at: Date;
    action: string;
}


export interface Group {
    id: number;
    title: string;
    users: { email: string }[];
    messages?: Message[];

}
