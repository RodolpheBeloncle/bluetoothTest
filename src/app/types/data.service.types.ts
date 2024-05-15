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
    groupId: string;
    text: string;
    createdAt: Date;
}


export interface Group {
    id: number;
    title: string;
    users: { email: string }[];
    messages?: Message[];

}
