export type UserType = {
    id: string;
    email: string;
    name: string;
    phone_number: string;
    picture: string | null;
};

export type LoginType = {
    email: string;
    password: string;
};

export type RegisterType = LoginType & {
    name: string;
    phone_number: string;
};

export type AuthUserType = {
    access_token: string;
    refresh_token: string;
    user: UserType;
};


