export interface User {
    email: string;
    id: string;
    name?: string;
    picture?: string;
    password?: string;
}

export interface Message {
    type: string;
    userId: string;
    group_id: string;
    text: string;
    created_at: Date;
}


export interface Group {
    id: number;
    title: string;
    users: { email: string }[];
    messages?: Message[];

}
