export type FormInputEvent = Event & {
    target: HTMLInputElement;
};

export interface IValidateableComponent {
    canValidate: boolean;
    error: string | null;
    value: any;
    validate(): Promise<boolean>;
}

export interface IImageUploadRules {
    exactHeight: number | null;
    exactWidth: number | null;
    landscapeOnly: boolean;
    maxHeight: number | null;
    maxKB: number | null;
    maxWidth: number | null;
    maxSize: number | null;
    portraitOnly: boolean;
    square: boolean;
}

export interface IImageUploadInfo {
    file: File | Blob;
    image: HTMLImageElement;
    size: number;
    src: string;
    name: string | null;
}

export interface IRadioButtonOption {
    value: any;
    label: string;
}

export interface IValidatorRule {
    validator: string;
    param?: string;
}

export interface IValidateRequest {
    value: string;
    param?: string;
    label?: string;
}

export type ValidatorFunction = (req: IValidateRequest) => string | null;