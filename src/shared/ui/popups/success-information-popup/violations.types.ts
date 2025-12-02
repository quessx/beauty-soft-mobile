export type TViolations = TValidationResult[]

export type TValidationResult = {
    code: string;
    message: string,
    propertyPath: string;
}
