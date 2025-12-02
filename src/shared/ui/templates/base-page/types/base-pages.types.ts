export namespace BasePageTypes {
   export const TBasePageType = {
        Default: 'default',
        Fixed: 'fixed',
    } as const;
    export type TBasePageType = typeof TBasePageType[keyof typeof TBasePageType];
}