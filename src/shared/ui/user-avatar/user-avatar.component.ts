import { ChangeDetectorRef, Component, forwardRef, HostBinding, Input, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PencilIconComponent } from '@icons/pencil';
import { AvatarModule } from 'primeng/avatar';
import { TShape, TSize } from './types';

@Component( {
    selector: 'bsm-user-avatar',
    templateUrl: './user-avatar.component.html',
    styleUrls: ['./user-avatar.component.scss'],
    imports: [AvatarModule, PencilIconComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => UserAvatarComponent ),
            multi: true
        }
    ]
} )
export class UserAvatarComponent implements ControlValueAccessor {
    private defAvatar: string = 'avatar.svg';
    public shape: InputSignal<TShape> = input<TShape>( 'circle' );
    public size: InputSignal<TSize> = input<TSize>( 'xlarge' );
    public uploadFile: OutputEmitterRef<File> = output();
    @Input() public avatar: string = this.defAvatar;
    @HostBinding( 'attr.action' ) @Input() public action: 'icon' | 'full' = 'icon';

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

    protected onUploadFile( file: File ): void {
        console.debug( 'Uploaded file:', file );
    }

    protected onImageError( event: Event ): void {
        console.error( 'Image load error:', event );
        this.avatar = this.defAvatar;
    }

    protected onChangeImage( ev: Event ): void {
        if ( !( ev.target instanceof HTMLInputElement ) ) {
            return;
        }
        const files: FileList | null = ev.target.files;
        if ( !files || files.length === 0 ) {
            return;
        }
        const file: File = files[0];
        this.uploadFile.emit( file );

        const reader = new FileReader;
        reader.onload = ( e: ProgressEvent<FileReader> ) => {
            const result: string | ArrayBuffer | null | undefined = e.target?.result;
            if ( typeof result === 'string' ) {
                this.avatar = result;
                this.onChange( result );
                this.onTouched();
                this.cdr.markForCheck();
            }
        };
        reader.readAsDataURL( file );

        ev.target.value = '';
    }

    private onChange: ( value: string ) => void = () => { };
    private onTouched: () => void = () => { };

    setDisabledState( isDisabled: boolean ): void {

    }

    registerOnTouched( fn: any ): void {
        this.onTouched = fn;
    }

    registerOnChange( fn: any ): void {
        this.onChange = fn;
    }

    writeValue( img: string | null | undefined ): void {
        this.avatar = img || this.defAvatar;
        this.cdr.markForCheck();
    }
}
