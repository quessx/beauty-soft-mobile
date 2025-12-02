export type TOauth2Response = {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string;
    scope: string;
    token_type: string;
    session_state: string;
    refresh_expires_in: number;
    'not-before-policy': number;
};

export type TParsedToken = {
    exp: number; // Время истечения токена (в секундах с 1970-01-01)
    iat: number; // Время выдачи токена (в секундах с 1970-01-01)
    iss: string; // Issuer (кто выдал токен)
    sub: string; // Subject (кому выдан токен)
    aud: string; // Audience (для кого предназначен токен)
    azp: string; // Authorized party (кто авторизован)
    scope: string; // Разрешенные области доступа
    jti: string; // JWT ID
    reuse_id: string; // ID для повторного использования
    sid: string; // Session ID
    typ: string; // Тип токена
};