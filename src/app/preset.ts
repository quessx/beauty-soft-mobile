import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const primePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50:  '#F0FBFF',
            100: '#D6F4FB',
            200: '#ACECF7',
            300: '#82E4F3',
            400: '#5ADCF0',
            500: 'var(--Main, #8DE1F8)',
            600: '#73C8ED',
            700: '#59AEDF',
            800: '#3F95D1',
            900: '#267BBF',
            950: '#105CA0'
        },
        colorScheme: {
            light: {
                primary: {
                    contrastColor: '#14151A'
                },
                formField: {
                    borderColor: 'var(--border-action-normal)',
                    hoverBorderColor: 'var(--border-action-normal, #DEE0E3)',
                    placeholderColor: 'var(--text-base-tertiary)',
                    shadow: 'none',
                    color: 'var(--text-base-primary, #14151A)',
                    floatLabelColor: 'var(--text-base-tertiary)',
                }
            },
            dark: {
                //...
            }
        },
    },
    components: {
        inputtext: {
            root: {
                borderRadius: 'var(--measurements-radius-xxl)',
                lg: {
                    fontSize: 'var(--typography-size-body-s)',
                    paddingY: 'var(--numbers-9)',
                    paddingX: 'var(--numbers-12)',
                }
            }
        },
        select: {
            root: {
                borderRadius: 'var(--measurements-radius-xxl)',
                hoverBorderColor: 'var(--Main, #8DE1F8)',
                lg: {
                    fontSize: 'var(--typography-size-body-s)',
                    paddingY: 'var(--numbers-9)',
                    paddingX: 'var(--numbers-12)',
                }
            },
        },
        floatlabel: {
            root: {
                activeColor: 'var(--text-base-tertiary, rgba(13, 17, 38, 0.40))',
                fontWeight: '400',
                active: {
                    fontSize: 'var(--floatlabel-active-font-size, 10.5px)'
                }
            }
        }
    }
})
